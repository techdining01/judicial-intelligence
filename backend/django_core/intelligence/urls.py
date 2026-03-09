from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'scenarios', views.SimulationScenarioViewSet, basename='scenario')
router.register(r'sessions', views.SimulationSessionViewSet, basename='session')
router.register(r'messages', views.SimulationMessageViewSet, basename='message')

urlpatterns = [
    path('', include(router.urls)),
]