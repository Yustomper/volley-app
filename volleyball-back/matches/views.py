from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Match, Set, PlayerPerformance
from .serializers import MatchSerializer, SetSerializer, PlayerPerformanceSerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 100

class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.select_related('home_team', 'away_team').prefetch_related('sets', 'player_performances').all()
    serializer_class = MatchSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['home_team__name', 'away_team__name', 'is_finished', 'location']
    search_fields = ['home_team__name', 'away_team__name', 'location']
    ordering_fields = ['date', 'created_at']

class SetViewSet(viewsets.ModelViewSet):
    queryset = Set.objects.select_related('match').all()
    serializer_class = SetSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['match__id', 'number']
    search_fields = ['match__home_team__name', 'match__away_team__name']
    ordering_fields = ['number', 'created_at']

class PlayerPerformanceViewSet(viewsets.ModelViewSet):
    queryset = PlayerPerformance.objects.select_related('player', 'match').all()
    serializer_class = PlayerPerformanceSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['player__name', 'match__id']
    search_fields = ['player__name', 'match__home_team__name', 'match__away_team__name']
    ordering_fields = ['points_scored', 'created_at']