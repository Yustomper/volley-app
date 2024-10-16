from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Weather
from .serializers import WeatherSerializer
from matches.models import Match

class WeatherViewSet(viewsets.ModelViewSet):
    queryset = Weather.objects.all()
    serializer_class = WeatherSerializer

    @action(detail=False, methods=['POST'])
    def update_match_weather(self, request):
        # Extraer datos del request
        match_id = request.data.get('match_id')
        temperature = request.data.get('temperature')
        condition = request.data.get('condition')

        # Validar que todos los campos necesarios estén presentes
        if not all([match_id, temperature, condition]):
            return Response({"error": "match_id, temperature, and condition are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Obtener el partido
            match = Match.objects.get(id=match_id)
        except Match.DoesNotExist:
            return Response({"error": "Match not found"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            # Crear nuevo registro de clima
            weather = Weather.objects.create(
                match=match,
                temperature=temperature,
                condition=condition
            )
            
            # Actualizar el clima actual del partido
            match.current_weather = weather
            match.save()
            
            # Devolver los datos del nuevo clima creado
            return Response(WeatherSerializer(weather).data)
        except Exception as e:
            # Manejar cualquier otro error que pueda ocurrir
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)