"""
AI Moot Court Engine API Routes
Endpoints for moot court simulations with AI judges
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from datetime import datetime

from ..moot_court.personas import (
    JudgePersonaFactory, CourtroomDialogueEngine, JudgePersona
)
from ..moot_court.scoring import MootCourtScorer

router = APIRouter()

# Initialize moot court components
dialogue_engine = CourtroomDialogueEngine()
scorer = MootCourtScorer()

class StartMootSessionRequest(BaseModel):
    session_id: str
    persona_type: JudgePersona
    case_type: str
    case_facts: str

class MootArgumentRequest(BaseModel):
    session_id: str
    user_argument: str
    argument_type: str = "legal_argument"

class MootSessionRequest(BaseModel):
    session_id: str

@router.get("/personas")
def get_judge_personas():
    """Get available judge personas"""
    try:
        personas = JudgePersonaFactory.get_available_personas()
        
        return {
            "personas": personas,
            "total_count": len(personas),
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/personas/{persona_type}")
def get_persona_details(persona_type: JudgePersona):
    """Get details for a specific judge persona"""
    try:
        persona = JudgePersonaFactory.create_persona(persona_type)
        prompt = JudgePersonaFactory.get_persona_prompt(persona_type)
        
        return {
            "persona_type": persona_type.value,
            "name": persona.name,
            "specialization": persona.specialization,
            "temperament": persona.temperament,
            "expertise_level": persona.expertise_level,
            "questioning_style": persona.questioning_style,
            "decision_factors": persona.decision_factors,
            "common_phrases": persona.common_phrases,
            "biases": persona.biases,
            "prompt_preview": prompt[:500] + "..." if len(prompt) > 500 else prompt,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/session/start")
def start_moot_session(request: StartMootSessionRequest):
    """Start a new moot court session"""
    try:
        result = dialogue_engine.start_moot_session(
            request.session_id,
            request.persona_type,
            request.case_type,
            request.case_facts
        )
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return {
            "session": result,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/session/argument")
def submit_argument(request: MootArgumentRequest):
    """Submit argument and get judge response"""
    try:
        result = dialogue_engine.process_argument(
            request.session_id,
            request.user_argument,
            request.argument_type
        )
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return {
            "response": result,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/session/evaluate")
def evaluate_session(request: MootSessionRequest):
    """Evaluate performance in moot court session"""
    try:
        evaluation = dialogue_engine.evaluate_performance(request.session_id)
        
        if "error" in evaluation:
            raise HTTPException(status_code=400, detail=evaluation["error"])
        
        return {
            "evaluation": evaluation,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/session/complete")
def complete_moot_session(request: MootSessionRequest):
    """Complete moot court session and get final score"""
    try:
        # Get session details
        if request.session_id not in dialogue_engine.active_sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        
        session = dialogue_engine.active_sessions[request.session_id]
        
        # Analyze dialogue
        analysis = scorer.analyze_dialogue(session["dialogue_history"])
        
        # Calculate overall score
        final_score = scorer.calculate_overall_score(analysis)
        
        # Clean up session
        del dialogue_engine.active_sessions[request.session_id]
        
        return {
            "final_score": final_score,
            "detailed_analysis": analysis,
            "session_completed": True,
            "completion_time": datetime.now(),
            "status": "success"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/session/{session_id}")
def get_session_details(session_id: str):
    """Get details of an active moot court session"""
    try:
        if session_id not in dialogue_engine.active_sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        
        session = dialogue_engine.active_sessions[session_id]
        
        return {
            "session_id": session_id,
            "judge_persona": session["judge_persona"].name,
            "persona_type": session["judge_persona"].temperament,
            "case_type": session["case_type"],
            "current_phase": session["current_phase"],
            "dialogue_count": len(session["dialogue_history"]),
            "session_duration": (datetime.now() - session.get("start_time", datetime.now())).total_seconds() / 60,
            "status": "active",
            "status": "success"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/session/{session_id}/dialogue")
def get_session_dialogue(session_id: str):
    """Get dialogue history for a session"""
    try:
        if session_id not in dialogue_engine.active_sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        
        session = dialogue_engine.active_sessions[session_id]
        
        return {
            "session_id": session_id,
            "dialogue_history": session["dialogue_history"],
            "total_exchanges": len(session["dialogue_history"]),
            "status": "success"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/scoring/criteria")
def get_scoring_criteria():
    """Get scoring criteria for moot court"""
    try:
        criteria = []
        for criterion, config in scorer.scoring_criteria.items():
            criteria.append({
                "criterion": criterion,
                "description": config["description"],
                "weight": config["weight"],
                "max_score": config["max_score"]
            })
        
        return {
            "scoring_criteria": criteria,
            "total_weight": sum(config["weight"] for config in scorer.scoring_criteria.values()),
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/leaderboard")
def get_moot_court_leaderboard(limit: int = 10):
    """Get moot court performance leaderboard"""
    # Mock leaderboard data
    leaderboard = [
        {"rank": 1, "user_id": 101, "name": "Sarah Johnson", "score": 92.5, "sessions": 15, "persona": "Constitutional Judge"},
        {"rank": 2, "user_id": 205, "name": "Michael Chen", "score": 88.3, "sessions": 12, "persona": "Commercial Judge"},
        {"rank": 3, "user_id": 89, "name": "Amina Bello", "score": 85.7, "sessions": 18, "persona": "Criminal Judge"},
        {"rank": 4, "user_id": 150, "name": "David Williams", "score": 82.1, "sessions": 10, "persona": "Family Judge"},
        {"rank": 5, "user_id": 73, "name": "Grace Thompson", "score": 79.8, "sessions": 14, "persona": "Appellate Judge"},
    ]
    
    return {
        "leaderboard": leaderboard[:limit],
        "total_participants": 156,
        "status": "success"
    }

@router.get("/stats")
def get_moot_court_stats():
    """Get moot court statistics"""
    stats = {
        "total_sessions": 1245,
        "active_sessions": 23,
        "average_score": 73.2,
        "popular_personas": [
            {"persona": "Constitutional Judge", "sessions": 342},
            {"persona": "Commercial Judge", "sessions": 289},
            {"persona": "Criminal Judge", "sessions": 234},
            {"persona": "Family Judge", "sessions": 189},
            {"persona": "Appellate Judge", "sessions": 156}
        ],
        "performance_levels": {
            "excellent": 0.15,
            "good": 0.35,
            "satisfactory": 0.30,
            "needs_improvement": 0.15,
            "unsatisfactory": 0.05
        },
        "average_session_duration": 45,  # minutes
        "completion_rate": 0.78
    }
    
    return {
        "stats": stats,
        "status": "success"
    }

@router.get("/case-types")
def get_case_types():
    """Get available case types for moot court"""
    case_types = [
        {"value": "constitutional", "label": "Constitutional Law"},
        {"value": "commercial", "label": "Commercial Law"},
        {"value": "criminal", "label": "Criminal Law"},
        {"value": "family", "label": "Family Law"},
        {"value": "appellate", "label": "Appellate Practice"},
        {"value": "civil", "label": "Civil Litigation"},
        {"value": "administrative", "label": "Administrative Law"}
    ]
    
    return {
        "case_types": case_types,
        "status": "success"
    }

@router.post("/practice/scenario")
def generate_practice_scenario(persona_type: JudgePersona, case_type: str):
    """Generate a practice scenario for moot court"""
    try:
        persona = JudgePersonaFactory.create_persona(persona_type)
        
        # Mock scenario generation - in real implementation, use AI
        scenarios = {
            "constitutional": {
                "title": "Freedom of Speech vs National Security",
                "facts": "A journalist published classified information revealing government misconduct. The government argues this compromises national security, while the journalist claims public interest protection.",
                "issues": ["Freedom of expression", "National security", "Public interest", "Media ethics"]
            },
            "commercial": {
                "title": "Breach of Shareholder Agreement",
                "facts": "A majority shareholder allegedly violated a shareholders' agreement by diverting business opportunities to a personal company. Minority shareholders seek remedies.",
                "issues": ["Fiduciary duty", "Shareholder rights", "Corporate governance", "Damages"]
            },
            "criminal": {
                "title": "Illegal Search and Seizure",
                "facts": "Police conducted a search without a warrant based on an anonymous tip. Evidence was found linking the defendant to a serious crime.",
                "issues": ["Fourth Amendment rights", "Exclusionary rule", "Probable cause", "Police procedures"]
            }
        }
        
        scenario = scenarios.get(case_type, scenarios["constitutional"])
        scenario["judge_persona"] = persona.name
        scenario["difficulty"] = "Intermediate"
        scenario["estimated_duration"] = 45
        
        return {
            "scenario": scenario,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
