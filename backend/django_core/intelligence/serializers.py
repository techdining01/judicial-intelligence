from rest_framework import serializers
from .models import SimulationScenario, SimulationSession, SimulationMessage


class SimulationScenarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = SimulationScenario
        fields = '__all__'


class SimulationSessionSerializer(serializers.ModelSerializer):
    scenario = SimulationScenarioSerializer(read_only=True)
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = SimulationSession
        fields = '__all__'


class SimulationMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SimulationMessage
        fields = '__all__'