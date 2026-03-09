"""
AI Moot Court Judge Personas
Different judge personalities for moot court simulations
"""

from typing import Dict, List, Any
from enum import Enum
import json

class JudgePersona(str, Enum):
    CONSTITUTIONAL = "constitutional_judge"
    COMMERCIAL = "commercial_judge"
    CRIMINAL = "criminal_judge"
    FAMILY = "family_judge"
    APPELLATE = "appellate_judge"

class JudgePersonality:
    """Base class for judge personalities"""
    
    def __init__(self, name: str, specialization: List[str], temperament: str):
        self.name = name
        self.specialization = specialization
        self.temperament = temperament
        self.questioning_style = ""
        self.decision_factors = []
        self.common_phrases = []
        self.biases = []
        self.expertise_level = ""
    
    def get_prompt_prefix(self) -> str:
        """Get the prompt prefix for this judge persona"""
        return f"""
        You are Judge {self.name}, a {self.temperament} judge specializing in {', '.join(self.specialization)}.
        
        Your personality traits:
        - Questioning style: {self.questioning_style}
        - Decision factors: {', '.join(self.decision_factors)}
        - Expertise level: {self.expertise_level}
        - Common phrases: {', '.join(self.common_phrases)}
        
        Your biases (be aware of these but remain impartial):
        {', '.join(self.biases)}
        
        """

class ConstitutionalJudge(JudgePersonality):
    """Judge specializing in constitutional law"""
    
    def __init__(self):
        super().__init__(
            name="Justice Amina Bello",
            specialization=["Constitutional Law", "Human Rights", "Administrative Law"],
            temperament="Scholarly and Methodical"
        )
        self.questioning_style = "Socratic and theoretical, focuses on constitutional principles"
        self.decision_factors = [
            "Constitutional compliance",
            "Precedent consistency",
            "Public policy implications",
            "Fundamental rights protection"
        ]
        self.common_phrases = [
            "Let's consider the constitutional implications...",
            "What does the precedent say about this?",
            "How does this affect public policy?",
            "The fundamental rights at stake are..."
        ]
        self.biases = [
            "Strong preference for individual rights",
            "Tends to favor expansive interpretation of constitution",
            "Cautious about executive overreach"
        ]
        self.expertise_level = "Very High - 25+ years on constitutional bench"

class CommercialJudge(JudgePersonality):
    """Judge specializing in commercial and corporate law"""
    
    def __init__(self):
        super().__init__(
            name="Justice Richard Okonkwo",
            specialization=["Commercial Law", "Company Law", "Banking", "Insurance"],
            temperament="Pragmatic and Business-oriented"
        )
        self.questioning_style = "Direct and practical, focuses on commercial realities"
        self.decision_factors = [
            "Commercial reasonableness",
            "Market practices",
            "Economic impact",
            "Contractual clarity"
        ]
        self.common_phrases = [
            "What are the commercial implications?",
            "Let's be practical about this...",
            "How does this affect business operations?",
            "The market practice suggests..."
        ]
        self.biases = [
            "Pro-business orientation",
            "Prefers efficient resolution",
            "Values contractual certainty"
        ]
        self.expertise_level = "High - 20+ years in commercial litigation"

class CriminalJudge(JudgePersonality):
    """Judge specializing in criminal law"""
    
    def __init__(self):
        super().__init__(
            name="Justice Ibrahim Musa",
            specialization=["Criminal Law", "Evidence", "Procedural Law"],
            temperament="Strict and Procedural"
        )
        self.questioning_style = "Methodical and evidence-focused, emphasizes procedure"
        self.decision_factors = [
            "Evidence quality",
            "Procedural compliance",
            "Legal precedent",
            "Public safety considerations"
        ]
        self.common_phrases = [
            "What's the evidentiary basis for this?",
            "Let's check the procedure...",
            "Is this admissible evidence?",
            "The precedent requires us to..."
        ]
        self.biases = [
            "Strong law enforcement orientation",
            "Emphasis on victims' rights",
            "Strict procedural compliance"
        ]
        self.expertise_level = "Very High - Former prosecutor, 30+ years criminal bench"

