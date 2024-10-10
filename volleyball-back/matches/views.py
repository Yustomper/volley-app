from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Match, Set, PlayerPerformance
from .serializers import MatchSerializer, SetSerializer, PlayerPerformanceSerializer

class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.select_related('home_team', 'away_team').prefetch_related('sets', 'player_performances').all()
    serializer_class = MatchSerializer

    @action(detail=True, methods=['POST'])
    def start_match(self, request, pk=None):
        match = self.get_object()
        if match.start_time is not None:
            return Response({"error": "Match has already started"}, status=status.HTTP_400_BAD_REQUEST)
        
        match.start_time = timezone.now()
        match.save()
        return Response({"message": "Match started", "start_time": match.start_time})

    @action(detail=True, methods=['POST'])
    def end_match(self, request, pk=None):
        match = self.get_object()
        if match.start_time is None:
            return Response({"error": "Match has not started yet"}, status=status.HTTP_400_BAD_REQUEST)
        if match.is_finished:
            return Response({"error": "Match has already ended"}, status=status.HTTP_400_BAD_REQUEST)
        
        end_time = timezone.now()
        match.duration = end_time - match.start_time
        match.is_finished = True
        match.save()
        return Response({"message": "Match ended", "duration": match.duration})

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
            defaults={'home_team_score': home_score, 'away_team_score': away_score}
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
        points = request.data.get('points', 0)
        blocks = request.data.get('blocks', 0)
        aces = request.data.get('aces', 0)
        digs = request.data.get('digs', 0)

        if player_id is None:
            return Response({"error": "Missing player_id"}, status=status.HTTP_400_BAD_REQUEST)

        performance, created = PlayerPerformance.objects.get_or_create(
            match=match,
            player_id=player_id,
            defaults={'points': points, 'blocks': blocks, 'aces': aces, 'digs': digs}
        )

        if not created:
            performance.points += points
            performance.blocks += blocks
            performance.aces += aces
            performance.digs += digs
            performance.save()

        return Response({"message": "Player performance updated successfully"})

class SetViewSet(viewsets.ModelViewSet):
    queryset = Set.objects.select_related('match').all()
    serializer_class = SetSerializer

class PlayerPerformanceViewSet(viewsets.ModelViewSet):
    queryset = PlayerPerformance.objects.select_related('player', 'match').all()
    serializer_class = PlayerPerformanceSerializer