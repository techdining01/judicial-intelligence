"""
AI Moot Court Scoring Engine
Evaluates user performance in moot court simulations
"""

from typing import Dict, List, Any, Optional
from datetime import datetime
import json
import re

class MootCourtScorer:
    """Advanced scoring system for moot court performance"""
    
    def __init__(self):
        self.scoring_criteria = {
            "legal_accuracy": {
                "weight": 0.25,
                "description": "Correct application of legal principles",
                "max_score": 100
            },
            "argument_strength": {
                "weight": 0.25,
                "description": "Logical coherence and persuasiveness",
                "max_score": 100
            },
            "reasoning_quality": {
                "weight": 0.20,
                "description": "Depth of legal reasoning and analysis",
                "max_score": 100
            },
            "precedent_usage": {
                "weight": 0.15,
                "description": "Effective use of case law and precedent",
                "max_score": 100
            },
            "courtroom_demeanor": {
                "weight": 0.15,
                "description": "Professional conduct and communication",
                "max_score": 100
            }
        }
        
        self.legal_keywords = [
            "wherefore", "preliminary objection", "substantive issue",
            "jurisdiction", "standing", "cause of action", "prayer",
            "relief sought", "damages", "injunction", "specific performance",
            "declaratory relief", "costs", "interest"
        ]
        
        self.precedent_indicators = [
            "as held in", "as per the case of", "in the case of",
            "following the precedent", "according to", "relying on",
            "citing the case", "the court held in", "the decision in"
        ]
    
    def analyze_dialogue(self, dialogue_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze dialogue history for scoring"""
        analysis = {
            "legal_accuracy_score": 0.0,
            "argument_strength_score": 0.0,
            "reasoning_quality_score": 0.0,
            "precedent_usage_score": 0.0,
            "courtroom_demeanor_score": 0.0,
            "detailed_analysis": {}
        }
        
        if not dialogue_history:
            return analysis
        
        # Extract user arguments
        user_arguments = [
            entry["content"] for entry in dialogue_history
            if entry.get("speaker") == "Counsel"
        ]
        
        if not user_arguments:
            return analysis
        
        combined_text = " ".join(user_arguments).lower()
        
        # Legal Accuracy Analysis
        analysis["legal_accuracy_score"] = self._score_legal_accuracy(combined_text, user_arguments)
        
        # Argument Strength Analysis
        analysis["argument_strength_score"] = self._score_argument_strength(user_arguments)
        
        # Reasoning Quality Analysis
        analysis["reasoning_quality_score"] = self._score_reasoning_quality(user_arguments)
        
        # Precedent Usage Analysis
        analysis["precedent_usage_score"] = self._score_precedent_usage(combined_text)
        
        # Courtroom Demeanor Analysis
        analysis["courtroom_demeanor_score"] = self._score_courtroom_demeanor(user_arguments)
        
        # Detailed analysis
        analysis["detailed_analysis"] = {
            "word_count": len(combined_text.split()),
            "argument_count": len(user_arguments),
            "legal_terms_used": self._count_legal_terms(combined_text),
            "precedent_citations": self._count_precedent_citations(combined_text),
            "logical_connectors": self._count_logical_connectors(combined_text)
        }
        
        return analysis
    
    def _score_legal_accuracy(self, text: str, arguments: List[str]) -> float:
        """Score legal accuracy based on terminology and structure"""
        score = 0.0
        
        # Check for legal terminology
        legal_terms_count = self._count_legal_terms(text)
        max_legal_terms = 10
        legal_score = min(100, (legal_terms_count / max_legal_terms) * 100)
        
        # Check argument structure
        structure_score = self._score_argument_structure(arguments)
        
        # Check for legal reasoning patterns
        reasoning_score = self._score_legal_reasoning_patterns(text)
        
        score = (legal_score * 0.4 + structure_score * 0.3 + reasoning_score * 0.3)
        
        return round(score, 2)
    
    def _score_argument_strength(self, arguments: List[str]) -> float:
        """Score strength of legal arguments"""
        if not arguments:
            return 0.0
        
        scores = []
        
        for arg in arguments:
            arg_score = 0.0
            
            # Check for clear position
            if any(phrase in arg.lower() for phrase in ["i submit", "we submit", "our position is", "we contend"]):
                arg_score += 20
            
            # Check for supporting evidence
            if any(phrase in arg.lower() for phrase in ["evidence shows", "facts indicate", "record shows"]):
                arg_score += 20
            
            # Check for logical flow
            if self._has_logical_flow(arg):
                arg_score += 30
            
            # Check for conclusion
            if any(phrase in arg.lower() for phrase in ["therefore", "consequently", "accordingly", "thus"]):
                arg_score += 30
            
            scores.append(min(100, arg_score))
        
        return round(sum(scores) / len(scores), 2)
    
    def _score_reasoning_quality(self, arguments: List[str]) -> float:
        """Score quality of legal reasoning"""
        if not arguments:
            return 0.0
        
        total_score = 0.0
        
        for arg in arguments:
            arg_score = 0.0
            
            # Check for issue identification
            if any(phrase in arg.lower() for phrase in ["the issue is", "the question is", "we must determine"]):
                arg_score += 25
            
            # Check for rule statement
            if any(phrase in arg.lower() for phrase in ["the law provides", "the rule is", "as provided by"]):
                arg_score += 25
            
            # Check for application
            if any(phrase in arg.lower() for phrase in ["applying this to", "in this case", "the facts show"]):
                arg_score += 25
            
            # Check for conclusion
            if any(phrase in arg.lower() for phrase in ["we conclude", "it follows that", "the result is"]):
                arg_score += 25
            
            total_score += min(100, arg_score)
        
        return round(total_score / len(arguments), 2)
    
    def _score_precedent_usage(self, text: str) -> float:
        """Score usage of legal precedent"""
        score = 0.0
        
        # Count precedent citations
        citation_count = self._count_precedent_citations(text)
        
        # Base score for citations
        if citation_count >= 3:
            score += 50
        elif citation_count >= 2:
            score += 35
        elif citation_count >= 1:
            score += 20
        
        # Check for proper citation format
        if re.search(r'\[\d{4}\]\s*\d+\s*[A-Z]+', text):
            score += 25
        
        # Check for case name format
        if re.search(r'[A-Z]+\s+v\.\s+[A-Z]+', text):
            score += 25
        
        return min(100, score)
    
    def _score_courtroom_demeanor(self, arguments: List[str]) -> float:
        """Score courtroom demeanor and professionalism"""
        if not arguments:
            return 0.0
        
        score = 0.0
        
        for arg in arguments:
            arg_lower = arg.lower()
            
            # Check for respectful address
            if any(phrase in arg_lower for phrase in ["my lord", "your lordship", "with respect", "may it please"]):
                score += 25
            
            # Check for professional language
            if not any(phrase in arg_lower for phrase in ["i think", "i guess", "maybe"]):
                score += 25
            
            # Check for appropriate length (not too brief, not too verbose)
            word_count = len(arg.split())
            if 50 <= word_count <= 200:
                score += 25
            
            # Check for clarity
            if self._has_clear_structure(arg):
                score += 25
        
        return min(100, round(score / len(arguments), 2))
    
    def _count_legal_terms(self, text: str) -> int:
        """Count legal terminology used"""
        count = 0
        for term in self.legal_keywords:
            if term in text:
                count += 1
        return count
    
    def _count_precedent_citations(self, text: str) -> int:
        """Count precedent citations"""
        count = 0
        for indicator in self.precedent_indicators:
            if indicator in text:
                count += 1
        return count
    
    def _count_logical_connectors(self, text: str) -> int:
        """Count logical connectors"""
        connectors = ["therefore", "however", "furthermore", "moreover", "consequently", "accordingly", "thus", "hence"]
        count = 0
        for connector in connectors:
            if connector in text:
                count += 1
        return count
    
    def _has_logical_flow(self, text: str) -> bool:
        """Check if argument has logical flow"""
        connectors = ["because", "since", "therefore", "thus", "consequently", "accordingly"]
        return any(connector in text.lower() for connector in connectors)
    
    def _score_argument_structure(self, arguments: List[str]) -> float:
        """Score overall argument structure"""
        if not arguments:
            return 0.0
        
        # Check for introduction, body, conclusion
        has_intro = any(any(phrase in arg.lower() for phrase in ["introduction", "preliminary", "background"]) for arg in arguments)
        has_body = any(any(phrase in arg.lower() for phrase in ["substantive", "main issue", "core argument"]) for arg in arguments)
        has_conclusion = any(any(phrase in arg.lower() for phrase in ["conclusion", "in conclusion", "we pray"]) for arg in arguments)
        
        structure_score = 0
        if has_intro:
            structure_score += 33
        if has_body:
            structure_score += 33
        if has_conclusion:
            structure_score += 34
        
        return structure_score
    
    def _score_legal_reasoning_patterns(self, text: str) -> float:
        """Score legal reasoning patterns"""
        patterns = [
            "issue is", "rule provides", "applying", "concludes",
            "facts show", "evidence indicates", "court held",
            "precedent establishes", "statute provides"
        ]
        
        count = sum(1 for pattern in patterns if pattern in text)
        return min(100, (count / len(patterns)) * 100)
    
    def _has_clear_structure(self, text: str) -> bool:
        """Check if text has clear structure"""
        # Check for sentences that are not too long
        sentences = text.split('.')
        avg_sentence_length = sum(len(s.split()) for s in sentences) / len(sentences)
        
        # Good structure: average sentence length between 10-25 words
        return 10 <= avg_sentence_length <= 25
    
    def calculate_overall_score(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate overall moot court score"""
        overall_score = 0.0
        
        for criterion, config in self.scoring_criteria.items():
            score = analysis.get(f"{criterion}_score", 0.0)
            overall_score += score * config["weight"]
        
        # Determine performance level
        if overall_score >= 90:
            performance_level = "Excellent"
        elif overall_score >= 80:
            performance_level = "Good"
        elif overall_score >= 70:
            performance_level = "Satisfactory"
        elif overall_score >= 60:
            performance_level = "Needs Improvement"
        else:
            performance_level = "Unsatisfactory"
        
        # Generate feedback
        strengths = []
        areas_for_improvement = []
        
        for criterion, config in self.scoring_criteria.items():
            score = analysis.get(f"{criterion}_score", 0.0)
            if score >= 80:
                strengths.append(f"Strong {config['description']}")
            elif score < 60:
                areas_for_improvement.append(f"Improve {config['description']}")
        
        return {
            "overall_score": round(overall_score, 2),
            "performance_level": performance_level,
            "strengths": strengths,
            "areas_for_improvement": areas_for_improvement,
            "detailed_feedback": self._generate_detailed_feedback(analysis),
            "recommendations": self._generate_recommendations(analysis)
        }
    
    def _generate_detailed_feedback(self, analysis: Dict[str, Any]) -> str:
        """Generate detailed feedback based on analysis"""
        feedback_parts = []
        
        # Legal accuracy feedback
        legal_score = analysis.get("legal_accuracy_score", 0)
        if legal_score >= 80:
            feedback_parts.append("Excellent grasp of legal terminology and principles.")
        elif legal_score >= 60:
            feedback_parts.append("Good understanding of legal concepts with room for improvement.")
        else:
            feedback_parts.append("Need to strengthen understanding of fundamental legal principles.")
        
        # Argument strength feedback
        arg_score = analysis.get("argument_strength_score", 0)
        if arg_score >= 80:
            feedback_parts.append("Arguments are well-structured and persuasive.")
        elif arg_score >= 60:
            feedback_parts.append("Arguments show logical structure but could be more compelling.")
        else:
            feedback_parts.append("Arguments need better structure and supporting evidence.")
        
        # Precedent usage feedback
        precedent_score = analysis.get("precedent_usage_score", 0)
        if precedent_score >= 80:
            feedback_parts.append("Excellent use of case law and precedent.")
        elif precedent_score >= 60:
            feedback_parts.append("Good attempt at using precedent, but citations could be more precise.")
        else:
            feedback_parts.append("Need to incorporate more relevant case law and precedent.")
        
        return " ".join(feedback_parts)
    
    def _generate_recommendations(self, analysis: Dict[str, Any]) -> List[str]:
        """Generate specific recommendations for improvement"""
        recommendations = []
        
        detailed = analysis.get("detailed_analysis", {})
        
        if detailed.get("legal_terms_used", 0) < 5:
            recommendations.append("Study and incorporate more legal terminology in your arguments.")
        
        if detailed.get("precedent_citations", 0) < 2:
            recommendations.append("Research and cite relevant case law to support your arguments.")
        
        if detailed.get("logical_connectors", 0) < 3:
            recommendations.append("Use more logical connectors to improve argument flow.")
        
        if analysis.get("reasoning_quality_score", 0) < 70:
            recommendations.append("Practice IRAC (Issue-Rule-Application-Conclusion) method for legal reasoning.")
        
        if analysis.get("courtroom_demeanor_score", 0) < 70:
            recommendations.append("Focus on professional courtroom language and respectful address.")
        
        return recommendations
