"""
Alert & Notification System Triggers
Defines triggers for different types of legal alerts
"""

from typing import Dict, List, Any, Optional, Callable
from datetime import datetime, timedelta
from enum import Enum
import json

class AlertType(str, Enum):
    NEW_JUDGMENT = "new_judgment"
    CAUSE_LIST_UPDATE = "cause_list_update"
    HEARING_REMINDER = "hearing_reminder"
    CASE_STATUS_CHANGE = "case_status_change"
    PRECEDENT_MATCH = "precedent_match"
    TRAINING_COMPLETE = "training_complete"
    MOOT_COURT_INVITATION = "moot_court_invitation"
    SYSTEM_ANNOUNCEMENT = "system_announcement"

class NotificationPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class DeliveryChannel(str, Enum):
    EMAIL = "email"
    PUSH_NOTIFICATION = "push_notification"
    DASHBOARD_ALERT = "dashboard_alert"
    SMS = "sms"
    WEBHOOK = "webhook"

class AlertTrigger:
    """Base class for alert triggers"""
    
    def __init__(self, trigger_id: str, alert_type: AlertType, priority: NotificationPriority):
        self.trigger_id = trigger_id
        self.alert_type = alert_type
        self.priority = priority
        self.enabled = True
        self.conditions = {}
        self.filters = {}
    
    def evaluate(self, data: Dict[str, Any]) -> bool:
        """Evaluate if trigger should fire based on data"""
        raise NotImplementedError("Subclasses must implement evaluate method")
    
    def generate_alert(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate alert content"""
        raise NotImplementedError("Subclasses must implement generate_alert method")

class NewJudgmentTrigger(AlertTrigger):
    """Trigger for new court judgments"""
    
    def __init__(self):
        super().__init__(
            trigger_id="new_judgment_trigger",
            alert_type=AlertType.NEW_JUDGMENT,
            priority=NotificationPriority.MEDIUM
        )
        self.conditions = {
            "court_types": ["high_court", "appellate_court", "supreme_court"],
            "practice_areas": ["commercial", "constitutional", "family"],
            "jurisdictions": ["lagos", "abuja", "kano", "rivers"]
        }
    
    def evaluate(self, data: Dict[str, Any]) -> bool:
        """Check if new judgment matches user preferences"""
        if not self.enabled:
            return False
        
        judgment = data.get("judgment", {})
        
        # Check court type
        court_type = judgment.get("court_type", "")
        if court_type not in self.conditions["court_types"]:
            return False
        
        # Check practice area
        practice_area = judgment.get("practice_area", "")
        if practice_area not in self.conditions["practice_areas"]:
            return False
        
        # Check jurisdiction
        jurisdiction = judgment.get("jurisdiction", "")
        if jurisdiction not in self.conditions["jurisdictions"]:
            return False
        
        return True
    
    def generate_alert(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate new judgment alert"""
        judgment = data.get("judgment", {})
        
        return {
            "title": f"New Judgment: {judgment.get('case_title', 'Unknown Case')}",
            "message": f"A new judgment has been delivered by {judgment.get('court', 'Unknown Court')} in {judgment.get('jurisdiction', 'Unknown Jurisdiction')}.",
            "details": {
                "case_title": judgment.get("case_title"),
                "court": judgment.get("court"),
                "judgment_date": judgment.get("judgment_date"),
                "judge": judgment.get("judge"),
                "citation": judgment.get("citation"),
                "practice_area": judgment.get("practice_area"),
                "summary": judgment.get("summary", "")[:200] + "..." if len(judgment.get("summary", "")) > 200 else judgment.get("summary", "")
            },
            "action_url": f"/judgments/{judgment.get('id')}",
            "timestamp": datetime.now(),
            "priority": self.priority.value
        }

class CauseListUpdateTrigger(AlertTrigger):
    """Trigger for cause list updates"""
    
    def __init__(self):
        super().__init__(
            trigger_id="cause_list_update_trigger",
            alert_type=AlertType.CAUSE_LIST_UPDATE,
            priority=NotificationPriority.HIGH
        )
        self.conditions = {
            "case_status": ["listed", "adjourned", "fixed"],
            "time_sensitivity": ["today", "tomorrow", "this_week"]
        }
    
    def evaluate(self, data: Dict[str, Any]) -> bool:
        """Check if cause list update is relevant"""
        if not self.enabled:
            return False
        
        cause_item = data.get("cause_item", {})
        
        # Check case status
        status = cause_item.get("status", "")
        if status not in self.conditions["case_status"]:
            return False
        
        # Check time sensitivity
        hearing_date = cause_item.get("hearing_date")
        if hearing_date:
            hearing_dt = datetime.fromisoformat(hearing_date.replace('Z', '+00:00'))
            today = datetime.now()
            days_until = (hearing_dt - today).days
            
            if days_until <= 7:  # This week
                return True
        
        return False
    
    def generate_alert(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate cause list update alert"""
        cause_item = data.get("cause_item", {})
        
        return {
            "title": f"Cause List Update: {cause_item.get('case_number', 'Unknown Case')}",
            "message": f"Case {cause_item.get('case_number')} has been {cause_item.get('status', 'updated')} for hearing on {cause_item.get('hearing_date', 'TBD')}.",
            "details": {
                "case_number": cause_item.get("case_number"),
                "parties": cause_item.get("parties"),
                "court": cause_item.get("court"),
                "hearing_date": cause_item.get("hearing_date"),
                "judge": cause_item.get("judge"),
                "status": cause_item.get("status"),
                "room": cause_item.get("room")
            },
            "action_url": f"/cause-list/{cause_item.get('id')}",
            "timestamp": datetime.now(),
            "priority": self.priority.value
        }

class HearingReminderTrigger(AlertTrigger):
    """Trigger for hearing reminders"""
    
    def __init__(self):
        super().__init__(
            trigger_id="hearing_reminder_trigger",
            alert_type=AlertType.HEARING_REMINDER,
            priority=NotificationPriority.HIGH
        )
        self.conditions = {
            "reminder_intervals": [1, 3, 7],  # days before hearing
            "case_types": ["civil", "criminal", "family"]
        }
    
    def evaluate(self, data: Dict[str, Any]) -> bool:
        """Check if hearing reminder should be sent"""
        if not self.enabled:
            return False
        
        hearing = data.get("hearing", {})
        hearing_date = hearing.get("date")
        
        if not hearing_date:
            return False
        
        hearing_dt = datetime.fromisoformat(hearing_date.replace('Z', '+00:00'))
        today = datetime.now()
        days_until = (hearing_dt - today).days
        
        # Check if reminder interval matches
        return days_until in self.conditions["reminder_intervals"]
    
    def generate_alert(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate hearing reminder alert"""
        hearing = data.get("hearing", {})
        days_until = (datetime.fromisoformat(hearing["date"].replace('Z', '+00:00')) - datetime.now()).days
        
        return {
            "title": f"Hearing Reminder: {hearing.get('case_number', 'Unknown Case')}",
            "message": f"Your case {hearing.get('case_number')} is scheduled for hearing in {days_until} day{'s' if days_until != 1 else ''}.",
            "details": {
                "case_number": hearing.get("case_number"),
                "court": hearing.get("court"),
                "hearing_date": hearing.get("date"),
                "time": hearing.get("time"),
                "judge": hearing.get("judge"),
                "room": hearing.get("room"),
                "case_type": hearing.get("case_type"),
                "days_until": days_until
            },
            "action_url": f"/hearings/{hearing.get('id')}",
            "timestamp": datetime.now(),
            "priority": self.priority.value
        }

class PrecedentMatchTrigger(AlertTrigger):
    """Trigger for precedent matches"""
    
    def __init__(self):
        super().__init__(
            trigger_id="precedent_match_trigger",
            alert_type=AlertType.PRECEDENT_MATCH,
            priority=NotificationPriority.MEDIUM
        )
        self.conditions = {
            "similarity_threshold": 0.75,
            "relevance_score": 0.80
        }
    
    def evaluate(self, data: Dict[str, Any]) -> bool:
        """Check if precedent match is significant"""
        if not self.enabled:
            return False
        
        match = data.get("precedent_match", {})
        similarity_score = match.get("similarity_score", 0)
        relevance_score = match.get("relevance_score", 0)
        
        return (similarity_score >= self.conditions["similarity_threshold"] and
                relevance_score >= self.conditions["relevance_score"])
    
    def generate_alert(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate precedent match alert"""
        match = data.get("precedent_match", {})
        user_case = match.get("user_case", {})
        precedent = match.get("precedent", {})
        
        return {
            "title": f"Highly Relevant Precedent Found",
            "message": f"A precedent case with {match.get('similarity_score', 0):.1%} similarity has been found for your case.",
            "details": {
                "user_case": user_case.get("title"),
                "precedent_case": precedent.get("title"),
                "precedent_citation": precedent.get("citation"),
                "precedent_date": precedent.get("date"),
                "similarity_score": match.get("similarity_score"),
                "relevance_score": match.get("relevance_score"),
                "key_matching_points": match.get("matching_points", [])
            },
            "action_url": f"/precedents/{precedent.get('id')}",
            "timestamp": datetime.now(),
            "priority": self.priority.value
        }

class TrainingCompleteTrigger(AlertTrigger):
    """Trigger for training completion"""
    
    def __init__(self):
        super().__init__(
            trigger_id="training_complete_trigger",
            alert_type=AlertType.TRAINING_COMPLETE,
            priority=NotificationPriority.LOW
        )
        self.conditions = {
            "completion_threshold": 0.80,
            "min_duration": 30  # minutes
        }
    
    def evaluate(self, data: Dict[str, Any]) -> bool:
        """Check if training completion should be notified"""
        if not self.enabled:
            return False
        
        training = data.get("training", {})
        completion_rate = training.get("completion_rate", 0)
        duration = training.get("duration", 0)
        
        return (completion_rate >= self.conditions["completion_threshold"] and
                duration >= self.conditions["min_duration"])
    
    def generate_alert(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate training completion alert"""
        training = data.get("training", {})
        
        return {
            "title": f"Training Completed: {training.get('title', 'Unknown Training')}",
            "message": f"Congratulations! You have completed the training with a score of {training.get('score', 0):.1f}.",
            "details": {
                "training_title": training.get("title"),
                "category": training.get("category"),
                "difficulty": training.get("difficulty"),
                "score": training.get("score"),
                "completion_rate": training.get("completion_rate"),
                "duration": training.get("duration"),
                "achievements": training.get("achievements", [])
            },
            "action_url": f"/training/{training.get('id')}/certificate",
            "timestamp": datetime.now(),
            "priority": self.priority.value
        }

class TriggerManager:
    """Manages all alert triggers"""
    
    def __init__(self):
        self.triggers = {
            AlertType.NEW_JUDGMENT: NewJudgmentTrigger(),
            AlertType.CAUSE_LIST_UPDATE: CauseListUpdateTrigger(),
            AlertType.HEARING_REMINDER: HearingReminderTrigger(),
            AlertType.PRECEDENT_MATCH: PrecedentMatchTrigger(),
            AlertType.TRAINING_COMPLETE: TrainingCompleteTrigger()
        }
        self.user_preferences = {}
    
    def register_user_preferences(self, user_id: int, preferences: Dict[str, Any]):
        """Register user notification preferences"""
        self.user_preferences[user_id] = preferences
    
    def evaluate_triggers(self, alert_type: AlertType, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Evaluate all triggers of a specific type"""
        alerts = []
        
        if alert_type in self.triggers:
            trigger = self.triggers[alert_type]
            if trigger.evaluate(data):
                alert = trigger.generate_alert(data)
                alerts.append(alert)
        
        return alerts
    
    def evaluate_all_triggers(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Evaluate all triggers"""
        alerts = []
        
        for alert_type, trigger in self.triggers.items():
            if trigger.evaluate(data):
                alert = trigger.generate_alert(data)
                alerts.append(alert)
        
        return alerts
    
    def enable_trigger(self, alert_type: AlertType):
        """Enable a specific trigger"""
        if alert_type in self.triggers:
            self.triggers[alert_type].enabled = True
    
    def disable_trigger(self, alert_type: AlertType):
        """Disable a specific trigger"""
        if alert_type in self.triggers:
            self.triggers[alert_type].enabled = False
    
    def get_trigger_status(self) -> Dict[str, Any]:
        """Get status of all triggers"""
        status = {}
        
        for alert_type, trigger in self.triggers.items():
            status[alert_type.value] = {
                "enabled": trigger.enabled,
                "priority": trigger.priority.value,
                "trigger_id": trigger.trigger_id
            }
        
        return status
