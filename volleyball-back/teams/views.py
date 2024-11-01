# teams/views.py
from .serializers import TeamSerializer, PlayerSerializer
from .models import Team, Player
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 100


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.prefetch_related('players').all().order_by(
        'created_at') 
    serializer_class = TeamSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['name']
    search_fields = ['name', 'players__name']
    ordering_fields = ['name', 'created_at']

    # Añadimos esta acción para eliminar un jugador de un equipo
    @action(detail=True, methods=['DELETE'], url_path='remove-player/(?P<player_id>[^/.]+)')
    def remove_player(self, request, pk=None, player_id=None):
        team = self.get_object()
        try:
            player = team.players.get(pk=player_id)
            player.delete()
            return Response({'message': 'Jugador eliminado correctamente del equipo.'}, status=status.HTTP_204_NO_CONTENT)
        except Player.DoesNotExist:
            return Response({'error': 'Jugador no encontrado en este equipo.'}, status=status.HTTP_404_NOT_FOUND)


class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.select_related('team').all()
    serializer_class = PlayerSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['name', 'jersey_number', 'team__name']
    search_fields = ['name', 'team__name']
    ordering_fields = ['name', 'jersey_number']
