# teams/tests.py
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from teams.models import Team, Player


class TeamTests(APITestCase):

    def setUp(self):
        # URLs de la API
        # Ruta para la creación de equipos
        self.create_team_url = reverse('team-list')
        self.get_teams_url = reverse('team-list') 

        # Datos de prueba
        self.team_data_male = {
            'name': 'Equipo Masculino',
            'gender': 'M',
            'players': [
                {'name': 'Jugador 1', 'jersey_number': 7,
                    'position': 'CE', 'is_holding': True},
                {'name': 'Jugador 2', 'jersey_number': 10,
                    'position': 'AR', 'is_holding': True},
            ]
        }

        self.team_data_female = {
            'name': 'Equipo Femenino',
            'gender': 'F',
            'players': [
                {'name': 'Jugadora 1', 'jersey_number': 9,
                    'position': 'PR', 'is_holding': True},
                {'name': 'Jugadora 2', 'jersey_number': 12,
                    'position': 'OP', 'is_holding': False},
            ]
        }

    def test_create_team_male(self):
        """Prueba para la creación de un equipo masculino con jugadores"""
        response = self.client.post(
            self.create_team_url, self.team_data_male, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Verificar que el equipo y los jugadores fueron creados correctamente
        team = Team.objects.get(name='Equipo Masculino')
        self.assertEqual(team.gender, 'M')
        self.assertEqual(team.players.count(), 2)

        # Verificar que los avatares se asignaron correctamente
        for player in team.players.all():
            self.assertEqual(player.avatar, Player.DEFAULT_AVATAR_MALE)

    def test_create_team_female(self):
        """Prueba para la creación de un equipo femenino con jugadoras"""
        response = self.client.post(
            self.create_team_url, self.team_data_female, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Verificar que el equipo y las jugadoras fueron creados correctamente
        team = Team.objects.get(name='Equipo Femenino')
        self.assertEqual(team.gender, 'F')
        self.assertEqual(team.players.count(), 2)

        # Verificar que los avatares se asignaron correctamente
        for player in team.players.all():
            self.assertEqual(player.avatar, Player.DEFAULT_AVATAR_FEMALE)

    def test_create_team_invalid_gender(self):
        invalid_team_data = {
            "name": "Equipo Masculino",
            "gender": "M",  # El equipo es masculino
            "players": [
                {
                    "name": "Jugador Femenino",
                    "jersey_number": 10,
                    "avatar": "https://cdn.icon-icons.com/icons2/2643/PNG/512/female_woman_person_people_avatar_icon_159366.png",
                    "position": "CE",
                    "is_holding": True
                }
            ]
        }
        response = self.client.post(
            self.create_team_url, invalid_team_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Verifica que el mensaje de error esté presente
        self.assertIn('player_error', response.data)

    def test_get_teams(self):
        """Prueba para obtener la lista de equipos"""
        # Crear un equipo para verificar la lista
        self.client.post(self.create_team_url,
                         self.team_data_male, format='json')

        response = self.client.get(self.get_teams_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verificar que la respuesta contiene el equipo
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results']
                         [0]['name'], 'Equipo Masculino')
