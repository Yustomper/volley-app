# urls.py
from django.urls import path, include
from django.contrib import admin


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('', include('docs.urls')),
    path('api/', include('teams.urls')),
    path('api/', include('matches.urls')),
    path('api/', include('statistic.urls')),
    path('api/', include('weather.urls')),
]
