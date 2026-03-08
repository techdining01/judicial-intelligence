def explain_risk(total, precedent, evidence, procedure):
    explanation = []

    if precedent > 0.5:
        explanation.append("Weak alignment with existing judicial precedents.")

    if evidence > 0.5:
        explanation.append("Electronic evidence presents admissibility risks.")

    if procedure > 0.5:
        explanation.append("Procedural defects may affect case outcome.")

    if not explanation:
        explanation.append("Case presents strong legal positioning.")

    return {
        "risk_level": (
            "High Risk" if total >= 0.7
            else "Moderate Risk" if total >= 0.4
            else "Low Risk"
        ),
        "summary": explanation
    }
