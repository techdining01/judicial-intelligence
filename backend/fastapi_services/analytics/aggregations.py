from django_core.courts.models import Court

def system_wide_court_load():
    data = []
    for court in Court.objects.all():
        data.append({
            "court": court.name,
            "total_cases": court.courtcase_set.count(),
        })
    return data
