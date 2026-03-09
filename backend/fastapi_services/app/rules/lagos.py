"""
Lagos State Legal Rules Engine
Contains monetary limits, filing procedures, and hearing timelines for Lagos State courts
"""

from typing import Dict, Any
from datetime import datetime, timedelta

class LagosRules:
    """Lagos State court rules and procedures"""
    
    # Monetary limits for different courts (in Naira)
    MONETARY_LIMITS = {
        "magistrate_court": {
            "grade_a": 500000,      # ₦500,000
            "grade_b": 250000,      # ₦250,000  
            "grade_c": 100000,      # ₦100,000
            "grade_d": 50000,       # ₦50,000
        },
        "customary_court": 1000000,  # ₦1,000,000
        "high_court": 100000000,    # ₦100,000,000
        "federal_high_court": 100000000,  # ₦100,000,000
    }
    
    # Filing procedures and requirements
    FILING_PROCEDURES = {
        "civil_claims": {
            "documents_required": [
                "Statement of Claim",
                "Affidavit of Service",
                "Proof of Ownership",
                "Evidence of Debt/Damage"
            ],
            "filing_fee_structure": {
                "up_to_100k": 2000,
                "100k_to_500k": 5000,
                "500k_to_1m": 10000,
                "1m_to_5m": 25000,
                "5m_to_10m": 50000,
                "above_10m": 100000
            },
            "time_limits": {
                "contract_disputes": 6,  # years
                "land_disputes": 12,     # years
                "tort_claims": 3,        # years
                "debt_recovery": 6       # years
            }
        },
        "criminal_matters": {
            "documents_required": [
                "Police Report",
                "Charge Sheet",
                "Witness Statements",
                "Exhibits List"
            ],
            "bail_conditions": {
                "bailable_offences": True,
                "non_bailable_offences": False,
                "bail_amount_range": {
                    "misdemeanor": (10000, 100000),
                    "felony": (100000, 1000000)
                }
            }
        }
    }
    
    # Hearing timelines (in days)
    HEARING_TIMELINES = {
        "civil_cases": {
            "first_hearing": 30,      # days from filing
            "inter_applications": 7,  # days from filing
            "trial_commencement": 60, # days from first hearing
            "judgment_delivery": 90,  # days from trial completion
        },
        "criminal_cases": {
            "arraignment": 14,        # days from charge filing
            "bail_application": 7,    # days from arraignment
            "trial_commencement": 30,  # days from bail/arraignment
            "judgment_delivery": 60,   # days from trial completion
        },
        "family_law": {
            "divorce_petition": 14,   # days from filing
            "custody_hearing": 21,    # days from petition
            "property_settlement": 30 # days from divorce decree
        }
    }
    
    # Court divisions and their jurisdictions
    COURT_DIVISIONS = {
        "ikeja": {
            "jurisdiction": "Ikeja and environs",
            "specialization": ["Commercial", "Company Law", "Banking"],
            "address": "Lagos State High Court, Ikeja"
        },
        "lagos_island": {
            "jurisdiction": "Lagos Island and Victoria Island",
            "specialization": ["Admiralty", "Banking", "Commercial"],
            "address": "Lagos State High Court, Lagos Island"
        },
        "ikorodu": {
            "jurisdiction": "Ikorodu division",
            "specialization": ["Land", "Customary Law", "Family"],
            "address": "Lagos State High Court, Ikorodu"
        },
        "badagry": {
            "jurisdiction": "Badagry division",
            "specialization": ["Customary Law", "Land", "Criminal"],
            "address": "Lagos State High Court, Badagry"
        }
    }
    
    @classmethod
    def get_monetary_limit(cls, court_type: str, grade: str = None) -> Dict[str, Any]:
        """Get monetary limit for specific court"""
        if court_type == "magistrate_court" and grade:
            return {
                "limit": cls.MONETARY_LIMITS["magistrate_court"].get(grade, 0),
                "currency": "NGN",
                "court_type": court_type,
                "grade": grade
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
        
        if claim_amount <= 100000:
            fee = fee_structure["up_to_100k"]
        elif claim_amount <= 500000:
            fee = fee_structure["100k_to_500k"]
        elif claim_amount <= 1000000:
            fee = fee_structure["500k_to_1m"]
        elif claim_amount <= 5000000:
            fee = fee_structure["1m_to_5m"]
        elif claim_amount <= 10000000:
            fee = fee_structure["5m_to_10m"]
        else:
            fee = fee_structure["above_10m"]
        
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
