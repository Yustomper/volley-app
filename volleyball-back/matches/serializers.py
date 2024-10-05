from rest_framework import serializers
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


class MatchSerializer(serializers.ModelSerializer):
    home_team = TeamSerializer(read_only=True)
    away_team = TeamSerializer(read_only=True)
    home_team_id = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), source='home_team', write_only=True)
    away_team_id = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), source='away_team', write_only=True)
    sets = SetSerializer(many=True, read_only=True)
    player_performances = PlayerPerformanceSerializer(many=True, read_only=True)

    class Meta:
        model = Match
        fields = ['id', 'home_team', 'away_team', 'home_team_id', 'away_team_id', 'date', 
                 'location', 'latitude', 'longitude', 'is_finished', 'sets', 'player_performances']