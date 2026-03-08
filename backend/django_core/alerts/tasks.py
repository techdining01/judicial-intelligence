from celery import shared_task
import requests
from .models import AlertPreference
from django.contrib.auth import get_user_model
from django.utils.timezone import now
from .services import create_alert
from courts.models import CauseList
# from .services import build_daily_alerts
from .telegram import send_telegram_message


User = get_user_model()

FASTAPI_ALERT_URL = "http://fastapi:8001/alerts/send"

# @shared_task
# def send_morning_alerts():
#     users = User.objects.filter(is_active=True, telegram_chat_id__isnull=False)

#     for user in users:
#         prefs = AlertPreference.objects.filter(user=user).first()
#         if not prefs or not prefs.daily_summary:
#             continue

#         payload = {
#             "chat_id": user.telegram_chat_id,
#             "message": f"⚖️ Good morning {user.full_name}, your court updates are ready."
#         }

#         requests.post(FASTAPI_ALERT_URL, json=payload)



# def morning_alert_job():
#     today = now().date()
#     cases = CauseList.objects.filter(sitting_date=today)

#     for case in cases:
#         for sub in case.get_subscribed_users():
#             create_alert(
#                 user=sub.user,
#                 title=f"Today's Court Sitting: {case.suit_number}",
#                 content=case.summary
#             )



# @shared_task
# def morning_court_alert():
#     alerts = build_daily_alerts()

#     if not alerts:
#         return

#     message = "⚖️ *Today’s Court Alerts*\n\n"
#     for alert in alerts:
#         message += (
#             f"*Court:* {alert['court']}\n"
#             f"*Case:* {alert['suit_number']}\n"
#             f"*sitting_date:* {alert['sitting_date']}\n"
#             f"*filing_date:* {alert['filing_date']}\n"
#             f"*Parties:* {alert['parties']}\n"
#             f"*Summary:* {alert['summary']}\n\n"
#             f"*status:* {alert['status']}\n\n"
#         )
        
    
#     send_telegram_message(message)


from celery import shared_task
from courts.models import CourtCase
from services import generate_case_alert
from alerts.utils import get_subscribed_users


@shared_task
def process_case_alert(case_id):
    case = CourtCase.objects.get(id=case_id)

    for user in get_subscribed_users(case):
        generate_case_alert(case, user)
