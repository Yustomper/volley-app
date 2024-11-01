# matches/serializers.py
from rest_framework import serializers
from .models import Match, Set, PlayerPerformance, PointEvent
from teams.models import Team
from teams.serializers import TeamSerializer
from weather.serializers import WeatherSerializer

class PointEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = PointEvent
        fields = ['id', 'match', 'set', 'player', 'team', 'timestamp', 'point_type', 'home_score_after', 'away_score_after', 'description']


class SetSerializer(serializers.ModelSerializer):
    point_events = PointEventSerializer(many=True, read_only=True)

    class Meta:
        model = Set
        fields = ['id', 'set_number', 'home_team_score', 'away_team_score', 'start_time', 'end_time','point_events']


class PlayerPerformanceSerializer(serializers.ModelSerializer):
    player_name = serializers.CharField(source='player.name', read_only=True)

    class Meta:
        model = PlayerPerformance
        fields = ['id', 'player', 'player_name', 'points', 'spike_points', 'block_points', 'aces', 'errors']


class MatchSerializer(serializers.ModelSerializer):
    home_team = TeamSerializer(read_only=True)
    away_team = TeamSerializer(read_only=True)
    home_team_id = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), source='home_team', write_only=True)
    away_team_id = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), source='away_team', write_only=True)
    sets = SetSerializer(many=True, read_only=True)
    player_performances = PlayerPerformanceSerializer(many=True, read_only=True)
    current_weather = WeatherSerializer(read_only=True)
    home_timeouts = serializers.IntegerField(read_only=True)
    away_timeouts = serializers.IntegerField(read_only=True)
    status = serializers.CharField(read_only=True)
    sets_won_home = serializers.IntegerField(read_only=True)
    sets_won_away = serializers.IntegerField(read_only=True)

    class Meta:
        model = Match
        fields = [
            'id', 'home_team', 'away_team', 'home_team_id', 'away_team_id', 'date', 
            'location', 'latitude', 'longitude', 'status', 'sets', 'player_performances', 
            'start_time', 'duration', 'home_timeouts', 'away_timeouts', 'current_weather', 'status', 
            'sets_won_home', 'sets_won_away',
        ]

    def create(self, validated_data):
        match = super().create(validated_data)
        # Nota: No se crean sets automáticamente aquí.
        return match
    
    def update(self, instance, validated_data):
        if 'status' in validated_data and validated_data['status'] == 'live':
            instance.start_match()
        return super().update(instance, validated_data)
