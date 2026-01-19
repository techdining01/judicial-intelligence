from celery import shared_task
from django.contrib.auth import get_user_model
from .models import AlertPreference
import requests

User = get_user_model()

FASTAPI_ALERT_URL = "http://fastapi:8001/alerts/send"

@shared_task
def send_morning_alerts():
    users = User.objects.filter(is_active=True, telegram_chat_id__isnull=False)

    for user in users:
        prefs = AlertPreference.objects.filter(user=user).first()
        if not prefs or not prefs.daily_summary:
            continue

        payload = {
            "chat_id": user.telegram_chat_id,
            "message": f"⚖️ Good morning {user.full_name}, your court updates are ready."
        }

        requests.post(FASTAPI_ALERT_URL, json=payload)
