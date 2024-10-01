from django.db import models

class Statistics(models.Model):
    total_matches = models.IntegerField(default=0)
    total_teams = models.IntegerField(default=0)
    top_scorer_name = models.CharField(max_length=100, blank=True)
    top_scorer_score = models.IntegerField(default=0)
    most_wins_team = models.CharField(max_length=100, blank=True)
    most_wins_count = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Statistics as of {self.last_updated}"