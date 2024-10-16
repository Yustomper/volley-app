from django.db import models

class Weather(models.Model):
    match = models.ForeignKey('matches.Match', on_delete=models.CASCADE, related_name='weather_records')
    timestamp = models.DateTimeField(auto_now_add=True)
    temperature = models.IntegerField()  # Temperatura en grados Celsius
    condition = models.CharField(max_length=50)  # Clear, Cloudy, Rainy, Snowy, Stormy

    def __str__(self):
        return f"Weather for Match {self.match_id} at {self.timestamp}"