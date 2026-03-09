"""
Legal Practice Tools API Routes
Handles small claims assistant, legal drafting, and evidence management
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta

router = APIRouter()

class ClaimDetails(BaseModel):
    claimType: str
    amount: float
    description: str
    defendantName: str
    defendantAddress: str
    incidentDate: str
    location: str
    evidence: List[str] = []

class EligibilityResult(BaseModel):
    isEligible: bool
    reasons: List[str]
    recommendations: List[str]
    nextSteps: List[str]

class FilingRequirements(BaseModel):
    documents: List[str]
    fees: int
    timeline: str
    court: str

class DocumentDraftRequest(BaseModel):
    documentType: str
    claimDetails: Dict[str, Any]
    jurisdiction: str = "Lagos"

@router.post("/small-claims/eligibility", response_model=Dict[str, Any])
def check_small_claims_eligibility(claim: ClaimDetails):
    """Check eligibility for small claims court"""
    try:
        reasons = []
        recommendations = []
        next_steps = []
        is_eligible = True

        # Check amount limit (₦5,000,000 for small claims)
        if claim.amount > 5000000:
            is_eligible = False
            reasons.append(f"Claim amount ₦{claim.amount:,} exceeds small claims limit of ₦5,000,000")
            recommendations.append("Consider filing in regular court or reducing claim amount")
        else:
            reasons.append(f"Claim amount ₦{claim.amount:,} is within small claims limit")

        # Check claim type
        valid_claim_types = [
            "Contract Dispute", "Property Damage", "Personal Injury", 
            "Debt Collection", "Landlord-Tenant", "Consumer Complaint",
            "Employment Dispute"
        ]
        
        if claim.claimType not in valid_claim_types:
            is_eligible = False
            reasons.append(f"Claim type '{claim.claimType}' may not be suitable for small claims court")
            recommendations.append("Consult with a lawyer to determine appropriate court")
        else:
            reasons.append(f"Claim type '{claim.claimType}' is suitable for small claims court")

        # Check incident date (within 6 years for most claims)
        try:
            incident_date = datetime.strptime(claim.incidentDate, "%Y-%m-%d")
            time_limit = datetime.now() - timedelta(days=6*365)  # 6 years
            if incident_date < time_limit:
                is_eligible = False
                reasons.append("Incident occurred more than 6 years ago (statute of limitations)")
                recommendations.append("Consult with a lawyer about possible exceptions")
            else:
                reasons.append("Incident is within the statutory time limit")
        except ValueError:
            reasons.append("Invalid incident date format")
            recommendations.append("Provide a valid incident date")

        # Check defendant information
        if not claim.defendantName.strip():
            is_eligible = False
            reasons.append("Defendant name is required")
            recommendations.append("Provide complete defendant information")
        else:
            reasons.append("Defendant information is complete")

        # Generate next steps if eligible
        if is_eligible:
            next_steps = [
                "Gather all supporting documents and evidence",
                "Complete the small claims court forms",
                "Pay the filing fee at the appropriate court",
                "Serve the defendant with court papers",
                "Attend the scheduled court hearing"
            ]
            recommendations.extend([
                "Organize all evidence chronologically",
                "Prepare a clear statement of facts",
                "Consider mediation before court",
                "Practice presenting your case"
            ])

        return {
            "status": "success",
            "eligibility": {
                "isEligible": is_eligible,
                "reasons": reasons,
                "recommendations": recommendations,
                "nextSteps": next_steps
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/small-claims/requirements", response_model=Dict[str, Any])
def get_filing_requirements(claim: ClaimDetails):
    """Get filing requirements for small claims case"""
    try:
        # Determine court based on location
        court_mapping = {
            "lagos": "Lagos State Small Claims Court",
            "abuja": "Federal Capital Territory Small Claims Court",
            "kano": "Kano State Small Claims Court",
            "rivers": "Rivers State Small Claims Court"
        }
        
        location_lower = claim.location.lower()
        court = court_mapping.get("lagos", "State Small Claims Court")  # Default to Lagos

        # Calculate filing fees based on claim amount
        if claim.amount <= 100000:
            fees = 5000
        elif claim.amount <= 500000:
            fees = 10000
        elif claim.amount <= 1000000:
            fees = 15000
        elif claim.amount <= 2500000:
            fees = 20000
        else:
            fees = 25000

        # Required documents based on claim type
        base_documents = [
            "Completed small claims court form",
            "Valid identification (ID card, passport, or driver's license)",
            "Proof of residence (utility bill or bank statement)",
            "Evidence of the claim (receipts, contracts, photos)",
            "Defendant's full name and address"
        ]

        # Add specific documents based on claim type
        if claim.claimType == "Contract Dispute":
            base_documents.extend([
                "Original contract agreement",
                "Communication records (emails, messages)",
                "Proof of performance or breach"
            ])
        elif claim.claimType == "Property Damage":
            base_documents.extend([
                "Photos of damage",
                "Repair estimates",
                "Police report (if applicable)"
            ])
        elif claim.claimType == "Personal Injury":
            base_documents.extend([
                "Medical reports and bills",
                "Photos of injuries",
                "Witness statements"
            ])
        elif claim.claimType == "Debt Collection":
            base_documents.extend([
                "Original loan agreement or invoice",
                "Payment history records",
                "Demand letters sent to debtor"
            ])
        elif claim.claimType == "Landlord-Tenant":
            base_documents.extend([
                "Rental agreement",
                "Rent payment records",
                "Property inspection reports"
            ])

        # Processing timeline
        timeline = "2-4 weeks for initial hearing"
        
        return {
            "status": "success",
            "requirements": {
                "documents": base_documents,
                "fees": fees,
                "timeline": timeline,
                "court": court
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/legal-drafting/generate", response_model=Dict[str, Any])
def generate_legal_document(request: DocumentDraftRequest):
    """Generate legal document based on claim details"""
    try:
        document_templates = {
            "demand_letter": {
                "title": "Demand Letter",
                "content": generate_demand_letter(request.claimDetails),
                "type": "formal_letter"
            },
            "complaint": {
                "title": "Statement of Complaint",
                "content": generate_complaint(request.claimDetails),
                "type": "court_filing"
            },
            "witness_statement": {
                "title": "Witness Statement Template",
                "content": generate_witness_statement_template(),
                "type": "template"
            }
        }

        if request.documentType not in document_templates:
            raise HTTPException(status_code=400, detail="Invalid document type")

        template = document_templates[request.documentType]
        
        return {
            "status": "success",
            "document": {
                "title": template["title"],
                "content": template["content"],
                "type": template["type"],
                "generatedAt": datetime.now().isoformat(),
                "jurisdiction": request.jurisdiction
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def generate_demand_letter(claim_details: Dict[str, Any]) -> str:
    """Generate a demand letter"""
    return f"""
