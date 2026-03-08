from .models import AuditLog

def log_llm_action(user, action, object_type, object_id, model_used):
    AuditLog.objects.create(
        user=user,
        action=action,
        object_type=object_type,
        object_id=object_id,
        model_used=model_used
    )
