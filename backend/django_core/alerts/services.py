from courts.models import CourtCase
from .models import CourtAlert, AlertPreference, AlertSubscription
from .constants import MAX_ALERTS_PER_DAY
from .selectors import get_today_cases
import requests
from django.utils.timezone import now



from .models import CourtAlert
from audit_logs.utils import log_llm_action
from django.contrib.auth import get_user_model

User = get_user_model()


def create_alert(data):
    user = User.objects.get(id=data["user_id"])

    CourtAlert.objects.create(
        user=user,
        title=data["title"],
        content=data["content"]
    )

    log_llm_action(
        user=user,
        action="ALERT_SUMMARY",
        object_type="CourtCase",
        object_id=data.get("case_id", 0),
        model_used=data["model_used"]
    )



from fastapi_services.app.ai.summarizer import summarize_text, explain_in_plain_english
from alerts.models import CourtAlert
from audit_logs.utils import log_llm_action


def generate_case_alert(case, user):
    """
    Creates an alert for a court case update
    """

    summary = summarize_text(case.summary or case.parties)

    CourtAlert.objects.create(
        user=user,
        title=f"Court Update: {case.title}",
        content=summary
    )

    log_llm_action(
        user=user,
        action="ALERT_SUMMARY",
        object_type="CourtCase",
        object_id=case.id,
        model_used="gemini-2.0-flash"
    )


 
# def create_alert(user, title, content):
#     daily_count = CourtAlert.objects.filter(
#         user=user,
#         sent_at__date__gte=None
#     ).count()

#     if daily_count < MAX_ALERTS_PER_DAY:
#         CourtAlert.objects.create(
#             user=user,
#             title=title,
#             content=content
#         )



# FASTAPI_AI_URL = "http://localhost:8001/summarize"

# def generate_alerts_for_today():
#     today = now().date()
#     cases = CourtCase.objects.filter(sitting_date=today)

#     subscriptions = AlertSubscription.objects.filter(active=True)

#     for case in cases:
#         for sub in subscriptions:
#             # court filter
#             if sub.court and sub.court != str(case.court):
#                 continue

#             # keyword filter
#             if sub.keywords:
#                 text = f"{case.title} {case.parties}"
#                 if not any(k.lower() in text.lower() for k in sub.keywords):
#                     continue

#             prefs = AlertPreference.objects.get(user=sub.user)
#             if not prefs.cause_list_alerts:
#                 continue

#             # AI summary call
#             response = requests.post(
#                 FASTAPI_AI_URL,
#                 json={"text": case.summary or case.title}
#             )
#             ai_summary = response.json()["summary"]

#             create_alert(
#                 user=sub.user,
#                 title=f"Court Sitting Today: {case.suit_number}",
#                 content=ai_summary
#             )
           