from datetime import date

def generate_section_84_certificate(evidence, officer_name, officer_role):
    """
    Returns a court-ready certificate text
    """

    return f"""
CERTIFICATE OF COMPLIANCE
(Evidence Act, Section 84)

I, {officer_name}, being the {officer_role}, hereby certify that:

1. The computer system used to generate this evidence was regularly used.
2. The information was supplied in the ordinary course of activities.
3. The system was operating properly at all material times.
4. The information produced is a true reproduction of the data supplied.

Evidence Title: {evidence.title}
Source System: {evidence.source_system}
Date: {date.today()}

Signed:
{officer_name}
"""
