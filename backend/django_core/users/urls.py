from django.urls import path
from .api import LoginAPIView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("login/", LoginAPIView.as_view()),
    path("refresh/", TokenRefreshView.as_view()),
]

