import os
from google import genai
from dotenv import load_dotenv
from decouple import config
from typing import Dict, Any

load_dotenv(".env")

client = genai.Client(
    api_key=config("GEMINI_KEY", default=os.getenv("GEMINI_KEY"))
)

MODEL = "gemini-2.0-flash"


def generate_motion(case_type: str, legal_issue: str, jurisdiction: str, facts: str = "") -> str:
    """Generate a legal motion based on case details"""
    prompt = f"""
    Generate a professional legal motion for the following case:
    
    Case Type: {case_type}
    Legal Issue: {legal_issue}
    Jurisdiction: {jurisdiction}
    Facts: {facts}
    
    Requirements:
    - Use proper Nigerian legal format
    - Include appropriate legal citations where relevant
    - Follow court procedure for {jurisdiction}
    - Be professional and formal
    - Include prayer for relief
    """
    
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt
    )
    
    return response.text.strip()


def generate_affidavit(case_type: str, legal_issue: str, jurisdiction: str, deponent: str = "") -> str:
    """Generate an affidavit based on case details"""
    prompt = f"""
    Generate a professional affidavit for the following case:
    
    Case Type: {case_type}
    Legal Issue: {legal_issue}
    Jurisdiction: {jurisdiction}
    Deponent: {deponent}
    
    Requirements:
    - Use proper Nigerian affidavit format
    - Include verification clause
    - Follow court procedure for {jurisdiction}
    - Be factual and concise
    - Include commissioner for oaths section
    """
    
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt
    )
    
    return response.text.strip()


def generate_statement_of_claim(case_type: str, legal_issue: str, jurisdiction: str, parties: str = "", facts: str = "") -> str:
    """Generate a statement of claim based on case details"""
    prompt = f"""
    Generate a professional statement of claim for the following case:
    
    Case Type: {case_type}
    Legal Issue: {legal_issue}
    Jurisdiction: {jurisdiction}
    Parties: {parties}
    Facts: {facts}
    
    Requirements:
    - Use proper Nigerian court format
    - Include parties, jurisdiction, and reliefs sought
    - Follow court procedure for {jurisdiction}
    - Be detailed and legally precise
    - Include numbered paragraphs
    """
    
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt
    )
    
    return response.text.strip()


def generate_written_address(case_type: str, legal_issue: str, jurisdiction: str, arguments: str = "") -> str:
    """Generate a written address based on case details"""
    prompt = f"""
    Generate a professional written address for the following case:
    
    Case Type: {case_type}
    Legal Issue: {legal_issue}
    Jurisdiction: {jurisdiction}
    Arguments: {arguments}
    
    Requirements:
    - Use proper Nigerian legal format
    - Include issue for determination
    - Follow court procedure for {jurisdiction}
    - Be persuasive and legally sound
    - Include legal authorities and precedents where relevant
    """
    
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt
    )
    
    return response.text.strip()


def generate_legal_document(document_type: str, case_details: Dict[str, Any]) -> str:
    """Generic legal document generator"""
    case_type = case_details.get("case_type", "")
    legal_issue = case_details.get("legal_issue", "")
    jurisdiction = case_details.get("jurisdiction", "")
    facts = case_details.get("facts", "")
    parties = case_details.get("parties", "")
    arguments = case_details.get("arguments", "")
    deponent = case_details.get("deponent", "")
    
    if document_type.lower() == "motion":
        return generate_motion(case_type, legal_issue, jurisdiction, facts)
    elif document_type.lower() == "affidavit":
        return generate_affidavit(case_type, legal_issue, jurisdiction, deponent)
    elif document_type.lower() == "statement_of_claim":
        return generate_statement_of_claim(case_type, legal_issue, jurisdiction, parties, facts)
    elif document_type.lower() == "written_address":
        return generate_written_address(case_type, legal_issue, jurisdiction, arguments)
    else:
        return "Document type not supported. Available types: motion, affidavit, statement_of_claim, written_address"
