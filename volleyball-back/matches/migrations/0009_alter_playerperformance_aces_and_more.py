# Generated by Django 5.1.1 on 2024-10-14 20:07

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('matches', '0008_alter_playerperformance_unique_together_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='playerperformance',
            name='aces',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='playerperformance',
            name='block_points',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='playerperformance',
            name='errors',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='playerperformance',
            name='match',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='matches.match'),
        ),
        migrations.AlterField(
            model_name='playerperformance',
            name='set',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='matches.set'),
        ),
        migrations.AlterField(
            model_name='playerperformance',
            name='spike_points',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
