from django.contrib import admin
from .models import Set,Match,PlayerPerformance

# Register your models here.
admin.site.register(Set)
admin.site.register(Match)
admin.site.register(PlayerPerformance)