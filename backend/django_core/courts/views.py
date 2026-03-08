from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from .models import Court, CourtCase


class CourtAnalyticsAPIView(APIView):
    """Court case volume and status breakdown for dashboards."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        courts = Court.objects.all()
        data = []
        for court in courts:
            cases = CourtCase.objects.filter(court=court)
            total = cases.count()
            status_breakdown = {
                r["status"]: r["c"]
                for r in cases.values("status").annotate(c=Count("id"))
            }
            monthly_trend = {}
            # Simple monthly trend from sitting_date
            for c in cases[:12]:
                key = c.sitting_date.strftime("%Y-%m") if c.sitting_date else "N/A"
                monthly_trend[key] = monthly_trend.get(key, 0) + 1
            data.append({
                "court_name": court.name,
                "court_type": court.get_court_type_display(),
                "total_cases": total,
                "status_breakdown": status_breakdown,
                "monthly_trend": monthly_trend,
            })
        return Response(data)
