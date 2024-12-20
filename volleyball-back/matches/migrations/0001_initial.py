# Generated by Django 5.1.1 on 2024-09-30 20:40

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('teams', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Match',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField()),
                ('location', models.CharField(max_length=255)),
                ('is_finished', models.BooleanField(default=False)),
                ('away_team', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='away_matches', to='teams.team')),
                ('home_team', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='home_matches', to='teams.team')),
            ],
        ),
        migrations.CreateModel(
            name='PlayerPerformance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('points', models.PositiveIntegerField(default=0)),
                ('blocks', models.PositiveIntegerField(default=0)),
                ('aces', models.PositiveIntegerField(default=0)),
                ('digs', models.PositiveIntegerField(default=0)),
                ('match', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='player_performances', to='matches.match')),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='teams.player')),
            ],
        ),
        migrations.CreateModel(
            name='Set',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('set_number', models.PositiveIntegerField()),
                ('home_team_score', models.PositiveIntegerField(default=0)),
                ('away_team_score', models.PositiveIntegerField(default=0)),
                ('match', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sets', to='matches.match')),
            ],
        ),
    ]
