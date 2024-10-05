from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Team, Player
from .serializers import TeamSerializer, PlayerSerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 100

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.prefetch_related('players').all()
    serializer_class = TeamSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['name']
    search_fields = ['name', 'players__name']
    ordering_fields = ['name', 'created_at']

class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.select_related('team').all()
    serializer_class = PlayerSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['name', 'jersey_number', 'team__name']
    search_fields = ['name', 'team__name']
    ordering_fields = ['name', 'jersey_number']