class FamilyJudge(JudgePersonality):
    """Judge specializing in family law"""
    
    def __init__(self):
        super().__init__(
            name="Justice Grace Thompson",
            specialization=["Family Law", "Child Rights", "Matrimonial Property"],
            temperament="Compassionate and Child-focused"
        )
        self.questioning_style = "Empathetic but firm, focuses on welfare"
        self.decision_factors = [
            "Child's best interests",
            "Family welfare",
            "Emotional impact",
            "Practical arrangements"
        ]
        self.common_phrases = [
            "How does this affect the children?",
            "Let's consider the family dynamics...",
            "The child's welfare is paramount...",
            "What's in the best interest of the family?"
        ]
        self.biases = [
            "Child welfare priority",
            "Preference for amicable resolution",
            "Gender equality emphasis"
        ]
        self.expertise_level = "High - 15+ years family law specialist"

class AppellateJudge(JudgePersonality):
    """Judge specializing in appellate matters"""
    
    def __init__(self):
        super().__init__(
            name="Justice Patricia Adeyemi",
            specialization=["Appellate Practice", "Legal Interpretation", "Jurisprudence"],
            temperament="Analytical and Academic"
        )
        self.questioning_style = "Hypothetical and precedent-focused, tests legal reasoning"
        self.decision_factors = [
            "Legal reasoning quality",
            "Precedent analysis",
            "Jurisprudential consistency",
            "Policy considerations"
        ]
        self.common_phrases = [
            "What if we consider this hypothetical...",
            "How does this align with established precedent?",
            "The legal reasoning suggests...",
            "Let's analyze the jurisprudence..."
        ]
        self.biases = [
            "Strong precedent orientation",
            "Academic approach to law",
            "Preference for well-reasoned decisions"
        ]
        self.expertise_level = "Very High - Former law professor, 35+ years appellate experience"

class JudgePersonaFactory:
    """Factory for creating judge personas"""
    
    PERSONAS = {
        JudgePersona.CONSTITUTIONAL: ConstitutionalJudge,
        JudgePersona.COMMERCIAL: CommercialJudge,
        JudgePersona.CRIMINAL: CriminalJudge,
        JudgePersona.FAMILY: FamilyJudge,
        JudgePersona.APPELLATE: AppellateJudge
    }
    
    @classmethod
    def create_persona(cls, persona_type: JudgePersona) -> JudgePersonality:
        """Create a judge persona instance"""
        if persona_type not in cls.PERSONAS:
            raise ValueError(f"Persona type {persona_type} not supported")
        
        return cls.PERSONAS[persona_type]()
    
    @classmethod
    def get_available_personas(cls) -> List[Dict[str, Any]]:
        """Get list of available judge personas"""
        personas = []
        for persona_type, persona_class in cls.PERSONAS.items():
            persona = persona_class()
            personas.append({
                "type": persona_type.value,
                "name": persona.name,
                "specialization": persona.specialization,
                "temperament": persona.temperament,
                "expertise_level": persona.expertise_level
            })
        
        return personas
    
    @classmethod
    def get_persona_prompt(cls, persona_type: JudgePersona) -> str:
        """Get the full prompt for a specific persona"""
        persona = cls.create_persona(persona_type)
        return persona.get_prompt_prefix()

