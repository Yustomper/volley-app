from django.db import models
from teams.models import Team, Player

class Match(models.Model):
    home_team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='home_matches')
    away_team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='away_matches')
    date = models.DateTimeField()
    location = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    is_finished = models.BooleanField(default=False)
    start_time = models.DateTimeField(null=True, blank=True)
    duration = models.DurationField(null=True, blank=True)

    def __str__(self):
        return f"{self.home_team} vs {self.away_team} on {self.date}"

class Set(models.Model):
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='sets')
    set_number = models.PositiveIntegerField()
    home_team_score = models.PositiveIntegerField(default=0)
    away_team_score = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Set {self.set_number} of {self.match}"

class PlayerPerformance(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='player_performances')
    points = models.PositiveIntegerField(default=0)
    blocks = models.PositiveIntegerField(default=0)
    aces = models.PositiveIntegerField(default=0)
    digs = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.player} performance in {self.match}"