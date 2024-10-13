# Generated by Django 5.1.1 on 2024-10-13 09:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('matches', '0007_match_status'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='playerperformance',
            unique_together=set(),
        ),
        migrations.RemoveField(
            model_name='match',
            name='status',
        ),
        migrations.AlterField(
            model_name='playerperformance',
            name='aces',
            field=models.PositiveIntegerField(blank=True, default=0, null=True),
        ),
        migrations.AlterField(
            model_name='playerperformance',
            name='block_points',
            field=models.PositiveIntegerField(blank=True, default=0, null=True),
        ),
        migrations.AlterField(
            model_name='playerperformance',
            name='errors',
            field=models.PositiveIntegerField(blank=True, default=0, null=True),
        ),
        migrations.AlterField(
            model_name='playerperformance',
            name='spike_points',
            field=models.PositiveIntegerField(blank=True, default=0, null=True),
        ),
        migrations.RemoveField(
            model_name='playerperformance',
            name='digs',
        ),
        migrations.RemoveField(
            model_name='playerperformance',
            name='total_blocks',
        ),
    ]
