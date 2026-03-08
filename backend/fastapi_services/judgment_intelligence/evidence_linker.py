

def attach_evidence_compliance(judgment_summary, s84_report):
    """
    Injects compliance info into judgment intelligence
    """

    if not s84_report.compliant:
        warning = "⚠️ Electronic evidence may be inadmissible under s.84 Evidence Act."
    else:
        warning = "✅ Electronic evidence complies with s.84 Evidence Act."

    return {
        "summary": judgment_summary,
        "evidence_warning": warning
    }


