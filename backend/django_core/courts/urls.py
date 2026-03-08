from django.urls import path
from .views import CourtAnalyticsAPIView

urlpatterns = [
    path("analytics/", CourtAnalyticsAPIView.as_view()),
]
