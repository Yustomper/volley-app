from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MatchViewSet, SetViewSet, PlayerPerformanceViewSet

router = DefaultRouter()
router.register(r'', MatchViewSet)
router.register(r'sets', SetViewSet)
router.register(r'performances', PlayerPerformanceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]