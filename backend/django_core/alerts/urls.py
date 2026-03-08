from django.urls import path
from .views import MyAlertsAPIView

urlpatterns = [
    path("my/", MyAlertsAPIView.as_view()),
]
