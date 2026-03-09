"""
Legal Rules Engine API Routes
Endpoints for accessing state-specific legal rules and procedures
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from ..rules.engine import LegalRulesEngine

router = APIRouter()

class MonetaryLimitRequest(BaseModel):
    state: str
    court_type: str
    grade: Optional[str] = None

class FilingProcedureRequest(BaseModel):
    state: str
    case_type: str

class HearingTimelineRequest(BaseModel):
    state: str
    case_category: str

class CourtDivisionRequest(BaseModel):
    state: str
    division: str

class FilingFeeRequest(BaseModel):
    state: str
    claim_amount: float

class TimeLimitRequest(BaseModel):
    state: str
    case_type: str
    incident_date: str

class ComprehensiveCaseRequest(BaseModel):
    state: str
    case_details: Dict[str, Any]

class StateComparisonRequest(BaseModel):
    states: List[str]
    rule_type: str
    params: Dict[str, Any]

@router.get("/states")
def get_supported_states():
    """Get list of supported states"""
    return {
        "supported_states": LegalRulesEngine.get_supported_states(),
        "status": "success"
    }

@router.post("/monetary-limit")
def get_monetary_limit(request: MonetaryLimitRequest):
    """Get monetary limit for specific state and court"""
    try:
        result = LegalRulesEngine.get_monetary_limit(
            request.state, 
            request.court_type, 
            request.grade
        )
        return {
            "state": request.state,
            "court_type": request.court_type,
            "grade": request.grade,
            "result": result,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/filing-procedure")
def get_filing_procedure(request: FilingProcedureRequest):
    """Get filing procedure for specific state and case type"""
    try:
        result = LegalRulesEngine.get_filing_procedure(request.state, request.case_type)
        return {
            "state": request.state,
            "case_type": request.case_type,
            "result": result,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/hearing-timeline")
def get_hearing_timeline(request: HearingTimelineRequest):
    """Get hearing timeline for specific state and case category"""
    try:
        result = LegalRulesEngine.get_hearing_timeline(request.state, request.case_category)
        return {
            "state": request.state,
            "case_category": request.case_category,
            "result": result,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/court-division")
def get_court_division(request: CourtDivisionRequest):
    """Get court division information for specific state"""
    try:
        result = LegalRulesEngine.get_court_division(request.state, request.division)
        return {
            "state": request.state,
            "division": request.division,
            "result": result,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/filing-fee")
def calculate_filing_fee(request: FilingFeeRequest):
    """Calculate filing fee for specific state"""
    try:
        result = LegalRulesEngine.calculate_filing_fee(request.state, request.claim_amount)
        return {
            "state": request.state,
            "claim_amount": request.claim_amount,
            "result": result,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/time-limit")
def check_time_limit(request: TimeLimitRequest):
    """Check if case is within statutory time limit"""
    try:
        result = LegalRulesEngine.check_time_limit(
            request.state, 
            request.case_type, 
            request.incident_date
        )
        return {
            "state": request.state,
            "case_type": request.case_type,
            "incident_date": request.incident_date,
            "result": result,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/comprehensive-case-info")
def get_comprehensive_case_info(request: ComprehensiveCaseRequest):
    """Get comprehensive information for a case"""
    try:
        result = LegalRulesEngine.get_comprehensive_case_info(
            request.state, 
            request.case_details
        )
        return {
            "state": request.state,
            "case_details": request.case_details,
            "result": result,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/compare-states")
def compare_state_rules(request: StateComparisonRequest):
    """Compare specific rules across multiple states"""
    try:
        result = LegalRulesEngine.compare_state_rules(
            request.states, 
            request.rule_type, 
            **request.params
        )
        return {
            "states": request.states,
            "rule_type": request.rule_type,
            "params": request.params,
            "result": result,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/state/{state}/overview")
def get_state_overview(state: str):
    """Get overview of all rules for a state"""
    try:
        rules = LegalRulesEngine.get_state_rules(state)
        
        overview = {
            "state": state,
            "monetary_limits": rules.MONETARY_LIMITS,
            "filing_procedures": rules.FILING_PROCEDURES,
            "hearing_timelines": rules.HEARING_TIMELINES,
            "court_divisions": rules.COURT_DIVISIONS
        }
        
        return {
            "overview": overview,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