class CourtroomDialogueEngine:
    """Engine for managing courtroom dialogue in moot court simulations"""
    
    def __init__(self):
        self.persona_factory = JudgePersonaFactory()
        self.active_sessions = {}
    
    def start_moot_session(
        self, 
        session_id: str, 
        persona_type: JudgePersona,
        case_type: str,
        case_facts: str
    ) -> Dict[str, Any]:
        """Start a new moot court session"""
        try:
            persona = self.persona_factory.create_persona(persona_type)
            
            session = {
                "session_id": session_id,
                "judge_persona": persona,
                "case_type": case_type,
                "case_facts": case_facts,
                "dialogue_history": [],
                "current_phase": "opening_statements",
                "score": 0.0,
                "feedback": []
            }
            
            self.active_sessions[session_id] = session
            
            # Generate opening statement from judge
            opening_prompt = f"""
            {persona.get_prompt_prefix()}
            
            Case Type: {case_type}
            Case Facts: {case_facts}
            
            You are presiding over this moot court session. Begin with:
            1. Introduction of yourself and the court
            2. Statement of the issues to be addressed
            3. Instructions for counsel
            4. Any preliminary observations
            
            Be authentic to your judicial persona.
            """
            
            return {
                "session_started": True,
                "judge_persona": persona_type.value,
                "opening_statement": opening_prompt,
                "session_id": session_id
            }
            
        except Exception as e:
            return {"error": str(e)}
    
    def process_argument(
        self, 
        session_id: str, 
        user_argument: str,
        argument_type: str = "legal_argument"
    ) -> Dict[str, Any]:
        """Process user argument and generate judge response"""
        try:
            if session_id not in self.active_sessions:
                return {"error": "Session not found"}
            
            session = self.active_sessions[session_id]
            persona = session["judge_persona"]
            
            # Add user argument to history
            session["dialogue_history"].append({
                "speaker": "Counsel",
                "content": user_argument,
                "type": argument_type,
                "timestamp": datetime.now()
            })
            
            # Generate judge response
            judge_prompt = f"""
            {persona.get_prompt_prefix()}
            
            Case Type: {session['case_type']}
            Case Facts: {session['case_facts']}
            Current Phase: {session['current_phase']}
            
            Recent Dialogue:
            {self._format_dialogue_history(session['dialogue_history'][-3:])}
            
            User's Argument: {user_argument}
            
            Respond as Judge {persona.name} would:
            1. Evaluate the legal argument
            2. Ask relevant questions
            3. Provide guidance or challenge assumptions
            4. Maintain your judicial persona
            5. Consider your decision factors and biases
            
            Keep responses concise but judicial.
            """
            
            return {
                "judge_response": judge_prompt,
                "session_phase": session["current_phase"],
                "dialogue_count": len(session["dialogue_history"])
            }
            
        except Exception as e:
            return {"error": str(e)}
    
    def _format_dialogue_history(self, history: List[Dict[str, Any]]) -> str:
        """Format dialogue history for prompt"""
        formatted = []
        for entry in history:
            formatted.append(f"{entry['speaker']}: {entry['content']}")
        return "\n".join(formatted)
    
    def evaluate_performance(self, session_id: str) -> Dict[str, Any]:
        """Evaluate user performance in moot court session"""
        try:
            if session_id not in self.active_sessions:
                return {"error": "Session not found"}
            
            session = self.active_sessions[session_id]
            persona = session["judge_persona"]
            
            # Analyze dialogue for evaluation criteria
            evaluation = {
                "legal_accuracy": self._evaluate_legal_accuracy(session),
                "argument_strength": self._evaluate_argument_strength(session),
                "reasoning_quality": self._evaluate_reasoning_quality(session),
                "precedent_usage": self._evaluate_precedent_usage(session),
                "courtroom_demeanor": self._evaluate_demeanor(session),
                "overall_score": 0.0,
                "strengths": [],
                "areas_for_improvement": [],
                "judge_feedback": ""
            }
            
            # Calculate overall score
            evaluation["overall_score"] = (
                evaluation["legal_accuracy"] * 0.25 +
                evaluation["argument_strength"] * 0.25 +
                evaluation["reasoning_quality"] * 0.20 +
                evaluation["precedent_usage"] * 0.15 +
                evaluation["courtroom_demeanor"] * 0.15
            )
            
            return evaluation
            
        except Exception as e:
            return {"error": str(e)}
    
    def _evaluate_legal_accuracy(self, session: Dict[str, Any]) -> float:
        """Evaluate legal accuracy of arguments"""
        # Simplified evaluation - in real implementation, use AI analysis
        return 75.0
    
    def _evaluate_argument_strength(self, session: Dict[str, Any]) -> float:
        """Evaluate strength of legal arguments"""
        return 70.0
    
    def _evaluate_reasoning_quality(self, session: Dict[str, Any]) -> float:
        """Evaluate quality of legal reasoning"""
        return 72.0
    
    def _evaluate_precedent_usage(self, session: Dict[str, Any]) -> float:
        """Evaluate usage of legal precedent"""
        return 68.0
    
    def _evaluate_demeanor(self, session: Dict[str, Any]) -> float:
        """Evaluate courtroom demeanor"""
        return 80.0
