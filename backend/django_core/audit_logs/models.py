from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class AuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=50)
    object_type = models.CharField(max_length=100)
    object_id = models.PositiveIntegerField()
    model_used = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
