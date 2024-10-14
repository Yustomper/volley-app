from rest_framework import serializers
from django.db.models import Sum, F, OuterRef, Subquery
from .models import Match, Set, PlayerPerformance
from teams.models import Team
from teams.serializers import TeamSerializer

class SetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Set
        fields = ['id', 'set_number', 'home_team_score', 'away_team_score']

class PlayerPerformanceSerializer(serializers.ModelSerializer):
    player_name = serializers.CharField(source='player.name', read_only=True)

    class Meta:
        model = PlayerPerformance
        fields = ['id', 'player', 'player_name', 'points', 'blocks', 'aces', 'digs']

class TopPerformerSerializer(serializers.Serializer):
    player_name = serializers.CharField()
    team_name = serializers.CharField()
    score = serializers.IntegerField()

class MatchSerializer(serializers.ModelSerializer):
    home_team = TeamSerializer(read_only=True)
    away_team = TeamSerializer(read_only=True)
    home_team_id = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), source='home_team', write_only=True)
    away_team_id = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), source='away_team', write_only=True)
    sets = SetSerializer(many=True, read_only=True)
    player_performances = PlayerPerformanceSerializer(many=True, read_only=True)
    start_time = serializers.DateTimeField(read_only=True)
    duration = serializers.DurationField(read_only=True)
    top_scorer = TopPerformerSerializer(read_only=True)
    best_server = TopPerformerSerializer(read_only=True)

    class Meta:
        model = Match
        fields = ['id', 'home_team', 'away_team', 'home_team_id', 'away_team_id', 'date', 
                  'location', 'latitude', 'longitude', 'status', 'sets', 
                  'player_performances', 'start_time', 'duration', 'top_scorer', 'best_server']

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        top_scorer = PlayerPerformance.objects.filter(match=instance).order_by('-points').first()
        if top_scorer:
            representation['top_scorer'] = {
                'player_name': top_scorer.player.name,
                'team_name': top_scorer.player.team.name,
                'score': top_scorer.points
            }

        best_server = PlayerPerformance.objects.filter(match=instance).order_by('-aces').first()
        if best_server:
            representation['best_server'] = {
                'player_name': best_server.player.name,
                'team_name': best_server.player.team.name,
                'score': best_server.aces
            }

        return representation