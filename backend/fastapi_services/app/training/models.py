"""
Legal Training System Models
Simulation scenarios, sessions, and messages for legal training
"""

from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime
from enum import Enum

class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class TrainingCategory(str, Enum):
    CIVIL_LITIGATION = "civil_litigation"
    CRIMINAL_PROCEDURE = "criminal_procedure"
    FAMILY_LAW = "family_law"
    COMMERCIAL_LAW = "commercial_law"
    CONSTITUTIONAL_LAW = "constitutional_law"
    APPELLATE_PRACTICE = "appellate_practice"

class SimulationScenario(BaseModel):
    """Model for legal training simulation scenarios"""
    id: Optional[int] = None
    title: str
    description: str
    category: TrainingCategory
    difficulty: DifficultyLevel
    estimated_duration: int  # in minutes
    learning_objectives: List[str]
    case_background: str
    relevant_law: List[str]
    key_documents: List[str]
    participant_roles: List[str]
    evaluation_criteria: List[str]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class SimulationSession(BaseModel):
    """Model for ongoing simulation sessions"""
    id: Optional[int] = None
    scenario_id: int
    user_id: int
    status: str  # 'active', 'completed', 'paused', 'abandoned'
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    current_phase: str
    participant_role: str
    score: Optional[float] = None
    feedback: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class SimulationMessage(BaseModel):
    """Model for messages within simulation sessions"""
    id: Optional[int] = None
    session_id: int
    sender_type: str  # 'user', 'ai_judge', 'ai_opposing_counsel', 'system'
    sender_name: str
    message_content: str
    message_type: str  # 'argument', 'question', 'objection', 'ruling', 'feedback'
    timestamp: Optional[datetime] = None
    metadata: Optional[Dict[str, Any]] = None

class TrainingProgress(BaseModel):
    """Model for user training progress"""
    user_id: int
    total_sessions: int
    completed_sessions: int
    average_score: float
    categories_completed: List[TrainingCategory]
    current_level: DifficultyLevel
    achievements: List[str]
    next_recommended_scenario: Optional[int] = None
    last_activity: Optional[datetime] = None

class EvaluationResult(BaseModel):
    """Model for session evaluation results"""
    session_id: int
    user_id: int
    legal_accuracy: float  # 0-100
    argument_strength: float  # 0-100
    reasoning_quality: float  # 0-100
    precedent_usage: float  # 0-100
    procedural_compliance: float  # 0-100
    overall_score: float  # 0-100
    strengths: List[str]
    areas_for_improvement: List[str]
    detailed_feedback: str
    evaluator_type: str  # 'ai', 'human', 'peer'
    created_at: Optional[datetime] = None

class TrainingResource(BaseModel):
    """Model for training materials and resources"""
    id: Optional[int] = None
    title: str
    description: str
    resource_type: str  # 'document', 'video', 'case_law', 'statute', 'guide'
    category: TrainingCategory
    difficulty: DifficultyLevel
    content_url: str
    download_url: Optional[str] = None
    tags: List[str]
    estimated_read_time: Optional[int] = None  # in minutes
    prerequisites: List[str]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class UserAchievement(BaseModel):
    """Model for user achievements and badges"""
    user_id: int
    achievement_id: str
    achievement_name: str
    description: str
    achievement_type: str  # 'milestone', 'skill', 'streak', 'completion'
    earned_at: Optional[datetime] = None
    metadata: Optional[Dict[str, Any]] = None

class SimulationTemplate(BaseModel):
    """Template for creating new simulation scenarios"""
    name: str
    description: str
    category: TrainingCategory
    structure: Dict[str, Any]
    phases: List[Dict[str, Any]]
    evaluation_template: Dict[str, Any]
    ai_prompts: Dict[str, str]
    is_public: bool = True
    created_by: Optional[int] = None
