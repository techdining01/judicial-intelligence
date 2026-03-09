import re
from typing import Dict, List, Any
import spacy

nlp = spacy.load("en_core_web_sm")

def clean_raw_text(text: str) -> str:
    """Clean raw judgment text by removing extra spaces, normalizing unicode, etc."""
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    # Normalize unicode
    text = text.strip()
    return text

def extract_legal_issues(text: str) -> List[str]:
    """Extract legal issues using spaCy NER and keyword matching."""
    doc = nlp(text)
    issues = []
    
    # Use NER for entities that might indicate issues
    for ent in doc.ents:
        if ent.label_ in ['LAW', 'ORG'] and any(keyword in ent.text.lower() for keyword in ['contract', 'tort', 'criminal', 'civil', 'constitutional']):
            issues.append(ent.text)
    
    # Fallback to keyword matching
    keywords = {
        'Contract Law': ['contract', 'breach', 'agreement'],
        'Tort Law': ['tort', 'negligence', 'damages'],
        'Criminal Law': ['criminal', 'offence', 'felony'],
        'Constitutional Law': ['constitution', 'fundamental rights'],
        'Civil Law': ['civil', 'litigation']
    }
    
    for issue, words in keywords.items():
        if any(word in text.lower() for word in words) and issue not in issues:
            issues.append(issue)
    
    return issues

def identify_case_citations(text: str) -> List[str]:
    """Identify case citations using regex patterns."""
    # Nigerian case citation patterns, e.g., [2010] 1 NWLR (Pt. 1203) 1
    citation_pattern = r'\[\d{4}\]\s*\d+\s*NWLR\s*\(Pt\.\s*\d+\)\s*\d+'
    citations = re.findall(citation_pattern, text)
    return citations

def detect_statutes(text: str) -> List[str]:
    """Detect statutes referenced using spaCy NER."""
    doc = nlp(text)
    statutes = []
    
    for ent in doc.ents:
        if ent.label_ == 'LAW' and any(term in ent.text.lower() for term in ['act', 'code', 'constitution', 'law']):
            statutes.append(ent.text)
    
    # Fallback
    if 'constitution' in text.lower() and 'Constitution of the Federal Republic of Nigeria 1999' not in statutes:
        statutes.append('Constitution of the Federal Republic of Nigeria 1999')
    if 'criminal code' in text.lower() and 'Criminal Code Act' not in statutes:
        statutes.append('Criminal Code Act')
    
    return statutes

def structure_final_record(text: str) -> Dict[str, Any]:
    """Structure the final record from the normalized text."""
    cleaned_text = clean_raw_text(text)
    issues = extract_legal_issues(cleaned_text)
    citations = identify_case_citations(cleaned_text)
    statutes = detect_statutes(cleaned_text)
    
    record = {
        'normalized_text': cleaned_text,
        'legal_issues': issues,
        'case_citations': citations,
        'statutes': statutes
    }
    return record