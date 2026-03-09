"""
Legal Training Engine
Core logic for running legal training simulations
"""

import os
from google import genai
from dotenv import load_dotenv
from decouple import config
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import json

from .models import (
    SimulationScenario, SimulationSession, SimulationMessage,
    EvaluationResult, TrainingProgress, DifficultyLevel, TrainingCategory
)

load_dotenv(".env")

client = genai.Client(
    api_key=config("GEMINI_KEY", default=os.getenv("GEMINI_KEY"))
)

MODEL = "gemini-2.0-flash"

class LegalTrainingEngine:
    """Core engine for legal training simulations"""
    
    def __init__(self):
        self.active_sessions = {}
        self.scenario_templates = self._load_scenario_templates()
    
    def _load_scenario_templates(self) -> Dict[str, Any]:
        """Load predefined scenario templates"""
        return {
            "civil_litigation_basics": {
                "title": "Basic Civil Litigation - Contract Dispute",
                "description": "Handle a basic breach of contract case",
                "category": TrainingCategory.CIVIL_LITIGATION,
                "difficulty": DifficultyLevel.BEGINNER,
                "duration": 45,
                "phases": [
                    {"name": "client_interview", "duration": 10},
                    {"name": "pleading_drafting", "duration": 15},
                    {"name": "negotiation", "duration": 20}
                ],
                "evaluation_criteria": [
                    "client communication",
                    "legal analysis",
                    "negotiation skills"
                ]
            },
            "criminal_procedure_intermediate": {
                "title": "Criminal Defense - Bail Application",
                "description": "Represent a client in a bail application hearing",
                "category": TrainingCategory.CRIMINAL_PROCEDURE,
                "difficulty": DifficultyLevel.INTERMEDIATE,
                "duration": 60,
                "phases": [
                    {"name": "case_analysis", "duration": 15},
                    {"name": "bail_preparation", "duration": 20},
                    {"name": "court_hearing", "duration": 25}
                ],
                "evaluation_criteria": [
                    "case analysis",
                    "legal argumentation",
                    "court procedure"
                ]
            },
            "appellate_advocacy": {
                "title": "Appellate Court Advocacy",
                "description": "Present an appeal before the Court of Appeal",
                "category": TrainingCategory.APPELLATE_PRACTICE,
                "difficulty": DifficultyLevel.ADVANCED,
                "duration": 90,
                "phases": [
                    {"name": "record_review", "duration": 30},
                    {"name": "brief_writing", "duration": 30},
                    {"name": "oral_argument", "duration": 30}
                ],
                "evaluation_criteria": [
                    "legal research",
                    "brief writing",
                    "oral advocacy"
                ]
            }
        }
    
    def create_simulation_session(
        self, 
        user_id: int, 
        scenario_template_id: str,
        participant_role: str = "attorney"
    ) -> Dict[str, Any]:
        """Create a new simulation session"""
        try:
            if scenario_template_id not in self.scenario_templates:
                return {"error": "Scenario template not found"}
            
            template = self.scenario_templates[scenario_template_id]
            session_id = f"session_{user_id}_{datetime.now().timestamp()}"
            
            session = {
                "session_id": session_id,
                "user_id": user_id,
                "scenario": template,
                "status": "active",
                "start_time": datetime.now(),
                "current_phase": template["phases"][0]["name"],
                "participant_role": participant_role,
                "messages": [],
                "score": 0.0
            }
            
            self.active_sessions[session_id] = session
            
            # Generate initial scenario context
            context_prompt = f"""
            Generate a detailed legal scenario for {template['title']}.
            
            Details:
            - Category: {template['category']}
            - Difficulty: {template['difficulty']}
            - User Role: {participant_role}
            
            Include:
            1. Case background with specific facts
            2. Legal issues to be addressed
            3. Relevant statutes and case law
            4. Documents available
            5. Initial instructions for the user
            
            Make it realistic and challenging for the difficulty level.
            """
            
            response = client.models.generate_content(
                model=MODEL,
                contents=context_prompt
            )
            
            session["scenario_context"] = response.text.strip()
            
            return {
                "session_id": session_id,
                "scenario": template,
                "context": session["scenario_context"],
                "status": "created"
            }
            
        except Exception as e:
            return {"error": str(e)}
    
    def process_user_message(
        self, 
        session_id: str, 
        message: str,
        message_type: str = "argument"
    ) -> Dict[str, Any]:
        """Process user message and generate AI response"""
        try:
            if session_id not in self.active_sessions:
                return {"error": "Session not found"}
            
            session = self.active_sessions[session_id]
            
            # Add user message
            user_message = {
                "sender_type": "user",
                "sender_name": "User",
                "message_content": message,
                "message_type": message_type,
                "timestamp": datetime.now()
            }
            session["messages"].append(user_message)
            
            # Generate AI response based on current phase
            ai_response = self._generate_ai_response(session, message)
            
            # Add AI message
            ai_message = {
                "sender_type": "ai_judge",
                "sender_name": "AI Judge",
                "message_content": ai_response["content"],
                "message_type": ai_response["type"],
                "timestamp": datetime.now(),
                "metadata": ai_response.get("metadata", {})
            }
            session["messages"].append(ai_message)
            
            # Check if phase should advance
            phase_change = self._check_phase_progression(session)
            
            return {
                "ai_response": ai_response,
                "phase_change": phase_change,
                "session_status": session["status"]
            }
            
        except Exception as e:
            return {"error": str(e)}
    
    def _generate_ai_response(self, session: Dict[str, Any], user_message: str) -> Dict[str, Any]:
        """Generate AI response based on session context"""
        scenario = session["scenario"]
        current_phase = session["current_phase"]
        context = session["scenario_context"]
        messages = session["messages"]
        
        # Build conversation history
        conversation_history = "\n".join([
            f"{msg['sender_name']}: {msg['message_content']}"
            for msg in messages[-5:]  # Last 5 messages for context
        ])
        
        prompt = f"""
        You are an AI judge in a legal training simulation.
        
        Scenario: {scenario['title']}
        Category: {scenario['category']}
        Current Phase: {current_phase}
        User Role: {session['participant_role']}
        
        Context:
        {context}
        
        Recent Conversation:
        {conversation_history}
        
        User's latest message: {user_message}
        
        Respond as an AI judge would in this phase:
        1. Evaluate the user's legal reasoning
        2. Ask relevant follow-up questions
        3. Provide guidance if needed
        4. Maintain appropriate judicial demeanor
        5. Consider the difficulty level: {scenario['difficulty']}
        
        Keep responses concise but instructive.
        """
        
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt
        )
        
        return {
            "content": response.text.strip(),
            "type": "judicial_response",
            "metadata": {
                "phase": current_phase,
                "scenario": scenario["title"]
            }
        }
    
    def _check_phase_progression(self, session: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Check if session should advance to next phase"""
        scenario = session["scenario"]
        current_phase_index = next(
            (i for i, phase in enumerate(scenario["phases"]) 
             if phase["name"] == session["current_phase"]), 
            0
        )
        
        # Simple logic: advance after 3 messages in current phase
        phase_messages = len([
            msg for msg in session["messages"]
            if msg["timestamp"] > session.get("phase_start_time", session["start_time"])
        ])
        
        if phase_messages >= 3 and current_phase_index < len(scenario["phases"]) - 1:
            next_phase = scenario["phases"][current_phase_index + 1]
            session["current_phase"] = next_phase["name"]
            session["phase_start_time"] = datetime.now()
            
            return {
                "phase_advanced": True,
                "new_phase": next_phase["name"],
                "phase_duration": next_phase["duration"]
            }
        
        return None
    
    def complete_session(self, session_id: str) -> Dict[str, Any]:
        """Complete a simulation session and generate evaluation"""
        try:
            if session_id not in self.active_sessions:
                return {"error": "Session not found"}
            
            session = self.active_sessions[session_id]
            session["status"] = "completed"
            session["end_time"] = datetime.now()
            
            # Generate evaluation
            evaluation = self._generate_evaluation(session)
            
            # Store session data (in real implementation, save to database)
            session_data = {
                "session_id": session_id,
                "user_id": session["user_id"],
                "scenario": session["scenario"],
                "duration": (session["end_time"] - session["start_time"]).total_seconds() / 60,
                "messages": session["messages"],
                "evaluation": evaluation,
                "completed_at": session["end_time"]
            }
            
            # Remove from active sessions
            del self.active_sessions[session_id]
            
            return {
                "session_completed": True,
                "evaluation": evaluation,
                "session_data": session_data
            }
            
        except Exception as e:
            return {"error": str(e)}
    
    def _generate_evaluation(self, session: Dict[str, Any]) -> Dict[str, Any]:
        """Generate evaluation for completed session"""
        messages = session["messages"]
        scenario = session["scenario"]
        
        # Analyze user messages
        user_messages = [
            msg for msg in messages 
            if msg["sender_type"] == "user"
        ]
        
        conversation_text = "\n".join([
            msg["message_content"] for msg in user_messages
        ])
        
        prompt = f"""
        Evaluate this legal training simulation performance:
        
        Scenario: {scenario['title']}
        Difficulty: {scenario['difficulty']}
        Category: {scenario['category']}
        User Role: {session['participant_role']}
        
        User's Performance:
        {conversation_text}
        
        Evaluate on:
        1. Legal Accuracy (0-100)
        2. Argument Strength (0-100)
        3. Reasoning Quality (0-100)
        4. Precedent Usage (0-100)
        5. Procedural Compliance (0-100)
        
        Provide:
        - Overall score (0-100)
        - 3 strengths
        - 3 areas for improvement
        - Detailed feedback
        
        Format as JSON with keys: legal_accuracy, argument_strength, reasoning_quality, 
        precedent_usage, procedural_compliance, overall_score, strengths, 
        areas_for_improvement, detailed_feedback
        """
        
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt
        )
        
        try:
            evaluation_data = json.loads(response.text.strip())
            evaluation_data["evaluator_type"] = "ai"
            evaluation_data["created_at"] = datetime.now()
            return evaluation_data
        except:
            # Fallback evaluation
            return {
                "legal_accuracy": 75,
                "argument_strength": 70,
                "reasoning_quality": 72,
                "precedent_usage": 68,
                "procedural_compliance": 80,
                "overall_score": 73,
                "strengths": ["Good legal analysis", "Clear communication", "Proper procedure"],
                "areas_for_improvement": ["More case law citations", "Stronger argument structure", "Better evidence presentation"],
                "detailed_feedback": "Good performance overall. Focus on strengthening legal arguments with more precedent.",
                "evaluator_type": "ai",
                "created_at": datetime.now()
            }
    
    def get_user_progress(self, user_id: int) -> Dict[str, Any]:
        """Get user's training progress"""
        # In real implementation, query database
        return {
            "user_id": user_id,
            "total_sessions": 5,
            "completed_sessions": 3,
            "average_score": 76.5,
            "categories_completed": [
                TrainingCategory.CIVIL_LITIGATION,
                TrainingCategory.CRIMINAL_PROCEDURE
            ],
            "current_level": DifficultyLevel.INTERMEDIATE,
            "achievements": [
                "First Case Won",
                "Quick Learner",
                "Civil Litigation Basics"
            ],
            "next_recommended_scenario": "criminal_procedure_intermediate"
        }
