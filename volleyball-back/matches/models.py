# matches/models.py
from django.db import models
from django.utils import timezone
from teams.models import Team, Player


class Match(models.Model):
    STATUS_CHOICES = [
        ('upcoming', 'Próximamente'),
        ('live', 'En Vivo'),
        ('finished', 'Finalizado'),
        ('suspended', 'Suspendido'),
        ('rescheduled', 'Reprogramado')
    ]  
    home_team = models.ForeignKey(Team, related_name='home_matches', on_delete=models.CASCADE)
    away_team = models.ForeignKey(Team, related_name='away_matches', on_delete=models.CASCADE)
    date = models.DateTimeField()
    location = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    duration = models.DurationField(null=True, blank=True)
    current_weather = models.ForeignKey('weather.Weather', on_delete=models.SET_NULL, null=True, blank=True, related_name='current_for_match')
    home_timeouts = models.PositiveIntegerField(default=0)
    away_timeouts = models.PositiveIntegerField(default=0)

    def start_match(self):
        self.status = 'live'
        self.start_time = timezone.now()
        self.save()

    def __str__(self):
        return f"{self.home_team} vs {self.away_team} on {self.date}"


class Set(models.Model):
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='sets')
    set_number = models.PositiveIntegerField()
    home_team_score = models.PositiveIntegerField(default=0)
    away_team_score = models.PositiveIntegerField(default=0)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    duration = models.DurationField(null=True, blank=True)
    home_timeouts = models.PositiveIntegerField(default=0)  
    away_timeouts = models.PositiveIntegerField(default=0)  # Añadir para tiempo fuera de visitante

    def __str__(self):
        return f"Set {self.set_number} of {self.match}"


class PlayerPerformance(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    match = models.ForeignKey(Match, on_delete=models.CASCADE)
    set = models.ForeignKey(Set, on_delete=models.CASCADE, null=True, blank=True)
    points = models.PositiveIntegerField(default=0)
    spike_points = models.PositiveIntegerField(default=0)
    block_points = models.PositiveIntegerField(default=0)
    aces = models.PositiveIntegerField(default=0)
    errors = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        set_info = f"Set {self.set.set_number}" if self.set else "No set"
        return f"{self.player} performance in {self.match} {set_info}"


class PointEvent(models.Model):
    POINT_TYPES = [
        ('SPK', 'Punto por Remate'),
        ('BLK', 'Punto por Bloqueo'),
        ('ACE', 'Punto por Saque Directo'),
        ('ERR', 'Error del Oponente'),
    ]
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='point_events')
    set = models.ForeignKey(Set, on_delete=models.CASCADE, related_name='point_events')
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(null=True, blank=True)
    point_type = models.CharField(max_length=3, choices=POINT_TYPES, null=True, blank=True)
    home_score_after = models.PositiveIntegerField(null=True, blank=True)
    away_score_after = models.PositiveIntegerField(null=True, blank=True)
    description = models.TextField(blank=True)
