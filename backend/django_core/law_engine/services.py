from .models import CourtRule

def get_procedure(court_name, order_number):
    return CourtRule.objects.filter(
        court_name=court_name,
        order_number=order_number
    ).first()
