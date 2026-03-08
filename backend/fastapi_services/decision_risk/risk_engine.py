from .precedent_risk import precedent_risk
from .evidence_risk import evidence_risk
from .procedural_risk import procedural_risk
from .scoring import aggregate_risk
from .explanation import explain_risk

def analyze_case_risk(case, similar_cases, evidence_reports):
    p = precedent_risk(similar_cases)
    e = evidence_risk(evidence_reports)
    pr = procedural_risk(case)

    total = aggregate_risk(
        p["score"],
        e["score"],
        pr["score"]
    )

    explanation = explain_risk(
        total,
        p["score"],
        e["score"],
        pr["score"]
    )

    return {
        "total_risk_score": total,
        "risk_level": explanation["risk_level"],
        "details": {
            "precedent": p,
            "evidence": e,
            "procedure": pr,
        },
        "explanation": explanation["summary"]
    }
