"""
Alert & Notification System Delivery
Handles delivery of alerts through various channels
"""

from typing import Dict, List, Any, Optional
from datetime import datetime
from enum import Enum
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import requests

from .triggers import DeliveryChannel, NotificationPriority

class DeliveryStatus(str, Enum):
    PENDING = "pending"
    SENT = "sent"
    DELIVERED = "delivered"
    FAILED = "failed"
    RETRY = "retry"

class NotificationDelivery:
    """Base class for notification delivery"""
    
    def __init__(self, channel: DeliveryChannel):
        self.channel = channel
        self.enabled = True
        self.rate_limits = {}
        self.delivery_history = []
    
    def send(self, alert: Dict[str, Any], recipients: List[str]) -> Dict[str, Any]:
        """Send notification through this channel"""
        raise NotImplementedError("Subclasses must implement send method")
    
    def check_rate_limit(self, recipient: str) -> bool:
        """Check if recipient is within rate limits"""
        # Simple rate limiting - max 10 notifications per hour per recipient
        current_time = datetime.now()
        hour_ago = current_time - timedelta(hours=1)
        
        recent_count = len([
            delivery for delivery in self.delivery_history
            if (delivery["recipient"] == recipient and
                delivery["timestamp"] > hour_ago and
                delivery["channel"] == self.channel.value)
        ])
        
        return recent_count < 10
    
    def record_delivery(self, recipient: str, status: DeliveryStatus, error: str = None):
        """Record delivery attempt"""
        self.delivery_history.append({
            "recipient": recipient,
            "channel": self.channel.value,
            "status": status.value,
            "timestamp": datetime.now(),
            "error": error
        })

