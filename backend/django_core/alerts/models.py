from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL

class AlertPreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    daily_summary = models.BooleanField(default=True)
    cause_list_alerts = models.BooleanField(default=True)
    judgment_alerts = models.BooleanField(default=True)

    def __str__(self):
        return f"Alert prefs for {self.user}"
