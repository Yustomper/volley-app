from django.urls import path
from .views import StatisticsView, MatchStatisticsView

urlpatterns = [
    path('statistics/', StatisticsView.as_view(), name='statistics'),
    path('statistics/match/<int:match_id>/', MatchStatisticsView.as_view(), name='match-statistics'),
]
