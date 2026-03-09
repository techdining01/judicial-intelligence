from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import SimulationScenario, SimulationSession, SimulationMessage
from .serializers import SimulationScenarioSerializer, SimulationSessionSerializer, SimulationMessageSerializer


class SimulationScenarioViewSet(viewsets.ModelViewSet):
    queryset = SimulationScenario.objects.all()
    serializer_class = SimulationScenarioSerializer
    permission_classes = [IsAuthenticated]


class SimulationSessionViewSet(viewsets.ModelViewSet):
    serializer_class = SimulationSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SimulationSession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SimulationMessageViewSet(viewsets.ModelViewSet):
    serializer_class = SimulationMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        session_id = self.request.query_params.get('session')
        if session_id:
            return SimulationMessage.objects.filter(session_id=session_id, session__user=self.request.user)
        return SimulationMessage.objects.none()
