from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CourtAlert


class MyAlertsAPIView(APIView):
    """List court alerts for the authenticated user."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        alerts = CourtAlert.objects.filter(user=request.user).order_by("-sent_at")[:50]
        data = [
            {
                "id": a.id,
                "title": a.title,
                "content": a.content,
                "sent_at": a.sent_at.isoformat(),
                "delivered": a.delivered,
            }
            for a in alerts
        ]
        return Response(data)
