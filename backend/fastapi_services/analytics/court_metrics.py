from django.db.models import Count, Avg
from django_core.courts.models import CourtCase

def court_case_volume(court):
    return CourtCase.objects.filter(court=court).count()

def court_status_breakdown(court):
    qs = CourtCase.objects.filter(court=court)
    return qs.values("status").annotate(total=Count("id"))

def average_case_duration(court):
    qs = CourtCase.objects.filter(court=court, status="concluded")
    return qs.aggregate(avg_days=Avg("sitting_date"))
