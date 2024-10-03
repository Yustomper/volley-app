# urls.py

from django.urls import path, include
from django.contrib import admin
rom django.http import HttpResponse


def index(request):
    return HttpResponse("Bienvenido a la API de Volley. Use /api/ para acceder a los endpoints.")


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('', include('docs.urls')),
    path('api/teams/', include('teams.urls')),
    path('api/matches/', include('matches.urls')),
    path('api/statistics/', include('statistic.urls')),
]
