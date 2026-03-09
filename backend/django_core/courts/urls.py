from django.urls import path
from .views import CourtAnalyticsAPIView
from .realtime_views import (
    RealtimeCourtAnalyticsAPIView, 
    RealtimeAlertsAPIView, 
    RealtimeJudgmentsAPIView,
    TriggerScrapingAPIView
)

urlpatterns = [
    path("analytics/", CourtAnalyticsAPIView.as_view()),
    path("realtime-analytics/", RealtimeCourtAnalyticsAPIView.as_view()),
    path("realtime-alerts/", RealtimeAlertsAPIView.as_view()),
    path("realtime-judgments/", RealtimeJudgmentsAPIView.as_view()),
    path("trigger-scraping/", TriggerScrapingAPIView.as_view()),
]
