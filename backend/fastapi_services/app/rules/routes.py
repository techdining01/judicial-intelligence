"""
Small claims and jurisdiction rules — all 36 states + FCT, Nigeria.
"""
from fastapi import APIRouter
from pydantic import BaseModel

from rules_engine.resolver import (
    validate_small_claim,
    resolve_rules,
    RULES,
)

router = APIRouter()


class SmallClaimsValidateRequest(BaseModel):
    state: str
    amount: float


@router.get("/jurisdictions")
def list_jurisdictions():
    """List all Nigerian jurisdictions with small claims rules (36 states + FCT)."""
    # RULES keys are normalized (e.g. akwa_ibom). Expose display names from rule.state.
    jurisdictions = []
    for rule in RULES.values():
        jurisdictions.append({
            "state": rule.state,
            "max_amount": rule.max_amount,
            "max_duration_days": rule.max_duration_days,
        })
    return {"jurisdictions": jurisdictions, "count": len(jurisdictions)}


@router.post("/small-claims/validate")
def validate_small_claim_endpoint(payload: SmallClaimsValidateRequest):
    """Check if a claim amount is within small claims limit for the given state."""
    valid, message = validate_small_claim(payload.state, payload.amount)
    rule = resolve_rules(payload.state)
    return {
        "valid": valid,
        "message": message,
        "state": payload.state,
        "amount": payload.amount,
        "limit": rule.max_amount if rule else None,
    }
