from datetime import date
from courts.models import CourtCase



def get_today_cases():
    return CourtCase.objects.filter(sitting_date=date.today())