DEMAND LETTER

Date: {datetime.now().strftime("%B %d, %Y")}

From: [Your Name]
[Your Address]
[Your Phone]
[Your Email]

To: {claim_details.get('defendantName', '')}
{claim_details.get('defendantAddress', '')}

Re: Demand for Payment - {claim_details.get('claimType', '')}

Dear {claim_details.get('defendantName', '')},

This letter serves as formal demand for payment related to {claim_details.get('claimType', '').lower()} that occurred on {claim_details.get('incidentDate', '')} at {claim_details.get('location', '')}.

{claim_details.get('description', '')}

Based on the above circumstances, we demand payment of ₦{claim_details.get('amount', 0):,.2f} within 14 days from the date of this letter.

Please be advised that if payment is not received within the specified timeframe, we will proceed with filing a claim in Small Claims Court without further notice.

We hope to resolve this matter amicably and avoid unnecessary legal proceedings.

Sincerely,

[Your Signature]
[Your Printed Name]
"""

def generate_complaint(claim_details: Dict[str, Any]) -> str:
    """Generate a statement of complaint"""
    return f"""
STATEMENT OF COMPLAINT
SMALL CLAIMS COURT

COMPLAINANT: [Your Name]
Address: [Your Address]
Phone: [Your Phone]
Email: [Your Email]

DEFENDANT: {claim_details.get('defendantName', '')}
Address: {claim_details.get('defendantAddress', '')}

CLAIM DETAILS:
- Claim Type: {claim_details.get('claimType', '')}
- Amount Claimed: ₦{claim_details.get('amount', 0):,.2f}
- Date of Incident: {claim_details.get('incidentDate', '')}
- Location: {claim_details.get('location', '')}

STATEMENT OF FACTS:
{claim_details.get('description', '')}

RELIEF SOUGHT:
The complainant claims the sum of ₦{claim_details.get('amount', 0):,.2f} plus costs and any other relief the court deems just.

DATED: {datetime.now().strftime("%B %d, %Y")}

_________________________
Complainant's Signature
"""

def generate_witness_statement_template() -> str:
    """Generate a witness statement template"""
    return """
WITNESS STATEMENT TEMPLATE

COURT: Small Claims Court
CASE NUMBER: [To be assigned]

WITNESS DETAILS:
Full Name: _________________________
Address: _____________________________
Phone: _______________________________
Email: _______________________________

RELATIONSHIP TO CASE: ________________

STATEMENT:

I, [Witness Name], hereby declare the following to be true to the best of my knowledge and belief:

1. [Describe what you observed in detail]
2. [Include dates, times, and locations]
3. [Describe any conversations you heard]
4. [Provide any relevant documents or evidence]

I understand that this statement may be used in court proceedings and that making a false statement is a criminal offense.

DECLARATION:

I declare that the contents of this statement are true to the best of my knowledge and belief.

Signature: _________________________
Date: _____________________________

Witnessed by: _______________________
Name: _____________________________
Signature: _________________________
Date: _____________________________
"""

@router.get("/document-types")
def get_document_types():
    """Get available legal document types"""
    try:
        return {
            "status": "success",
            "documentTypes": [
                {
                    "id": "demand_letter",
                    "name": "Demand Letter",
                    "description": "Formal demand letter for payment or action",
                    "category": "pre litigation"
                },
                {
                    "id": "complaint",
                    "name": "Statement of Complaint",
                    "description": "Official complaint for small claims court",
                    "category": "court_filing"
                },
                {
                    "id": "witness_statement",
                    "name": "Witness Statement Template",
                    "description": "Template for witness statements",
                    "category": "evidence"
                }
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
