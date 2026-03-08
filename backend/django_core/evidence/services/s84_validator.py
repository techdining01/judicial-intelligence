from .s84_rules import SECTION_84_RULES

def validate_section_84(inputs: dict) -> dict:
    """
    inputs = {
        'regularly_used': True,
        'ordinary_course': True,
        'system_integrity_ok': True,
        'data_reproduction_ok': True
    }
    """

    missing = [k for k in SECTION_84_RULES if k not in inputs]

    if missing:
        raise ValueError(f"Missing Section 84 fields: {missing}")

    compliant = all(inputs.values())

    return {
        "compliant": compliant,
        "breakdown": inputs
    }
