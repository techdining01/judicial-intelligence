"""
Kano State Legal Rules Engine
Contains monetary limits, filing procedures, and hearing timelines for Kano State courts
"""

from typing import Dict, Any
from datetime import datetime, timedelta

class KanoRules:
    """Kano State court rules and procedures"""
    
    # Monetary limits for different courts (in Naira)
    MONETARY_LIMITS = {
        "magistrate_court": {
            "grade_a": 300000,      # ₦300,000
            "grade_b": 150000,      # ₦150,000  
            "grade_c": 75000,        # ₦75,000
            "grade_d": 40000,        # ₦40,000
        },
        "sharia_court": {
            "area_court": 1000000,   # ₦1,000,000
            "upper_sharia": 5000000, # ₦5,000,000
            "sharia_court_appeal": 10000000  # ₦10,000,000
        },
        "customary_court": 750000,   # ₦750,000
        "high_court": 75000000,     # ₦75,000,000
        "federal_high_court": 100000000,  # ₦100,000,000
    }
    
    # Filing procedures and requirements
    FILING_PROCEDURES = {
        "civil_claims": {
            "documents_required": [
                "Statement of Claim",
                "Affidavit of Service",
                "Proof of Ownership",
                "Evidence of Debt/Damage",
                "Local Government Certificate"
            ],
            "filing_fee_structure": {
                "up_to_50k": 1500,
                "50k_to_250k": 3000,
                "250k_to_750k": 7500,
                "750k_to_2m": 15000,
                "2m_to_5m": 30000,
                "above_5m": 75000
            },
            "time_limits": {
                "contract_disputes": 6,  # years
                "land_disputes": 12,     # years
                "tort_claims": 3,        # years
                "debt_recovery": 6,      # years
                "sharia_matters": 5      # years
            }
        },
        "sharia_matters": {
            "documents_required": [
                "Sharia Court Complaint",
                "Witness Statements (Islamic)",
                "Quranic References",
                "Islamic Marriage Certificate (if applicable)"
            ],
            "procedure_type": "Islamic Law",
            "evidence_requirements": [
                "Oral testimony from qualified witnesses",
                "Written documents",
                "Oath on Quran"
            ]
        },
        "criminal_matters": {
            "documents_required": [
                "Police Report",
                "Charge Sheet",
                "Witness Statements",
                "Exhibits List",
                "Sharia Law Officer Report (for Sharia cases)"
            ],
            "bail_conditions": {
                "bailable_offences": True,
                "non_bailable_offences": False,
                "bail_amount_range": {
                    "misdemeanor": (5000, 50000),
                    "felony": (50000, 500000)
                }
            }
        }
    }
    
    # Hearing timelines (in days)
    HEARING_TIMELINES = {
        "civil_cases": {
            "first_hearing": 45,      # days from filing
            "inter_applications": 14, # days from filing
            "trial_commencement": 90, # days from first hearing
            "judgment_delivery": 120, # days from trial completion
        },
        "sharia_cases": {
            "first_hearing": 30,      # days from filing
            "witness_testimony": 21,  # days from first hearing
            "judgment_delivery": 60,  # days from testimony completion
        },
        "criminal_cases": {
            "arraignment": 21,        # days from charge filing
            "bail_application": 14,   # days from arraignment
            "trial_commencement": 45, # days from bail/arraignment
            "judgment_delivery": 90,  # days from trial completion
        },
        "family_law": {
            "divorce_petition": 21,   # days from filing
            "custody_hearing": 30,    # days from petition
            "property_settlement": 45 # days from divorce decree
        }
    }
    
    # Court divisions and their jurisdictions
    COURT_DIVISIONS = {
        "kano_metropolitan": {
            "jurisdiction": "Kano Municipal Area",
            "specialization": ["Commercial", "Company Law", "Sharia Law"],
            "address": "Kano State High Court, Kano"
        },
        "nassarawa": {
            "jurisdiction": "Nassarawa Local Government",
            "specialization": ["Land", "Customary Law", "Family"],
            "address": "Kano State High Court, Nassarawa"
        },
        "dala": {
            "jurisdiction": "Dala Local Government",
            "specialization": ["Criminal", "Customary Law"],
            "address": "Kano State High Court, Dala"
        },
        "gwarzo": {
            "jurisdiction": "Gwarzo Local Government",
            "specialization": ["Sharia Law", "Family", "Land"],
            "address": "Kano State High Court, Gwarzo"
        }
    }
    
    @classmethod
    def get_monetary_limit(cls, court_type: str, grade: str = None, sharia_level: str = None) -> Dict[str, Any]:
        """Get monetary limit for specific court"""
        if court_type == "magistrate_court" and grade:
            return {
                "limit": cls.MONETARY_LIMITS["magistrate_court"].get(grade, 0),
                "currency": "NGN",
                "court_type": court_type,
                "grade": grade
            }
        elif court_type == "sharia_court" and sharia_level:
            return {
                "limit": cls.MONETARY_LIMITS["sharia_court"].get(sharia_level, 0),
                "currency": "NGN",
                "court_type": court_type,
                "sharia_level": sharia_level
            }
        elif court_type in cls.MONETARY_LIMITS:
            return {
                "limit": cls.MONETARY_LIMITS[court_type],
                "currency": "NGN",
                "court_type": court_type
            }
        return {"error": "Invalid court type"}
    
    @classmethod
    def get_filing_procedure(cls, case_type: str) -> Dict[str, Any]:
        """Get filing procedure for case type"""
        return cls.FILING_PROCEDURES.get(case_type.lower(), {})
    
    @classmethod
    def get_hearing_timeline(cls, case_category: str) -> Dict[str, Any]:
        """Get hearing timeline for case category"""
        return cls.HEARING_TIMELINES.get(case_category.lower(), {})
    
    @classmethod
    def get_court_division(cls, division: str) -> Dict[str, Any]:
        """Get court division information"""
        return cls.COURT_DIVISIONS.get(division.lower(), {})
    
    @classmethod
    def calculate_filing_fee(cls, claim_amount: float) -> Dict[str, Any]:
        """Calculate filing fee based on claim amount"""
        fee_structure = cls.FILING_PROCEDURES["civil_claims"]["filing_fee_structure"]
        
        if claim_amount <= 50000:
            fee = fee_structure["up_to_50k"]
        elif claim_amount <= 250000:
            fee = fee_structure["50k_to_250k"]
        elif claim_amount <= 750000:
            fee = fee_structure["250k_to_750k"]
        elif claim_amount <= 2000000:
            fee = fee_structure["750k_to_2m"]
        elif claim_amount <= 5000000:
            fee = fee_structure["2m_to_5m"]
        else:
            fee = fee_structure["above_5m"]
        
        return {
            "claim_amount": claim_amount,
            "filing_fee": fee,
            "currency": "NGN"
        }
    
    @classmethod
    def check_time_limit(cls, case_type: str, incident_date: str) -> Dict[str, Any]:
        """Check if case is within statutory time limit"""
        try:
            incident_dt = datetime.fromisoformat(incident_date.replace('Z', '+00:00'))
            current_dt = datetime.now()
            days_elapsed = (current_dt - incident_dt).days
            years_elapsed = days_elapsed / 365.25
            
            time_limits = cls.FILING_PROCEDURES["civil_claims"]["time_limits"]
            limit_years = time_limits.get(case_type.lower(), 6)
            
            is_within_limit = years_elapsed <= limit_years
            
            return {
                "case_type": case_type,
                "incident_date": incident_date,
                "days_elapsed": days_elapsed,
                "years_elapsed": round(years_elapsed, 2),
                "time_limit_years": limit_years,
                "within_time_limit": is_within_limit,
                "days_remaining": max(0, (limit_years * 365.25) - days_elapsed) if is_within_limit else 0
            }
        except Exception as e:
            return {"error": str(e)}
