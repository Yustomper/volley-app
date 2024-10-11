# statistics/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Statistics
from teams.models import Team
from matches.models import Match, PlayerPerformance, Set,PointEvent
from django.db.models import Sum, Count, Q, F,Max

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


class MatchStatisticsView(APIView):
    def get(self, request, match_id):
        try:
            match = Match.objects.get(id=match_id)
            
            # Obtener el mejor anotador del partido
            best_scorer = PlayerPerformance.objects.filter(match=match).annotate(
                total_points=Sum(F('spike_points') + F('block_points') + F('aces'))
            ).order_by('-total_points').first()
            
            # Obtener el mejor sacador del partido
            best_server = PlayerPerformance.objects.filter(match=match).order_by('-aces').first()
            
            # Obtener estadísticas por set
            sets = Set.objects.filter(match=match).values('set_number', 'home_team_score', 'away_team_score')
            
            response_data = {
                'sets': list(sets),
                'best_scorer': None,
                'best_server': None
            }
            
            if best_scorer:
                best_scorer_points_per_set = PlayerPerformance.objects.filter(
                    match=match, player=best_scorer.player
                ).values('set__set_number').annotate(
                    points=Sum(F('spike_points') + F('block_points') + F('aces'))
                )
                
                response_data['best_scorer'] = {
                    'name': best_scorer.player.name,
                    'jersey_number': best_scorer.player.jersey_number,
                    'position': best_scorer.player.position,
                    'total_points': best_scorer.total_points,
                    'spike_attempts': best_scorer.spike_points,
                    'points_per_set': list(best_scorer_points_per_set)
                }
            
            if best_server:
                best_server_points_per_set = PlayerPerformance.objects.filter(
                    match=match, player=best_server.player
                ).values('set__set_number').annotate(points=Sum('aces'))
                
                response_data['best_server'] = {
                    'name': best_server.player.name,
                    'jersey_number': best_server.player.jersey_number,
                    'position': best_server.player.position,
                    'total_aces': best_server.aces,
                    'points_per_set': list(best_server_points_per_set)
                }
            
            return Response(response_data, status=status.HTTP_200_OK)
        
        except Match.DoesNotExist:
            return Response({'error': 'Partido no encontrado'}, status=status.HTTP_404_NOT_FOUND)