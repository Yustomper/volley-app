from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from django.test import TestCase

class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.login_url = reverse('login')

        # Crear un usuario de prueba para las pruebas de inicio de sesión
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpassword')

    def test_register_user(self):
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword123',
            'confirm_password': 'newpassword123',
        }
        response = self.client.post(self.register_url, data, format='json')
        print(response.data)  # Imprime la respuesta para ver qué está fallando
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login_user(self):
        data = {
            'username_or_email': 'testuser',
            'password': 'testpassword',
        }
        response = self.client.post(self.login_url, data, format='json')
        print(response.data)  # Imprime la respuesta para ver qué está fallando
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_register_user_invalid(self):
        # Falta el campo 'confirm_password'
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword123',
        }
        response = self.client.post(self.register_url, data, format='json')
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
