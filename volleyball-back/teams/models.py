# teams/models.py
from django.db import models


class Team(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Player(models.Model):
    POSITION_CHOICES = [
        ('CE', 'Central'),
        ('PR', 'Punta Receptor'),
        ('AR', 'Armador'),
        ('OP', 'Opuesto'),
        ('LI', 'Líbero'),
    ]
    team = models.ForeignKey(
        Team, related_name='players', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    jersey_number = models.IntegerField()
    avatar_url = models.URLField(blank=True, null=True)
    position = models.CharField(max_length=2, choices=POSITION_CHOICES, null=True, blank=True)
    DEFAULT_AVATAR_URL = "https://cdn.icon-icons.com/icons2/2643/PNG/512/female_woman_person_people_avatar_icon_159366.png"

    def save(self, *args, **kwargs):
        if not self.avatar_url:
            self.avatar_url = self.DEFAULT_AVATAR_URL
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.team.name})"
