# matches/views.py
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Match, Set, PlayerPerformance
from .serializers import MatchSerializer, SetSerializer, PlayerPerformanceSerializer


class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer

    @action(detail=True, methods=['POST'])
    def start_match(self, request, pk=None):
        try:
            match = self.get_object()
    
            if match.status != 'upcoming':
                return Response({"error": "El partido ya ha comenzado o no está en estado Próximamente"}, status=status.HTTP_400_BAD_REQUEST)

            if match.start_time is not None:
                return Response({"error": "El partido ya ha comenzado"}, status=status.HTTP_400_BAD_REQUEST)

            match.start_time = timezone.now()
            match.status = 'live' 
            match.save()

            # Crear registros de PlayerPerformance para cada jugador en el partido
            home_team_players = match.home_team.players.all()
            away_team_players = match.away_team.players.all()

            for player in home_team_players:
                PlayerPerformance.objects.create(
                    player=player,
                    match=match,
                    points=0,
                    spike_points=0,
                    block_points=0,
                    aces=0,
                    errors=0
                )

            for player in away_team_players:
                PlayerPerformance.objects.create(
                    player=player,
                    match=match,
                    points=0,
                    spike_points=0,
                    block_points=0,
                    aces=0,
                    errors=0
                )

            return Response({"message": "El partido ha comenzado", "start_time": match.start_time})

        except Exception as e:
            # Capturar cualquier excepción y devolver un mensaje de error
            # Esto imprimirá el error en los logs
            print(f"Error al iniciar el partido: {str(e)}")
            return Response({"error": f"Ocurrió un error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

        
    
    @action(detail=True, methods=['POST'])
    def update_score(self, request, pk=None):
        match = self.get_object()
        set_number = request.data.get('set_number')
        home_score = request.data.get('home_score')
        away_score = request.data.get('away_score')

        if set_number is None or home_score is None or away_score is None:
            return Response({"error": "Missing required data"}, status=status.HTTP_400_BAD_REQUEST)

        set_obj, created = Set.objects.get_or_create(
            match=match,
            set_number=set_number,
            defaults={'home_team_score': home_score,
                      'away_team_score': away_score}
        )

        if not created:
            set_obj.home_team_score = home_score
            set_obj.away_team_score = away_score
            set_obj.save()

        return Response({"message": "Score updated successfully"})



    @action(detail=True, methods=['POST'])
    def update_player_performance(self, request, pk=None):
        match = self.get_object()
        player_id = request.data.get('player_id')
        # Cambiado de "blocks" a "spike_points"
        spike_points = request.data.get('spike_points', 0)
        # Usando block_points en vez de "blocks"
        block_points = request.data.get('block_points', 0)
        aces = request.data.get('aces', 0)
        errors = request.data.get('errors', 0)

        if player_id is None:
            return Response({"error": "Missing player_id"}, status=status.HTTP_400_BAD_REQUEST)

        # Verificar si existe un rendimiento del jugador para este partido
        performance, created = PlayerPerformance.objects.get_or_create(
            match=match,
            player_id=player_id,
            defaults={'points': spike_points + block_points + aces,  # Sumar los puntos
                      'spike_points': spike_points,
                      'block_points': block_points,
                      'aces': aces,
                      'errors': errors}
        )

        if not created:
            performance.spike_points += spike_points
            performance.block_points += block_points
            performance.aces += aces
            performance.errors += errors
            # Actualiza el total de puntos
            performance.points = performance.spike_points + \
                performance.block_points + performance.aces
            performance.save()

        return Response({"message": "Player performance updated successfully"})


class SetViewSet(viewsets.ModelViewSet):
    queryset = Set.objects.select_related('match').all()
    serializer_class = SetSerializer


class PlayerPerformanceViewSet(viewsets.ModelViewSet):
    queryset = PlayerPerformance.objects.select_related(
        'player', 'match').all()
    serializer_class = PlayerPerformanceSerializer