class EmailDelivery(NotificationDelivery):
    """Email notification delivery"""
    
    def __init__(self, smtp_host: str, smtp_port: int, smtp_user: str, smtp_password: str):
        super().__init__(DeliveryChannel.EMAIL)
        self.smtp_host = smtp_host
        self.smtp_port = smtp_port
        self.smtp_user = smtp_user
        self.smtp_password = smtp_password
    
    def send(self, alert: Dict[str, Any], recipients: List[str]) -> Dict[str, Any]:
        """Send email notification"""
        results = []
        
        for recipient in recipients:
            if not self.check_rate_limit(recipient):
                results.append({
                    "recipient": recipient,
                    "status": DeliveryStatus.FAILED,
                    "error": "Rate limit exceeded"
                })
                continue
            
            try:
                # Create email message
                msg = MIMEMultipart()
                msg['From'] = self.smtp_user
                msg['To'] = recipient
                msg['Subject'] = alert["title"]
                
                # HTML email body
                html_body = self._generate_html_email(alert)
                msg.attach(MIMEText(html_body, 'html'))
                
                # Send email
                with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                    server.starttls()
                    server.login(self.smtp_user, self.smtp_password)
                    server.send_message(msg)
                
                self.record_delivery(recipient, DeliveryStatus.SENT)
                results.append({
                    "recipient": recipient,
                    "status": DeliveryStatus.SENT
                })
                
            except Exception as e:
                self.record_delivery(recipient, DeliveryStatus.FAILED, str(e))
                results.append({
                    "recipient": recipient,
                    "status": DeliveryStatus.FAILED,
                    "error": str(e)
                })
        
        return {
            "channel": self.channel.value,
            "results": results,
            "total_sent": len([r for r in results if r["status"] == DeliveryStatus.SENT]),
            "total_failed": len([r for r in results if r["status"] == DeliveryStatus.FAILED])
        }
    
    def _generate_html_email(self, alert: Dict[str, Any]) -> str:
        """Generate HTML email content"""
        priority_colors = {
            "low": "#28a745",
            "medium": "#ffc107",
            "high": "#fd7e14",
            "urgent": "#dc3545"
        }
        
        color = priority_colors.get(alert.get("priority", "medium"), "#ffc107")
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>{alert['title']}</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }}
                .container {{ max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
                .header {{ background-color: {color}; color: white; padding: 15px; border-radius: 8px 8px 0 0; margin: -20px -20px 20px -20px; }}
                .content {{ margin-bottom: 20px; }}
                .details {{ background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }}
                .action-button {{ background-color: {color}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }}
                .footer {{ color: #666; font-size: 12px; border-top: 1px solid #eee; padding-top: 15px; margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>{alert['title']}</h2>
                </div>
                <div class="content">
                    <p>{alert['message']}</p>
                    
                    {self._format_details(alert.get('details', {}))}
                    
                    {f'<a href="{alert["action_url"]}" class="action-button">View Details</a>' if alert.get('action_url') else ''}
                </div>
                <div class="footer">
                    <p>This notification was sent by Judicial Intelligence Platform.</p>
                    <p>If you don't want to receive these emails, you can <a href="#">unsubscribe</a>.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return html
    
    def _format_details(self, details: Dict[str, Any]) -> str:
        """Format details for email"""
        if not details:
            return ""
        
        html = '<div class="details"><h3>Details:</h3><ul>'
        for key, value in details.items():
            if key not in ['action_url']:
                html += f'<li><strong>{key.replace("_", " ").title()}:</strong> {value}</li>'
        html += '</ul></div>'
        
        return html

class PushNotificationDelivery(NotificationDelivery):
    """Push notification delivery"""
    
    def __init__(self, firebase_config: Dict[str, Any]):
        super().__init__(DeliveryChannel.PUSH_NOTIFICATION)
        self.firebase_config = firebase_config
    
    def send(self, alert: Dict[str, Any], recipients: List[str]) -> Dict[str, Any]:
        """Send push notification"""
        results = []
        
        for recipient in recipients:
            if not self.check_rate_limit(recipient):
                results.append({
                    "recipient": recipient,
                    "status": DeliveryStatus.FAILED,
                    "error": "Rate limit exceeded"
                })
                continue
            
            try:
                # Mock push notification - in real implementation, use FCM
                push_payload = {
                    "to": recipient,
                    "notification": {
                        "title": alert["title"],
                        "body": alert["message"],
                        "sound": "default",
                        "badge": "1"
                    },
                    "data": {
                        "action_url": alert.get("action_url", ""),
                        "priority": alert.get("priority", "medium"),
                        "alert_type": alert.get("alert_type", "general")
                    }
                }
                
                # Mock successful delivery
                self.record_delivery(recipient, DeliveryStatus.SENT)
                results.append({
                    "recipient": recipient,
                    "status": DeliveryStatus.SENT
                })
                
            except Exception as e:
                self.record_delivery(recipient, DeliveryStatus.FAILED, str(e))
                results.append({
                    "recipient": recipient,
                    "status": DeliveryStatus.FAILED,
                    "error": str(e)
                })
        
        return {
            "channel": self.channel.value,
            "results": results,
            "total_sent": len([r for r in results if r["status"] == DeliveryStatus.SENT]),
            "total_failed": len([r for r in results if r["status"] == DeliveryStatus.FAILED])
        }

class DashboardAlertDelivery(NotificationDelivery):
    """Dashboard alert delivery"""
    
    def __init__(self):
        super().__init__(DeliveryChannel.DASHBOARD_ALERT)
        self.user_alerts = {}  # user_id -> list of alerts
    
    def send(self, alert: Dict[str, Any], recipients: List[str]) -> Dict[str, Any]:
        """Send dashboard alert"""
        results = []
        
        for recipient in recipients:
            try:
                # Store alert for user's dashboard
                user_id = recipient
                if user_id not in self.user_alerts:
                    self.user_alerts[user_id] = []
                
                dashboard_alert = {
                    **alert,
                    "id": f"alert_{datetime.now().timestamp()}_{user_id}",
                    "read": False,
                    "created_at": datetime.now()
                }
                
                self.user_alerts[user_id].append(dashboard_alert)
                
                # Keep only last 50 alerts per user
                if len(self.user_alerts[user_id]) > 50:
                    self.user_alerts[user_id] = self.user_alerts[user_id][-50:]
                
                self.record_delivery(recipient, DeliveryStatus.DELIVERED)
                results.append({
                    "recipient": recipient,
                    "status": DeliveryStatus.DELIVERED
                })
                
            except Exception as e:
                self.record_delivery(recipient, DeliveryStatus.FAILED, str(e))
                results.append({
                    "recipient": recipient,
                    "status": DeliveryStatus.FAILED,
                    "error": str(e)
                })
        
        return {
            "channel": self.channel.value,
            "results": results,
            "total_delivered": len([r for r in results if r["status"] == DeliveryStatus.DELIVERED]),
            "total_failed": len([r for r in results if r["status"] == DeliveryStatus.FAILED])
        }
    
    def get_user_alerts(self, user_id: str, unread_only: bool = False) -> List[Dict[str, Any]]:
        """Get alerts for a user's dashboard"""
        alerts = self.user_alerts.get(user_id, [])
        
        if unread_only:
            alerts = [alert for alert in alerts if not alert["read"]]
        
        # Sort by creation time (newest first)
        alerts.sort(key=lambda x: x["created_at"], reverse=True)
        
        return alerts
    
    def mark_alert_read(self, user_id: str, alert_id: str) -> bool:
        """Mark an alert as read"""
        if user_id not in self.user_alerts:
            return False
        
        for alert in self.user_alerts[user_id]:
            if alert["id"] == alert_id:
                alert["read"] = True
                return True
        
        return False
    
    def mark_all_alerts_read(self, user_id: str) -> int:
        """Mark all alerts as read for a user"""
        if user_id not in self.user_alerts:
            return 0
        
        count = 0
        for alert in self.user_alerts[user_id]:
            if not alert["read"]:
                alert["read"] = True
                count += 1
        
        return count

class SMSDelivery(NotificationDelivery):
    """SMS notification delivery"""
    
    def __init__(self, sms_provider_config: Dict[str, Any]):
        super().__init__(DeliveryChannel.SMS)
        self.sms_provider_config = sms_provider_config
    
    def send(self, alert: Dict[str, Any], recipients: List[str]) -> Dict[str, Any]:
        """Send SMS notification"""
        results = []
        
        for recipient in recipients:
            if not self.check_rate_limit(recipient):
                results.append({
                    "recipient": recipient,
                    "status": DeliveryStatus.FAILED,
                    "error": "Rate limit exceeded"
                })
                continue
            
            try:
                # Format SMS message (short and concise)
                sms_message = f"{alert['title']}: {alert['message'][:100]}"
                
                # Mock SMS delivery - in real implementation, use SMS provider API
                self.record_delivery(recipient, DeliveryStatus.SENT)
                results.append({
                    "recipient": recipient,
                    "status": DeliveryStatus.SENT
                })
                
            except Exception as e:
                self.record_delivery(recipient, DeliveryStatus.FAILED, str(e))
                results.append({
                    "recipient": recipient,
                    "status": DeliveryStatus.FAILED,
                    "error": str(e)
                })
        
        return {
            "channel": self.channel.value,
            "results": results,
            "total_sent": len([r for r in results if r["status"] == DeliveryStatus.SENT]),
            "total_failed": len([r for r in results if r["status"] == DeliveryStatus.FAILED])
        }

class WebhookDelivery(NotificationDelivery):
    """Webhook notification delivery"""
    
    def __init__(self):
        super().__init__(DeliveryChannel.WEBHOOK)
        self.webhook_endpoints = {}
    
    def register_webhook(self, user_id: str, webhook_url: str, secret: str = None):
        """Register webhook endpoint for a user"""
        self.webhook_endpoints[user_id] = {
            "url": webhook_url,
            "secret": secret
        }
    
    def send(self, alert: Dict[str, Any], recipients: List[str]) -> Dict[str, Any]:
        """Send webhook notification"""
        results = []
        
        for recipient in recipients:
            if recipient not in self.webhook_endpoints:
                results.append({
                    "recipient": recipient,
                    "status": DeliveryStatus.FAILED,
                    "error": "No webhook registered"
                })
                continue
            
            if not self.check_rate_limit(recipient):
                results.append({
                    "recipient": recipient,
                    "status": DeliveryStatus.FAILED,
                    "error": "Rate limit exceeded"
                })
                continue
            
            try:
                webhook_config = self.webhook_endpoints[recipient]
                webhook_url = webhook_config["url"]
                
                # Prepare webhook payload
                payload = {
                    "alert": alert,
                    "timestamp": datetime.now().isoformat(),
                    "webhook_id": recipient
                }
                
                # Add signature if secret is provided
                headers = {"Content-Type": "application/json"}
                if webhook_config.get("secret"):
                    # Simple signature - in real implementation, use HMAC
                    headers["X-Webhook-Signature"] = f"sha256={webhook_config['secret']}"
                
                # Send webhook
                response = requests.post(webhook_url, json=payload, headers=headers, timeout=10)
                response.raise_for_status()
                
                self.record_delivery(recipient, DeliveryStatus.SENT)
                results.append({
                    "recipient": recipient,
                    "status": DeliveryStatus.SENT,
                    "response_code": response.status_code
                })
                
            except Exception as e:
                self.record_delivery(recipient, DeliveryStatus.FAILED, str(e))
                results.append({
                    "recipient": recipient,
                    "status": DeliveryStatus.FAILED,
                    "error": str(e)
                })
        
        return {
            "channel": self.channel.value,
            "results": results,
            "total_sent": len([r for r in results if r["status"] == DeliveryStatus.SENT]),
            "total_failed": len([r for r in results if r["status"] == DeliveryStatus.FAILED])
        }

class NotificationManager:
    """Manages all notification delivery channels"""
    
    def __init__(self):
        self.delivery_channels = {}
        self.delivery_history = []
    
    def register_delivery_channel(self, channel: DeliveryChannel, delivery_instance: NotificationDelivery):
        """Register a delivery channel"""
        self.delivery_channels[channel] = delivery_instance
    
    def send_notification(self, alert: Dict[str, Any], recipients: Dict[DeliveryChannel, List[str]]) -> Dict[str, Any]:
        """Send notification through multiple channels"""
        results = {}
        
        for channel, recipient_list in recipients.items():
            if channel in self.delivery_channels:
                delivery_instance = self.delivery_channels[channel]
                if delivery_instance.enabled:
                    result = delivery_instance.send(alert, recipient_list)
                    results[channel.value] = result
                else:
                    results[channel.value] = {
                        "channel": channel.value,
                        "error": "Channel disabled"
                    }
            else:
                results[channel.value] = {
                    "channel": channel.value,
                    "error": "Channel not registered"
                }
        
        return {
            "alert_id": alert.get("id", f"alert_{datetime.now().timestamp()}"),
            "alert_title": alert.get("title", "Unknown Alert"),
            "delivery_results": results,
            "timestamp": datetime.now()
        }
    
    def get_delivery_status(self, alert_id: str) -> Dict[str, Any]:
        """Get delivery status for an alert"""
        # In real implementation, query database
        return {
            "alert_id": alert_id,
            "status": "completed",
            "delivery_summary": {
                "total_channels": len(self.delivery_channels),
                "successful_channels": 3,
                "failed_channels": 0
            }
        }
    
    def get_channel_status(self) -> Dict[str, Any]:
        """Get status of all delivery channels"""
        status = {}
        
        for channel, delivery_instance in self.delivery_channels.items():
            status[channel.value] = {
                "enabled": delivery_instance.enabled,
                "total_deliveries": len(delivery_instance.delivery_history),
                "success_rate": self._calculate_success_rate(delivery_instance.delivery_history)
            }
        
        return status
    
    def _calculate_success_rate(self, history: List[Dict[str, Any]]) -> float:
        """Calculate success rate for a delivery channel"""
        if not history:
            return 0.0
        
        successful = len([
            delivery for delivery in history
            if delivery["status"] in [DeliveryStatus.SENT, DeliveryStatus.DELIVERED]
        ])
        
        return (successful / len(history)) * 100
