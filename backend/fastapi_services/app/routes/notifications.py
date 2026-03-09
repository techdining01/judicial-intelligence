"""
Alert & Notification System API Routes
Endpoints for managing alerts and notifications
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from datetime import datetime

from ..notifications.triggers import (
    TriggerManager, AlertType, NotificationPriority
)
from ..notifications.delivery import (
    NotificationManager, DeliveryChannel, EmailDelivery,
    PushNotificationDelivery, DashboardAlertDelivery, SMSDelivery, WebhookDelivery
)

router = APIRouter()

# Initialize notification system
trigger_manager = TriggerManager()
notification_manager = NotificationManager()

# Initialize delivery channels (with mock configs for demo)
dashboard_delivery = DashboardAlertDelivery()
notification_manager.register_delivery_channel(DeliveryChannel.DASHBOARD_ALERT, dashboard_delivery)

class TriggerAlertRequest(BaseModel):
    alert_type: AlertType
    data: Dict[str, Any]

class SendNotificationRequest(BaseModel):
    alert: Dict[str, Any]
    recipients: Dict[str, List[str]]  # channel -> list of recipients

class UserPreferencesRequest(BaseModel):
    user_id: int
    preferences: Dict[str, Any]

class WebhookRegistrationRequest(BaseModel):
    user_id: str
    webhook_url: str
    secret: Optional[str] = None

class AlertStatusRequest(BaseModel):
    alert_id: str

@router.get("/triggers")
def get_triggers():
    """Get all available triggers and their status"""
    try:
        trigger_status = trigger_manager.get_trigger_status()
        
        return {
            "triggers": trigger_status,
            "total_triggers": len(trigger_status),
            "enabled_triggers": len([t for t in trigger_status.values() if t["enabled"]]),
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/triggers/evaluate")
def evaluate_triggers(request: TriggerAlertRequest):
    """Evaluate triggers for a specific alert type"""
    try:
        alerts = trigger_manager.evaluate_triggers(request.alert_type, request.data)
        
        return {
            "alert_type": request.alert_type.value,
            "alerts_generated": len(alerts),
            "alerts": alerts,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/triggers/evaluate-all")
def evaluate_all_triggers(data: Dict[str, Any]):
    """Evaluate all triggers with provided data"""
    try:
        alerts = trigger_manager.evaluate_all_triggers(data)
        
        return {
            "total_alerts": len(alerts),
            "alerts": alerts,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/triggers/{alert_type}/enable")
def enable_trigger(alert_type: AlertType):
    """Enable a specific trigger"""
    try:
        trigger_manager.enable_trigger(alert_type)
        
        return {
            "alert_type": alert_type.value,
            "enabled": True,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/triggers/{alert_type}/disable")
def disable_trigger(alert_type: AlertType):
    """Disable a specific trigger"""
    try:
        trigger_manager.disable_trigger(alert_type)
        
        return {
            "alert_type": alert_type.value,
            "enabled": False,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/send")
def send_notification(request: SendNotificationRequest, background_tasks: BackgroundTasks):
    """Send notification through specified channels"""
    try:
        # Convert string channel names to enum
        recipients = {}
        for channel_str, recipient_list in request.recipients.items():
            try:
                channel = DeliveryChannel(channel_str)
                recipients[channel] = recipient_list
            except ValueError:
                raise HTTPException(status_code=400, detail=f"Invalid channel: {channel_str}")
        
        # Send notification (could be background task)
        result = notification_manager.send_notification(request.alert, recipients)
        
        return {
            "result": result,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/send-background")
def send_notification_background(request: SendNotificationRequest, background_tasks: BackgroundTasks):
    """Send notification in background"""
    try:
        # Convert string channel names to enum
        recipients = {}
        for channel_str, recipient_list in request.recipients.items():
            try:
                channel = DeliveryChannel(channel_str)
                recipients[channel] = recipient_list
            except ValueError:
                raise HTTPException(status_code=400, detail=f"Invalid channel: {channel_str}")
        
        # Add background task
        background_tasks.add_task(
            notification_manager.send_notification,
            request.alert,
            recipients
        )
        
        return {
            "message": "Notification queued for delivery",
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/user/preferences")
def register_user_preferences(request: UserPreferencesRequest):
    """Register user notification preferences"""
    try:
        trigger_manager.register_user_preferences(request.user_id, request.preferences)
        
        return {
            "user_id": request.user_id,
            "preferences_registered": True,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dashboard/{user_id}/alerts")
def get_user_dashboard_alerts(user_id: str, unread_only: bool = False):
    """Get alerts for user's dashboard"""
    try:
        alerts = dashboard_delivery.get_user_alerts(user_id, unread_only)
        
        return {
            "user_id": user_id,
            "alerts": alerts,
            "total_alerts": len(alerts),
            "unread_count": len([a for a in alerts if not a["read"]]),
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/dashboard/{user_id}/alerts/{alert_id}/read")
def mark_alert_read(user_id: str, alert_id: str):
    """Mark an alert as read"""
    try:
        success = dashboard_delivery.mark_alert_read(user_id, alert_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Alert not found")
        
        return {
            "user_id": user_id,
            "alert_id": alert_id,
            "marked_read": True,
            "status": "success"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/dashboard/{user_id}/alerts/read-all")
def mark_all_alerts_read(user_id: str):
    """Mark all alerts as read for a user"""
    try:
        count = dashboard_delivery.mark_all_alerts_read(user_id)
        
        return {
            "user_id": user_id,
            "alerts_marked_read": count,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook/register")
def register_webhook(request: WebhookRegistrationRequest):
    """Register webhook for notifications"""
    try:
        webhook_delivery = WebhookDelivery()
        webhook_delivery.register_webhook(request.user_id, request.webhook_url, request.secret)
        
        # Register webhook delivery channel if not already registered
        if DeliveryChannel.WEBHOOK not in notification_manager.delivery_channels:
            notification_manager.register_delivery_channel(DeliveryChannel.WEBHOOK, webhook_delivery)
        
        return {
            "user_id": request.user_id,
            "webhook_url": request.webhook_url,
            "registered": True,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/delivery/channels")
def get_delivery_channels():
    """Get status of all delivery channels"""
    try:
        channel_status = notification_manager.get_channel_status()
        
        return {
            "channels": channel_status,
            "total_channels": len(channel_status),
            "enabled_channels": len([c for c in channel_status.values() if c.get("enabled", False)]),
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/delivery/status/{alert_id}")
def get_delivery_status(alert_id: str):
    """Get delivery status for a specific alert"""
    try:
        status = notification_manager.get_delivery_status(alert_id)
        
        return {
            "alert_id": alert_id,
            "delivery_status": status,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/types")
def get_alert_types():
    """Get available alert types"""
    alert_types = [
        {
            "value": alert_type.value,
            "label": alert_type.value.replace("_", " ").title(),
            "description": self._get_alert_type_description(alert_type)
        }
        for alert_type in AlertType
    ]
    
    return {
        "alert_types": alert_types,
        "status": "success"
    }

@router.get("/priorities")
def get_notification_priorities():
    """Get available notification priorities"""
    priorities = [
        {
            "value": priority.value,
            "label": priority.value.title(),
            "description": self._get_priority_description(priority)
        }
        for priority in NotificationPriority
    ]
    
    return {
        "priorities": priorities,
        "status": "success"
    }

@router.get("/channels")
def get_delivery_channel_types():
    """Get available delivery channel types"""
    channels = [
        {
            "value": channel.value,
            "label": channel.value.replace("_", " ").title(),
            "description": self._get_channel_description(channel)
        }
        for channel in DeliveryChannel
    ]
    
    return {
        "channels": channels,
        "status": "success"
    }

@router.get("/stats")
def get_notification_stats():
    """Get notification system statistics"""
    try:
        # Mock statistics - in real implementation, query database
        stats = {
            "total_alerts_sent": 15420,
            "alerts_today": 127,
            "active_channels": len(notification_manager.delivery_channels),
            "success_rate": 94.5,
            "popular_alert_types": [
                {"type": "new_judgment", "count": 5234},
                {"type": "cause_list_update", "count": 4123},
                {"type": "hearing_reminder", "count": 3891},
                {"type": "precedent_match", "count": 2172}
            ],
            "channel_usage": {
                "dashboard_alert": 8923,
                "email": 4567,
                "push_notification": 1923,
                "sms": 7,
                "webhook": 0
            },
            "user_engagement": {
                "total_users": 1250,
                "active_users": 892,
                "users_with_notifications_enabled": 1156
            }
        }
        
        return {
            "stats": stats,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/test")
def test_notification_system():
    """Test the notification system with a sample alert"""
    try:
        # Create test alert
        test_alert = {
            "id": f"test_alert_{datetime.now().timestamp()}",
            "title": "Test Alert: System Verification",
            "message": "This is a test notification to verify the system is working correctly.",
            "details": {
                "test_type": "system_verification",
                "timestamp": datetime.now().isoformat(),
                "system": "judicial_intelligence_platform"
            },
            "action_url": "/dashboard",
            "timestamp": datetime.now(),
            "priority": "medium",
            "alert_type": "system_announcement"
        }
        
        # Send to dashboard only for testing
        recipients = {
            "dashboard_alert": ["test_user"]
        }
        
        result = notification_manager.send_notification(test_alert, recipients)
        
        return {
            "test_alert": test_alert,
            "delivery_result": result,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def _get_alert_type_description(alert_type: AlertType) -> str:
    """Get description for alert type"""
    descriptions = {
        AlertType.NEW_JUDGMENT: "Notifications for new court judgments",
        AlertType.CAUSE_LIST_UPDATE: "Updates to court cause lists",
        AlertType.HEARING_REMINDER: "Reminders for upcoming hearings",
        AlertType.CASE_STATUS_CHANGE: "Changes in case status",
        AlertType.PRECEDENT_MATCH: "Matches for relevant precedents",
        AlertType.TRAINING_COMPLETE: "Training session completions",
        AlertType.MOOT_COURT_INVITATION: "Invitations to moot court sessions",
        AlertType.SYSTEM_ANNOUNCEMENT: "System announcements and updates"
    }
    return descriptions.get(alert_type, "Unknown alert type")

def _get_priority_description(priority: NotificationPriority) -> str:
    """Get description for priority level"""
    descriptions = {
        NotificationPriority.LOW: "Low priority informational alerts",
        NotificationPriority.MEDIUM: "Medium priority important updates",
        NotificationPriority.HIGH: "High priority urgent notifications",
        NotificationPriority.URGENT: "Urgent critical alerts requiring immediate attention"
    }
    return descriptions.get(priority, "Unknown priority")

def _get_channel_description(channel: DeliveryChannel) -> str:
    """Get description for delivery channel"""
    descriptions = {
        DeliveryChannel.EMAIL: "Email notifications",
        DeliveryChannel.PUSH_NOTIFICATION: "Mobile push notifications",
        DeliveryChannel.DASHBOARD_ALERT: "In-dashboard alerts",
        DeliveryChannel.SMS: "SMS text messages",
        DeliveryChannel.WEBHOOK: "Webhook callbacks"
    }
    return descriptions.get(channel, "Unknown channel")
