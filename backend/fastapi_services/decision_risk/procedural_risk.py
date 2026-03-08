def procedural_risk(case):
    """
    Deterministic procedural checks
    """

    risks = []

    if not case.suit_number:
        risks.append("Missing suit number")

    if case.filing_date > case.sitting_date:
        risks.append("Sitting date earlier than filing date")

    if not case.parties:
        risks.append("Parties not clearly defined")

    if risks:
        return {
            "score": 0.7,
            "issues": risks
        }

    return {
        "score": 0.2,
        "issues": []
    }
