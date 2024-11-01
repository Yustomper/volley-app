# matches/views.py
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Match, Set, PlayerPerformance, PointEvent
from .serializers import MatchSerializer, SetSerializer, PlayerPerformanceSerializer
from django.db.utils import IntegrityError
from django.db import transaction
from django.db.models import F
from django.core.exceptions import ValidationError
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 100

class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    @action(detail=True, methods=['POST'])
    def start_match(self, request, pk=None):
        try:
            match = self.get_object()

            if match.status != 'upcoming':
                return Response(
                    {"error": "El partido ya ha comenzado"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            with transaction.atomic():
                # Verificar si ya existe un set inicial
                initial_set, created = Set.objects.get_or_create(
                    match=match,
                    set_number=1,
                    defaults={
                        'home_team_score': 0,
                        'away_team_score': 0,
                        'home_timeouts': 0,
                        'away_timeouts': 0
                    }
                )

            # Verificar y crear performances solo si no existen
                performances = []
                for player in list(match.home_team.players.all()) + list(match.away_team.players.all()):
                    performance, created = PlayerPerformance.objects.get_or_create(
                        player=player,
                        match=match,
                        defaults={
                            'points': 0,
                            'spike_points': 0,
                            'block_points': 0,
                            'aces': 0,
                            'errors': 0
                        }
                    )
                    performances.append(performance)

                # Actualizar estado del partido
                match.start_time = timezone.now()
                match.status = 'live'
                match.save()

                return Response({
                    "status": "success",
                    "message": "Partido iniciado",
                    "start_time": match.start_time,
                    "match_data": {
                        "current_set": 1,
                        "home_score": initial_set.home_team_score,
                        "away_score": initial_set.away_team_score,
                        "player_performances": PlayerPerformanceSerializer(performances, many=True).data
                    }
                })

        except IntegrityError as e:
            return Response(
                {"error": "Error de integridad en la base de datos: " +
                    str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Error inesperado: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['POST'])
    def end_match(self, request, pk=None):
        match = self.get_object()
        if match.start_time is None:
            return Response({"error": "Match has not started yet"}, status=status.HTTP_400_BAD_REQUEST)
        if match.status != 'live':
            return Response({"error": "El partido no está en vivo"}, status=status.HTTP_400_BAD_REQUEST)

        end_time = timezone.now()
        match.duration = end_time - match.start_time
        match.status = 'finished'
        match.end_time = end_time
        match.save()
        return Response({"message": "El partido ha finalizado", "duration": match.duration})

    @action(detail=True, methods=['POST'])
    def suspend_match(self, request, pk=None):
        match = self.get_object()
        if match.status != 'live':
            return Response({"error": "El partido no está en vivo"}, status=status.HTTP_400_BAD_REQUEST)

        match.status = 'suspended'  # Cambiar el estado a "Suspendido"
        match.save()

        return Response({"message": "El partido ha sido suspendido"})

    @action(detail=True, methods=['POST'])
    def reschedule_match(self, request, pk=None):
        match = self.get_object()

        new_date = request.data.get('new_date')
        if not new_date:
            return Response({"error": "Debe proporcionar una nueva fecha"}, status=status.HTTP_400_BAD_REQUEST)

        match.date = new_date
        match.status = 'rescheduled'  # Cambiar el estado a "Reprogramado"
        match.save()

        return Response({"message": "El partido ha sido reprogramado", "new_date": new_date})

    @action(detail=True, methods=['PATCH'])
    def update_score(self, request, pk=None):
        with transaction.atomic():
            match = self.get_object()

            # Validar que el partido esté en curso
            if match.status != 'live':
                return Response({"error": "El partido no está en curso"}, status=status.HTTP_400_BAD_REQUEST)

            set_number = request.data.get('set_number')
            player_id = request.data.get('player_id')
            point_type = request.data.get('point_type')
            undo = request.data.get('undo', False)  # Nuevo parámetro para rollback

            if not all([set_number, player_id, point_type]):
                return Response({"error": "Faltan datos requeridos"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                current_set = Set.objects.get(match=match, set_number=set_number)
                performance, created = PlayerPerformance.objects.get_or_create(
                    match=match,
                    set=current_set,
                    player_id=player_id,
                    defaults={
                        'points': 0,
                        'spike_points': 0,
                        'block_points': 0,
                        'aces': 0,
                        'errors': 0
                    }
                )

                point_updates = {
                    'SPK': 'spike_points',
                    'BLK': 'block_points',
                    'ACE': 'aces',
                    'ERR': 'errors'
                }

                # Si es un rollback
                if undo:
                    last_event = PointEvent.objects.filter(
                        match=match,
                        set=current_set,
                        player_id=player_id,
                        point_type=point_type
                    ).order_by('-timestamp').first()

                    if not last_event:
                        return Response({"error": "No hay eventos para deshacer"}, status=status.HTTP_400_BAD_REQUEST)

                    # Revertir el evento y actualizar las estadísticas
                    if point_type in point_updates and getattr(performance, point_updates[point_type]) > 0:
                        setattr(performance, point_updates[point_type], getattr(performance, point_updates[point_type]) - 1)

                    # Actualizar puntos totales (excluyendo errores)
                    performance.points = performance.spike_points + performance.block_points + performance.aces
                    performance.save()

                    # Revertir marcador del set
                    if performance.player.team == match.home_team:
                        current_set.home_team_score -= 1
                    else:
                        current_set.away_team_score -= 1
                    current_set.save()

                    # Borrar el último evento registrado
                    last_event.delete()

                    return Response({
                        "status": "success",
                        "message": "Último cambio revertido",
                        "home_score": current_set.home_team_score,
                        "away_score": current_set.away_team_score,
                        "player_performance": PlayerPerformanceSerializer(performance).data
                    })

                # Si no es un rollback, agregar el punto
                else:
                    if point_type in point_updates:
                        setattr(performance, point_updates[point_type], getattr(performance, point_updates[point_type]) + 1)

                    # Recalcular puntos totales (sin errores)
                    performance.points = performance.spike_points + performance.block_points + performance.aces
                    performance.save()

                    # Actualizar marcador del set
                    if performance.player.team == match.home_team:
                        current_set.home_team_score += 1
                    else:
                        current_set.away_team_score += 1
                    current_set.save()

                    # Crear un evento de punto en PointEvent
                    PointEvent.objects.create(
                        match=match,
                        set=current_set,
                        player=performance.player,
                        team=performance.player.team,
                        timestamp=timezone.now(),
                        point_type=point_type,
                        home_score_after=current_set.home_team_score,
                        away_score_after=current_set.away_team_score,
                        description=f"Punto por {point_type} del jugador {performance.player.name}"
                    )

                    return Response({
                        "status": "success",
                        "home_score": current_set.home_team_score,
                        "away_score": current_set.away_team_score,
                        "player_performance": PlayerPerformanceSerializer(performance).data
                    })

            except Set.DoesNotExist:
                return Response({"error": "Set no encontrado"}, status=status.HTTP_404_NOT_FOUND)
            except PlayerPerformance.DoesNotExist:
                return Response({"error": "Registro de jugador no encontrado"}, status=status.HTTP_404_NOT_FOUND)

class SetViewSet(viewsets.ModelViewSet):
    queryset = Set.objects.select_related('match').all()
    serializer_class = SetSerializer

    @action(detail=False, methods=['POST'], url_path='matches/(?P<match_id>[^/.]+)/sets/start_set')
    def start_set(self, request, match_id=None):
        """Inicia un nuevo set dinámicamente si el partido está en curso y el set anterior está finalizado"""
        match = get_object_or_404(Match, pk=match_id)

        if match.status != 'live':
            return Response({"error": "El partido no está en vivo"}, status=status.HTTP_400_BAD_REQUEST)

        last_set = Set.objects.filter(
            match=match).order_by('-set_number').first()
        if last_set and not last_set.end_time:
            return Response({"error": "El set anterior no ha finalizado"}, status=status.HTTP_400_BAD_REQUEST)

        new_set_number = last_set.set_number + 1 if last_set else 1
        new_set = Set.objects.create(
            match=match, set_number=new_set_number, start_time=timezone.now())

        return Response({
            "message": f"Set {new_set_number} iniciado",
            "set_data": {
                "id": new_set.id,
                "number": new_set.set_number,
                "start_time": new_set.start_time,
                "scores": {"home": new_set.home_team_score, "away": new_set.away_team_score}
            }
        })

    @action(detail=False, methods=['POST'], url_path='matches/(?P<match_id>[^/.]+)/sets/end_set')
    def end_set(self, request, match_id=None):
        """Finaliza el último set activo de un partido específico"""
        match = get_object_or_404(Match, pk=match_id)

        current_set = Set.objects.filter(
            match=match, end_time__isnull=True).order_by('-set_number').first()
        if not current_set:
            return Response({"error": "No hay un set activo para finalizar"}, status=status.HTTP_400_BAD_REQUEST)

        is_valid, error_message = self._is_valid_set_score(current_set)
        if not is_valid:
            return Response({"error": error_message}, status=status.HTTP_400_BAD_REQUEST)

        current_set.end_time = timezone.now()
        current_set.duration = current_set.end_time - \
            current_set.start_time if current_set.start_time else None
        current_set.save()

        return Response({
            "message": f"Set {current_set.set_number} finalizado",
            "final_score": {"home": current_set.home_team_score, "away": current_set.away_team_score}
        })

    def _is_valid_set_score(self, current_set):
        """
        Verifica si la puntuación es válida para terminar un set

        Args:
            current_set: El objeto Set actual
        Returns:
            tuple: (es_valido, mensaje_error)
        """
        max_score = max(current_set.home_team_score,
                        current_set.away_team_score)
        min_score = min(current_set.home_team_score,
                        current_set.away_team_score)
        score_difference = max_score - min_score

        if current_set.set_number == 5:
            if max_score < 15:
                return False, f"El set 5 requiere al menos 15 puntos para ganar (actual: {max_score})"
            if score_difference < 2:
                return False, f"Se requiere una diferencia de 2 puntos (actual: {score_difference})"
        else:
            if max_score < 25:
                return False, f"Se requieren al menos 25 puntos para ganar (actual: {max_score})"
            if score_difference < 2:
                return False, f"Se requiere una diferencia de 2 puntos (actual: {score_difference})"

        return True, ""

        try:
            with transaction.atomic():
                current_set = self.get_object()
                match = current_set.match

                if match.status != 'live':
                    return Response(
                        {"error": "El partido no está en curso"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                if current_set.end_time:
                    return Response(
                        {"error": "Este set ya ha sido finalizado"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Validación de puntaje con solo los scores
                is_valid, error_message = self._is_valid_set_score(
                    current_set.home_team_score,
                    current_set.away_team_score
                )

                if not is_valid:
                    return Response({
                        "error": "Puntuación inválida para finalizar el set",
                        "details": {
                            "home_score": current_set.home_team_score,
                            "away_score": current_set.away_team_score,
                            "set_number": current_set.set_number,
                            "reason": error_message,
                            "rules": {
                                "sets_1_4": "Mínimo 25 puntos con diferencia de 2",
                                "set_5": "Mínimo 15 puntos con diferencia de 2"
                            }
                        }
                    }, status=status.HTTP_400_BAD_REQUEST)

                # Finalizar el set
                current_set.end_time = timezone.now()
                if current_set.start_time:
                    current_set.duration = current_set.end_time - current_set.start_time
                current_set.save()

                # Determinar ganador
                winner_team = match.home_team if current_set.home_team_score > current_set.away_team_score else match.away_team

                # Registrar el evento
                PointEvent.objects.create(
                    match=match,
                    set=current_set,
                    team=winner_team,
                    timestamp=timezone.now(),
                    home_score_after=current_set.home_team_score,
                    away_score_after=current_set.away_team_score,
                    description=f"Fin del Set {current_set.set_number}"
                )

                # Actualizar estadísticas
                sets_stats = self._get_sets_stats(match)

                response_data = {
                    "status": "success",
                    "message": "Set finalizado correctamente",
                    "set_data": {
                        "number": current_set.set_number,
                        "duration": str(current_set.duration) if current_set.duration else None,
                        "final_score": {
                            "home": current_set.home_team_score,
                            "away": current_set.away_team_score
                        }
                    },
                    "match_status": {
                        "sets_won": sets_stats
                    }
                }

                # Verificar si el partido ha terminado
                if sets_stats['sets_home'] == 3 or sets_stats['sets_away'] == 3:
                    match.status = 'finished'
                    match.end_time = timezone.now()
                    match.duration = match.end_time - match.start_time
                    match.save()
                    response_data.update({
                        "match_finished": True,
                        "match_data": {
                            "duration": str(match.duration),
                            "winner": "home" if sets_stats['sets_home'] == 3 else "away",
                            "final_score": f"{sets_stats['sets_home']}-{sets_stats['sets_away']}"
                        }
                    })

                return Response(response_data)

        except ValidationError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Error inesperado: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        """
        Verifica si la puntuación es válida para terminar un set
        
        Args:
            set_obj: Objeto Set actual
            home_score: Puntuación del equipo local
            away_score: Puntuación del equipo visitante
        """
        max_score = max(home_score, away_score)
        min_score = min(home_score, away_score)
        score_difference = max_score - min_score

        # Set decisivo (5º set)
        if set_obj.set_number == 5:
            if max_score >= 15 and score_difference >= 2:
                return True
            return False

        # Sets normales (1-4)
        if max_score >= 25 and score_difference >= 2:
            return True
        return False

    def _get_sets_stats(self, match):
        """Obtiene las estadísticas de sets ganados"""
        sets_home = Set.objects.filter(
            match=match,
            home_team_score__gt=F('away_team_score'),
            end_time__isnull=False
        ).count()

        sets_away = Set.objects.filter(
            match=match,
            away_team_score__gt=F('home_team_score'),
            end_time__isnull=False
        ).count()

        return {
            'sets_home': sets_home,
            'sets_away': sets_away
        }

    # Endpoint para actualizar tiempos fuera
    @action(detail=False, methods=['POST'], url_path='matches/(?P<match_id>[^/.]+)/update_timeouts')
    def update_timeouts(self, request, match_id=None):
        match = get_object_or_404(Match, pk=match_id)
        team = request.data.get("team")

        # Encuentra el set en curso (sin `end_time`)
        current_set = Set.objects.filter(match=match, end_time__isnull=True).order_by('-set_number').first()
        if not current_set:
            return Response({"error": "No hay un set activo para este partido"}, status=status.HTTP_400_BAD_REQUEST)

        # Verificación y actualización de tiempos fuera
        if team == "home":
            if current_set.home_timeouts < 2:
                current_set.home_timeouts += 1
                current_set.save()
                return Response({"message": "Tiempo fuera agregado para el equipo local", "home_timeouts": current_set.home_timeouts})
            else:
                return Response({"error": "El equipo local ya ha usado todos sus tiempos fuera en este set"}, status=status.HTTP_400_BAD_REQUEST)
        elif team == "away":
            if current_set.away_timeouts < 2:
                current_set.away_timeouts += 1
                current_set.save()
                return Response({"message": "Tiempo fuera agregado para el equipo visitante", "away_timeouts": current_set.away_timeouts})
            else:
                return Response({"error": "El equipo visitante ya ha usado todos sus tiempos fuera en este set"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Equipo no válido, debe ser 'home' o 'away'"}, status=status.HTTP_400_BAD_REQUEST)



class PlayerPerformanceViewSet(viewsets.ModelViewSet):
    queryset = PlayerPerformance.objects.select_related(
        'player', 'match').all()
    serializer_class = PlayerPerformanceSerializer
