
from datetime import datetime

def format_date(date_obj):
    if not date_obj:
        return "N/A"
    return date_obj.strftime("%d %B %Y")

def safe_text(text):
    if not text:
        return ""
    return str(text).replace("<", "&lt;").replace(">", "&gt;")

def document_footer():
    return f"Generated on {datetime.now().strftime('%d %B %Y, %H:%M')}"
