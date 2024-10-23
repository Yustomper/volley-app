
# teams/serializers.py
from rest_framework import serializers
from .models import Team, Player
from django.core.exceptions import ValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'name', 'jersey_number',
                  'avatar', 'position', 'is_holding']


class TeamSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'gender',
                  'players', 'created_at', 'updated_at']

    def create(self, validated_data):
        players_data = validated_data.pop('players')
        team = Team.objects.create(**validated_data)
        for player_data in players_data:
            try:
                # Aquí capturamos la excepción de validación y la transformamos en un DRF ValidationError
                Player.objects.create(team=team, **player_data)
            except ValidationError as e:
                raise DRFValidationError({"player_error": e.messages})
        return team

    def update(self, instance, validated_data):
        players_data = validated_data.pop('players')
        instance.name = validated_data.get('name', instance.name)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.save()

        # Eliminar jugadores existentes y recrear jugadores
        instance.players.all().delete()
        for player_data in players_data:
            try:
                Player.objects.create(team=instance, **player_data)
            except ValidationError as e:
                raise DRFValidationError({"player_error": e.messages})

        return instance
