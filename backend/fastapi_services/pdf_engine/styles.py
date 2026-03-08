
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib.colors import black, grey

def get_styles():
    return {
        "title": ParagraphStyle(
            name="Title",
            fontSize=16,
            leading=20,
            alignment=TA_CENTER,
            spaceAfter=20,
            textColor=black,
            fontName="Helvetica-Bold",
        ),
        "heading": ParagraphStyle(
            name="Heading",
            fontSize=12,
            leading=14,
            spaceAfter=10,
            fontName="Helvetica-Bold",
        ),
        "body": ParagraphStyle(
            name="Body",
            fontSize=10,
            leading=14,
            spaceAfter=8,
            alignment=TA_LEFT,
        ),
        "italic": ParagraphStyle(
            name="Italic",
            fontSize=9,
            leading=12,
            spaceAfter=8,
            textColor=grey,
            fontName="Helvetica-Oblique",
        ),
    }
