# urls.py

from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('', include('docs.urls')),
    path('api/teams/', include('teams.urls')),
    path('api/matches/', include('matches.urls')),
    path('api/statistics/', include('statistic.urls')),
]
