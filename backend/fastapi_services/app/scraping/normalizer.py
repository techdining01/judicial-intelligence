from typing import Dict, Any, List
import re
from datetime import datetime

def normalize_judgment(raw_judgment: Dict[str, Any]) -> Dict[str, Any]:
    """Normalize raw judgment data into standardized format"""
    return {
        "case_title": raw_judgment.get("case_title", "").strip(),
        "court": raw_judgment.get("court", "").strip(),
        "judgment_date": normalize_date(raw_judgment.get("date", "")),
        "judge": raw_judgment.get("judge", "").strip(),
        "citation": raw_judgment.get("citation", "").strip(),
        "judgment_text": raw_judgment.get("judgment_text", "").strip(),
        "pdf_url": raw_judgment.get("pdf_url", ""),
        "scraped_at": raw_judgment.get("scraped_at", datetime.now().isoformat()),
        # Additional normalized fields
        "case_type": extract_case_type(raw_judgment.get("case_title", "")),
        "legal_issues": [],  # Will be populated in Phase 2
        "citations_referenced": [],  # Will be populated in Phase 2
        "statutes_referenced": [],  # Will be populated in Phase 2
    }

def normalize_cause_list_item(raw_case: Dict[str, Any]) -> Dict[str, Any]:
    """Normalize raw cause list item into standardized format"""
    return {
        "case_number": raw_case.get("case_number", "").strip(),
        "parties": raw_case.get("parties", "").strip(),
        "court": raw_case.get("court", "").strip(),
        "hearing_date": normalize_date(raw_case.get("hearing_date", "")),
        "judge": raw_case.get("judge", "").strip(),
        "scraped_at": raw_case.get("scraped_at", datetime.now().isoformat()),
        # Additional normalized fields
        "case_type": extract_case_type(raw_case.get("parties", "")),
        "court_division": extract_court_division(raw_case.get("court", "")),
    }

def normalize_date(date_str: str) -> str:
    """Normalize date string to ISO format"""
    if not date_str:
        return datetime.now().strftime("%Y-%m-%d")

    # Try to parse various date formats
    try:
        # Handle DD/MM/YYYY format
        if "/" in date_str:
            parts = date_str.split("/")
            if len(parts) == 3:
                return f"{parts[2]}-{parts[1].zfill(2)}-{parts[0].zfill(2)}"

        # Handle DD-MM-YYYY format
        if "-" in date_str and len(date_str.split("-")[0]) <= 2:
            parts = date_str.split("-")
            if len(parts) == 3:
                return f"{parts[2]}-{parts[1].zfill(2)}-{parts[0].zfill(2)}"

        # If already in YYYY-MM-DD format, return as is
        if re.match(r"\d{4}-\d{2}-\d{2}", date_str):
            return date_str

        # Default to today if parsing fails
        return datetime.now().strftime("%Y-%m-%d")

    except:
        return datetime.now().strftime("%Y-%m-%d")

def extract_case_type(text: str) -> str:
    """Extract case type from case title or parties"""
    text = text.lower()

    # Common case type indicators
    if any(word in text for word in ["murder", "homicide", "manslaughter"]):
        return "Criminal"
    elif any(word in text for word in ["theft", "fraud", "robbery", "assault"]):
        return "Criminal"
    elif any(word in text for word in ["contract", "breach", "agreement"]):
        return "Civil - Contract"
    elif any(word in text for word in ["land", "property", "possession", "title"]):
        return "Civil - Property"
    elif any(word in text for word in ["divorce", "custody", "maintenance"]):
        return "Family Law"
    elif any(word in text for word in ["company", "winding up", "incorporation"]):
        return "Commercial Law"
    elif any(word in text for word in ["constitution", "fundamental rights"]):
        return "Constitutional Law"
    elif any(word in text for word in ["employment", "labour", "dismissal"]):
        return "Employment Law"
    else:
        return "General Civil"

def extract_court_division(court_name: str) -> str:
    """Extract court division from court name"""
    court_name = court_name.lower()

    if "ikeja" in court_name:
        return "Ikeja Division"
    elif "lagos" in court_name and "island" in court_name:
        return "Lagos Island Division"
    elif "ikorodu" in court_name:
        return "Ikorodu Division"
    elif "badagry" in court_name:
        return "Badagry Division"
    elif "central" in court_name:
        return "Central District"
    elif "nassarawa" in court_name:
        return "Nassarawa Division"
    elif "port harcourt" in court_name:
        return "Port Harcourt Division"
    else:
        return "Main Division"

def normalize_case(raw):
    """Legacy function for backward compatibility"""
    return normalize_cause_list_item(raw)

def normalize_judgments_batch(judgments: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Normalize a batch of judgment data"""
    return [normalize_judgment(j) for j in judgments]

def normalize_cause_list_batch(cases: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Normalize a batch of cause list data"""
    return [normalize_cause_list_item(c) for c in cases]
