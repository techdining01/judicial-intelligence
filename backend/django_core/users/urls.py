from django.urls import path
from .api import LoginAPIView, RegisterAPIView, ProfileUpdateAPIView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("login/", LoginAPIView.as_view()),
    path("register/", RegisterAPIView.as_view()),
    path("refresh/", TokenRefreshView.as_view()),
    path("profile/", ProfileUpdateAPIView.as_view()),
]

