# statistics/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Statistics
from teams.models import Team
from matches.models import Match, PlayerPerformance, Set
from django.db.models import Sum, Count, Q, F

class StatisticsView(APIView):
    def get(self, request):
        # Actualizar las estadísticas
        stats, created = Statistics.objects.get_or_create(pk=1)
        
        # Total de partidos
        stats.total_matches = Match.objects.count()
        
        # Total de equipos
        stats.total_teams = Team.objects.count()
        
        # Máximo anotador
        top_scorer = PlayerPerformance.objects.values('player__name').annotate(
            total_score=Sum('points')
        ).order_by('-total_score').first()
        
        if top_scorer:
            stats.top_scorer_name = top_scorer['player__name']
            stats.top_scorer_score = top_scorer['total_score']
        
       
        home_wins = Set.objects.filter(home_team_score__gt=F('away_team_score')).values('match__home_team__name').annotate(count=Count('id'))
        away_wins = Set.objects.filter(away_team_score__gt=F('home_team_score')).values('match__away_team__name').annotate(count=Count('id'))
        
        
        wins_count = {}
        for win in home_wins:
            team_name = win['match__home_team__name']
            wins_count[team_name] = wins_count.get(team_name, 0) + win['count']
        
        for win in away_wins:
            team_name = win['match__away_team__name']
            wins_count[team_name] = wins_count.get(team_name, 0) + win['count']

        if wins_count:
            most_wins_team = max(wins_count, key=wins_count.get)
            stats.most_wins_team = most_wins_team
            stats.most_wins_count = wins_count[most_wins_team]
        
        stats.save()
        
        return Response({
            'totalMatches': stats.total_matches,
            'totalTeams': stats.total_teams,
            'topScorer': {
                'name': stats.top_scorer_name,
                'score': stats.top_scorer_score
            },
            'mostWins': {
                'name': stats.most_wins_team,
                'wins': stats.most_wins_count
            }
        }, status=status.HTTP_200_OK)
