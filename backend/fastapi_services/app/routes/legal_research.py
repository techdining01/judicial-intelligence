"""
Legal Research API Routes
Handles statute and regulation search functionality
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

router = APIRouter()

class StatuteSearchRequest(BaseModel):
    query: str
    jurisdiction: Optional[str] = None
    category: Optional[str] = None

class Statute(BaseModel):
    id: str
    title: str
    jurisdiction: str
    category: str
    content: str
    section: str
    relevance_score: float
    last_updated: str

class StatuteSearchResponse(BaseModel):
    statutes: List[Statute]
    total_count: int
    search_time: float

# Mock statute database - replace with real database
MOCK_STATUTES = [
    {
        "id": "const_001",
        "title": "Constitution of the Federal Republic of Nigeria - Chapter 1",
        "jurisdiction": "Federal",
        "category": "Constitutional",
        "content": "This Constitution shall be the supreme law of the Federal Republic of Nigeria. Any provision of any other law that is inconsistent with the provisions of this Constitution shall, to the extent of the inconsistency, be void. The provisions of this Constitution shall be enforced by all authorities and persons exercising executive, legislative or judicial powers in the Federation.",
        "section": "1(1)",
        "relevance_score": 95.0,
        "last_updated": "2023-12-15"
    },
    {
        "id": "const_002",
        "title": "Companies and Allied Matters Act - Section 22",
        "jurisdiction": "Federal",
        "category": "Commercial",
        "content": "Every company shall have at least two directors. Where a company has only one director, that director may appoint another person to act as an alternate director during any period of absence or incapacity of the sole director. The alternate director shall have the same powers and duties as the director he is replacing.",
        "section": "22(1)",
        "relevance_score": 88.5,
        "last_updated": "2024-01-20"
    },
    {
        "id": "state_001",
        "title": "Lagos State Tenancy Law - Section 1",
        "jurisdiction": "Lagos",
        "category": "Property",
        "content": "A tenancy agreement is a contract between a landlord and a tenant for the lease of a premises. The agreement shall be in writing and shall be signed by both parties. The landlord shall provide the tenant with peaceful enjoyment of the premises during the term of the tenancy.",
        "section": "1",
        "relevance_score": 92.3,
        "last_updated": "2023-11-10"
    },
    {
        "id": "crim_001",
        "title": "Criminal Code Act - Section 319",
        "jurisdiction": "Federal",
        "category": "Criminal",
        "content": "Any person who, by means of any threat or violence, prevents a public servant from performing his official duties, or obstructs any public servant in the discharge of his duties, shall be guilty of an offence and shall be liable to imprisonment for a term which may extend to three years.",
        "section": "319",
        "relevance_score": 85.7,
        "last_updated": "2024-02-15"
    },
    {
        "id": "family_001",
        "title": "Matrimonial Causes Act - Section 2",
        "jurisdiction": "Federal",
        "category": "Family",
        "content": "A marriage may be dissolved by a petition to the court by either party to the marriage on the ground that the marriage has broken down irretrievably. The court shall be satisfied that the marriage has broken down irretrievably if it is satisfied that the parties have separated and there is no reasonable prospect of reconciliation.",
        "section": "2",
        "relevance_score": 79.2,
        "last_updated": "2023-09-25"
    }
]

@router.post("/statutes/search", response_model=Dict[str, Any])
def search_statutes(request: StatuteSearchRequest):
    """Search statutes and regulations"""
    try:
        start_time = datetime.now()
        
        # Filter statutes based on search criteria
        filtered_statutes = MOCK_STATUTES
        
        # Apply jurisdiction filter
        if request.jurisdiction and request.jurisdiction != "All":
            filtered_statutes = [
                s for s in filtered_statutes 
                if s["jurisdiction"].lower() == request.jurisdiction.lower()
            ]
        
        # Apply category filter
        if request.category and request.category != "All":
            filtered_statutes = [
                s for s in filtered_statutes 
                if s["category"].lower() == request.category.lower()
            ]
        
        # Apply text search
        if request.query:
            query_lower = request.query.lower()
            filtered_statutes = [
                s for s in filtered_statutes 
                if (
                    query_lower in s["title"].lower() or
                    query_lower in s["content"].lower() or
                    query_lower in s["section"].lower()
                )
            ]
        
        # Calculate relevance scores (simplified - in real implementation, use semantic search)
        for statute in filtered_statutes:
            if request.query:
                query_lower = request.query.lower()
                title_match = query_lower in statute["title"].lower()
                content_match = query_lower in statute["content"].lower()
                
                if title_match:
                    statute["relevance_score"] = min(95.0, statute["relevance_score"])
                elif content_match:
                    statute["relevance_score"] = min(85.0, statute["relevance_score"])
                else:
                    statute["relevance_score"] = statute["relevance_score"] * 0.7
        
        # Sort by relevance score
        filtered_statutes.sort(key=lambda x: x["relevance_score"], reverse=True)
        
        end_time = datetime.now()
        search_time = (end_time - start_time).total_seconds()
        
        return {
            "status": "success",
            "statutes": filtered_statutes,
            "total_count": len(filtered_statutes),
            "search_time": search_time,
            "query": request.query,
            "filters": {
                "jurisdiction": request.jurisdiction,
                "category": request.category
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/statutes/{statute_id}")
def get_statute_details(statute_id: str):
    """Get detailed information about a specific statute"""
    try:
        statute = next((s for s in MOCK_STATUTES if s["id"] == statute_id), None)
        
        if not statute:
            raise HTTPException(status_code=404, detail="Statute not found")
        
        return {
            "status": "success",
            "statute": statute,
            "related_statutes": [
                s for s in MOCK_STATUTES 
                if s["category"] == statute["category"] and s["id"] != statute_id
            ][:3]  # Return up to 3 related statutes
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/jurisdictions")
def get_jurisdictions():
    """Get list of available jurisdictions"""
    try:
        jurisdictions = list(set(s["jurisdiction"] for s in MOCK_STATUTES))
        return {
            "status": "success",
            "jurisdictions": sorted(jurisdictions),
            "total_count": len(jurisdictions)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/categories")
def get_categories():
    """Get list of available legal categories"""
    try:
        categories = list(set(s["category"] for s in MOCK_STATUTES))
        return {
            "status": "success",
            "categories": sorted(categories),
            "total_count": len(categories)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
