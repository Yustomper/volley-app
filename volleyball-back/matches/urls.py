# matches/urls.py
from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import MatchViewSet, SetViewSet, PlayerPerformanceViewSet

# Router simple para PlayerPerformance
performance_router = SimpleRouter()
performance_router.register(r'performances', PlayerPerformanceViewSet)

urlpatterns = [
    # Rutas para Match
    path('matches/',
         MatchViewSet.as_view({'get': 'list', 'post': 'create'}), name='match-list'),
    path('matches/<int:pk>/', MatchViewSet.as_view(
        {'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='match-detail'),
    path('matches/<int:pk>/start/',
         MatchViewSet.as_view({'post': 'start_match'}), name='match-start'),
    path('matches/<int:pk>/end/',
         MatchViewSet.as_view({'post': 'end_match'}), name='match-end'),
    path('matches/<int:pk>/suspend/',
         MatchViewSet.as_view({'post': 'suspend_match'}), name='match-suspend'),
    path('matches/<int:pk>/reschedule/',
         MatchViewSet.as_view({'post': 'reschedule_match'}), name='match-reschedule'),

    # Rutas para Score y PlayerPerformance
    path('matches/<int:pk>/update_score/',
         MatchViewSet.as_view({'patch': 'update_score'}), name='match-update-score'),


    # Rutas para Set, incluyendo update_timeouts
    path('matches/<int:match_id>/update_timeouts/',
         SetViewSet.as_view({'post': 'update_timeouts'}), name='update-timeouts'),

    # Rutas para Set, con `match_id` y `set_id`
    path('matches/<int:match_id>/sets/start_set/',
         SetViewSet.as_view({'post': 'start_set'}), name='start-set'),
    path('matches/<int:match_id>/sets/end_set/',
         SetViewSet.as_view({'post': 'end_set'}), name='end-set'),

    # Incluimos las rutas de PlayerPerformance
    path('', include(performance_router.urls)),
]
