# Generated by Django 5.1.1 on 2024-10-13 05:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('matches', '0006_alter_playerperformance_aces_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='match',
            name='status',
            field=models.CharField(choices=[('scheduled', 'Scheduled'), ('in_progress', 'In Progress'), ('finished', 'Finished')], default='scheduled', max_length=20),
        ),
    ]
