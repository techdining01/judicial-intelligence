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

class AlertSubscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    court = models.CharField(max_length=255, blank=True)
    keywords = models.JSONField(default=list)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user} alerts"

class CourtAlert(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    delivered = models.BooleanField(default=False)





