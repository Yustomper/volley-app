# teams/models.py
from django.db import models
from django.core.exceptions import ValidationError


class Team(models.Model):
    GENDER_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
    ]

    name = models.CharField(max_length=100)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.get_gender_display()})"


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
    avatar = models.URLField(blank=True, null=True)
    position = models.CharField(
        max_length=2, choices=POSITION_CHOICES, null=True, blank=True)
    is_holding = models.BooleanField(default=False)

    # Avatares por defecto según el género
    DEFAULT_AVATAR_MALE = "https://cdn.icon-icons.com/icons2/2643/PNG/512/male_boy_person_people_avatar_icon_159358.png"
    DEFAULT_AVATAR_FEMALE = "https://cdn.icon-icons.com/icons2/2643/PNG/512/female_woman_person_people_avatar_icon_159366.png"

    def save(self, *args, **kwargs):
        # Llamar a la validación antes de guardar
        self.clean()

        # Asignar avatar por defecto según el género del equipo
        if not self.avatar:
            if self.team.gender == 'M':
                self.avatar = self.DEFAULT_AVATAR_MALE
            elif self.team.gender == 'F':
                self.avatar = self.DEFAULT_AVATAR_FEMALE

        super().save(*args, **kwargs)

    def clean(self):
        # Validar que el jugador solo pertenezca a un equipo de su mismo género
        if self.team.gender == 'M' and self.avatar == self.DEFAULT_AVATAR_FEMALE:
            raise ValidationError(
                "No puedes agregar un jugador femenino a un equipo masculino.")
        if self.team.gender == 'F' and self.avatar == self.DEFAULT_AVATAR_MALE:
            raise ValidationError(
                "No puedes agregar un jugador masculino a un equipo femenino.")

        # Otras validaciones necesarias

    def __str__(self):
        return f"{self.name} ({self.team.name})"
