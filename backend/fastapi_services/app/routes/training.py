"""
Legal Training System API Routes
Endpoints for legal training simulations and progress tracking
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from datetime import datetime

from ..training.engine import LegalTrainingEngine
from ..training.models import (
    SimulationSession, SimulationMessage, EvaluationResult,
    TrainingProgress, DifficultyLevel, TrainingCategory
)

router = APIRouter()

# Initialize training engine
training_engine = LegalTrainingEngine()

class CreateSessionRequest(BaseModel):
    user_id: int
    scenario_template_id: str
    participant_role: str = "attorney"

class MessageRequest(BaseModel):
    session_id: str
    message: str
    message_type: str = "argument"

class SessionRequest(BaseModel):
    session_id: str

class ProgressRequest(BaseModel):
    user_id: int

@router.get("/scenarios")
def get_available_scenarios():
    """Get list of available training scenarios"""
    scenarios = []
    for template_id, template in training_engine.scenario_templates.items():
        scenarios.append({
            "id": template_id,
            "title": template["title"],
            "description": template["description"],
            "category": template["category"],
            "difficulty": template["difficulty"],
            "duration": template["duration"],
            "phases": template["phases"]
        })
    
    return {
        "scenarios": scenarios,
        "total_count": len(scenarios),
        "status": "success"
    }

@router.post("/session/create")
def create_simulation_session(request: CreateSessionRequest):
    """Create a new simulation session"""
    try:
        result = training_engine.create_simulation_session(
            request.user_id,
            request.scenario_template_id,
            request.participant_role
        )
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return {
            "session": result,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/session/message")
def send_message(request: MessageRequest):
    """Send a message in simulation session"""
    try:
        result = training_engine.process_user_message(
            request.session_id,
            request.message,
            request.message_type
        )
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return {
            "response": result,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/session/complete")
def complete_session(request: SessionRequest):
    """Complete a simulation session and get evaluation"""
    try:
        result = training_engine.complete_session(request.session_id)
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return {
            "result": result,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/session/{session_id}")
def get_session_details(session_id: str):
    """Get details of a specific session"""
    try:
        if session_id not in training_engine.active_sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        
        session = training_engine.active_sessions[session_id]
        
        return {
            "session_id": session_id,
            "scenario": session["scenario"],
            "status": session["status"],
            "current_phase": session["current_phase"],
            "participant_role": session["participant_role"],
            "start_time": session["start_time"],
            "message_count": len(session["messages"]),
            "context": session.get("scenario_context", ""),
            "status": "success"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/session/{session_id}/messages")
def get_session_messages(session_id: str):
    """Get all messages in a session"""
    try:
        if session_id not in training_engine.active_sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        
        session = training_engine.active_sessions[session_id]
        
        return {
            "session_id": session_id,
            "messages": session["messages"],
            "total_messages": len(session["messages"]),
            "status": "success"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/progress")
def get_user_progress(request: ProgressRequest):
    """Get user's training progress"""
    try:
        progress = training_engine.get_user_progress(request.user_id)
        
        return {
            "progress": progress,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/categories")
def get_training_categories():
    """Get available training categories"""
    categories = [
        {
            "value": category.value,
            "label": category.value.replace("_", " ").title()
        }
        for category in TrainingCategory
    ]
    
    return {
        "categories": categories,
        "status": "success"
    }

@router.get("/difficulty-levels")
def get_difficulty_levels():
    """Get available difficulty levels"""
    levels = [
        {
            "value": level.value,
            "label": level.value.title()
        }
        for level in DifficultyLevel
    ]
    
    return {
        "levels": levels,
        "status": "success"
    }

@router.get("/leaderboard")
def get_training_leaderboard(category: Optional[str] = None, limit: int = 10):
    """Get training leaderboard"""
    # Mock leaderboard data
    leaderboard = [
        {"rank": 1, "user_id": 101, "name": "A. Johnson", "score": 92.5, "sessions_completed": 12},
        {"rank": 2, "user_id": 205, "name": "B. Smith", "score": 88.3, "sessions_completed": 10},
        {"rank": 3, "user_id": 89, "name": "C. Williams", "score": 85.7, "sessions_completed": 8},
        {"rank": 4, "user_id": 150, "name": "D. Brown", "score": 82.1, "sessions_completed": 9},
        {"rank": 5, "user_id": 73, "name": "E. Davis", "score": 79.8, "sessions_completed": 7},
    ]
    
    return {
        "leaderboard": leaderboard[:limit],
        "category": category,
        "status": "success"
    }

@router.get("/achievements")
def get_achievements():
    """Get available achievements"""
    achievements = [
        {
            "id": "first_case_won",
            "name": "First Case Won",
            "description": "Win your first simulation case",
            "category": "milestone",
            "icon": "🏆"
        },
        {
            "id": "quick_learner",
            "name": "Quick Learner",
            "description": "Complete 5 sessions with score > 80",
            "category": "skill",
            "icon": "📚"
        },
        {
            "id": "civil_expert",
            "name": "Civil Litigation Expert",
            "description": "Complete all civil litigation scenarios",
            "category": "completion",
            "icon": "⚖️"
        },
        {
            "id": "week_streak",
            "name": "Week Streak",
            "description": "Train for 7 consecutive days",
            "category": "streak",
            "icon": "🔥"
        }
    ]
    
    return {
        "achievements": achievements,
        "status": "success"
    }

@router.get("/stats")
def get_training_stats():
    """Get overall training statistics"""
    stats = {
        "total_users": 1250,
        "active_sessions": 45,
        "completed_sessions_today": 128,
        "average_session_duration": 52,  # minutes
        "popular_categories": [
            {"category": "civil_litigation", "sessions": 342},
            {"category": "criminal_procedure", "sessions": 289},
            {"category": "family_law", "sessions": 156}
        ],
        "completion_rates": {
            "beginner": 0.85,
            "intermediate": 0.72,
            "advanced": 0.58,
            "expert": 0.41
        }
    }
    
    return {
        "stats": stats,
        "status": "success"
    }
