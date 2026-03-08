def evidence_risk(evidence_reports):
    """
    evidence_reports = list of EvidenceSection84Report
    """

    if not evidence_reports:
        return {
            "score": 0.5,
            "note": "No electronic evidence assessed"
        }

    failed = [r for r in evidence_reports if not r.compliant]

    if failed:
        return {
            "score": 0.8,
            "note": "One or more electronic evidence items fail s.84 compliance"
        }

    return {
        "score": 0.2,
        "note": "Electronic evidence compliant with Evidence Act s.84"
    }
