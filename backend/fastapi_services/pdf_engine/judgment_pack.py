from reportlab.platypus import Paragraph, Spacer
from .base import create_pdf
from .hashes import generate_hash
from datetime import datetime

def generate_judgment_pack(case, summary, precedents, risk_report, output_path):
    doc, styles = create_pdf(output_path)
    story = []

    story.append(Paragraph("<b>JUDGMENT INTELLIGENCE PACK</b>", styles["Title"]))
    story.append(Spacer(1, 12))

    story.append(Paragraph(f"<b>Suit Number:</b> {case.suit_number}", styles["Normal"]))
    story.append(Paragraph(f"<b>Case Title:</b> {case.title}", styles["Normal"]))
    story.append(Paragraph(f"<b>Court:</b> {case.court}", styles["Normal"]))
    story.append(Paragraph(f"<b>Sitting Date:</b> {case.sitting_date}", styles["Normal"]))
    story.append(Spacer(1, 12))

    story.append(Paragraph("<b>Case Summary</b>", styles["Heading2"]))
    story.append(Paragraph(summary, styles["Normal"]))

    story.append(Spacer(1, 12))
    story.append(Paragraph("<b>Relevant Precedents</b>", styles["Heading2"]))

    for ref, score in precedents:
        story.append(Paragraph(f"- {ref} (Similarity: {round(score,2)})", styles["Normal"]))

    story.append(Spacer(1, 12))
    story.append(Paragraph("<b>Decision Risk Analysis</b>", styles["Heading2"]))

    story.append(Paragraph(
        f"Overall Risk Level: <b>{risk_report['risk_level']}</b>",
        styles["Normal"]
    ))

    for item in risk_report["explanation"]:
        story.append(Paragraph(f"- {item}", styles["Normal"]))

    story.append(Spacer(1, 12))
    story.append(Paragraph(
        "<i>This document is AI-assisted legal intelligence and does not replace judicial discretion.</i>",
        styles["Italic"]
    ))

    doc.build(story)

    return generate_hash(output_path)
