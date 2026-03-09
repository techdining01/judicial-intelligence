"""
Legal Rules Engine
Coordinates and provides access to state-specific legal rules and procedures
"""

from typing import Dict, Any, List
from .lagos import LagosRules
from .kano import KanoRules
from .rivers import RiversRules

class LegalRulesEngine:
    """Main rules engine that coordinates all state rules"""
    
    # Mapping of states to their rule classes
    STATE_RULES = {
        "lagos": LagosRules,
        "kano": KanoRules,
        "rivers": RiversRules,
        "abuja": LagosRules,  # FCT uses similar rules to Lagos
        "federal": LagosRules,  # Federal courts use standard rules
    }
    
    @classmethod
    def get_supported_states(cls) -> List[str]:
        """Get list of supported states"""
        return list(cls.STATE_RULES.keys())
    
    @classmethod
    def get_state_rules(cls, state: str):
        """Get rules class for a specific state"""
        state_lower = state.lower()
        if state_lower not in cls.STATE_RULES:
            raise ValueError(f"State '{state}' not supported. Supported states: {cls.get_supported_states()}")
        return cls.STATE_RULES[state_lower]
    
    @classmethod
    def get_monetary_limit(cls, state: str, court_type: str, grade: str = None, **kwargs) -> Dict[str, Any]:
        """Get monetary limit for specific state and court"""
        try:
            rules = cls.get_state_rules(state)
            return rules.get_monetary_limit(court_type, grade, **kwargs)
        except Exception as e:
            return {"error": str(e)}
    
    @classmethod
    def get_filing_procedure(cls, state: str, case_type: str) -> Dict[str, Any]:
        """Get filing procedure for specific state and case type"""
        try:
            rules = cls.get_state_rules(state)
            return rules.get_filing_procedure(case_type)
        except Exception as e:
            return {"error": str(e)}
    
    @classmethod
    def get_hearing_timeline(cls, state: str, case_category: str) -> Dict[str, Any]:
        """Get hearing timeline for specific state and case category"""
        try:
            rules = cls.get_state_rules(state)
            return rules.get_hearing_timeline(case_category)
        except Exception as e:
            return {"error": str(e)}
    
    @classmethod
    def get_court_division(cls, state: str, division: str) -> Dict[str, Any]:
        """Get court division information for specific state"""
        try:
            rules = cls.get_state_rules(state)
            return rules.get_court_division(division)
        except Exception as e:
            return {"error": str(e)}
    
    @classmethod
    def calculate_filing_fee(cls, state: str, claim_amount: float) -> Dict[str, Any]:
        """Calculate filing fee for specific state"""
        try:
            rules = cls.get_state_rules(state)
            return rules.calculate_filing_fee(claim_amount)
        except Exception as e:
            return {"error": str(e)}
    
    @classmethod
    def check_time_limit(cls, state: str, case_type: str, incident_date: str) -> Dict[str, Any]:
        """Check if case is within statutory time limit for specific state"""
        try:
            rules = cls.get_state_rules(state)
            return rules.check_time_limit(case_type, incident_date)
        except Exception as e:
            return {"error": str(e)}
    
    @classmethod
    def get_comprehensive_case_info(cls, state: str, case_details: Dict[str, Any]) -> Dict[str, Any]:
        """Get comprehensive information for a case based on state and case details"""
        try:
            rules = cls.get_state_rules(state)
            
            # Extract case details
            court_type = case_details.get("court_type", "")
            grade = case_details.get("grade")
            case_type = case_details.get("case_type", "")
            case_category = case_details.get("case_category", "")
            division = case_details.get("division", "")
            claim_amount = case_details.get("claim_amount", 0)
            incident_date = case_details.get("incident_date", "")
            
            result = {
                "state": state,
                "case_details": case_details,
                "information": {}
            }
            
            # Get monetary limit
            if court_type:
                result["information"]["monetary_limit"] = rules.get_monetary_limit(court_type, grade)
            
            # Get filing procedure
            if case_type:
                result["information"]["filing_procedure"] = rules.get_filing_procedure(case_type)
            
            # Get hearing timeline
            if case_category:
                result["information"]["hearing_timeline"] = rules.get_hearing_timeline(case_category)
            
            # Get court division
            if division:
                result["information"]["court_division"] = rules.get_court_division(division)
            
            # Calculate filing fee
            if claim_amount > 0:
                result["information"]["filing_fee"] = rules.calculate_filing_fee(claim_amount)
            
            # Check time limit
            if incident_date and case_type:
                result["information"]["time_limit_check"] = rules.check_time_limit(case_type, incident_date)
            
            return result
            
        except Exception as e:
            return {"error": str(e)}
    
    @classmethod
    def compare_state_rules(cls, states: List[str], rule_type: str, **params) -> Dict[str, Any]:
        """Compare specific rules across multiple states"""
        try:
            comparison = {
                "rule_type": rule_type,
                "states": {},
                "comparison_result": {}
            }
            
            for state in states:
                if state.lower() in cls.STATE_RULES:
                    rules = cls.get_state_rules(state)
                    
                    if rule_type == "monetary_limit":
                        comparison["states"][state] = rules.get_monetary_limit(
                            params.get("court_type", ""), 
                            params.get("grade")
                        )
                    elif rule_type == "filing_fee":
                        comparison["states"][state] = rules.calculate_filing_fee(
                            params.get("claim_amount", 0)
                        )
                    elif rule_type == "hearing_timeline":
                        comparison["states"][state] = rules.get_hearing_timeline(
                            params.get("case_category", "")
                        )
                    else:
                        comparison["states"][state] = {"error": "Unknown rule type"}
                else:
                    comparison["states"][state] = {"error": "State not supported"}
            
            return comparison
            
        except Exception as e:
            return {"error": str(e)}
