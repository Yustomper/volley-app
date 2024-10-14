
# teams/serializers.py
from rest_framework import serializers
from .models import Team, Player


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'name', 'jersey_number', 'avatar_url']


class TeamSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'players', 'created_at', 'updated_at']

    def create(self, validated_data):
        players_data = validated_data.pop('players')
        team = Team.objects.create(**validated_data)
        for player_data in players_data:
            Player.objects.create(team=team, **player_data)
        return team

    def update(self, instance, validated_data):
        players_data = validated_data.pop('players')
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        instance.players.all().delete()
        for player_data in players_data:
            Player.objects.create(team=instance, **player_data)
        return instance
