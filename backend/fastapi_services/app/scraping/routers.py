from fastapi import APIRouter, Depends, Query
from typing import List, Dict, Any, Optional

from ..auth.jwt import get_current_user
from .sources.lagos import LagosHighCourtScraper
from .sources.abuja import AbujaHighCourtScraper
from .sources.kano import KanoHighCourtScraper
from .sources.rivers import RiversHighCourtScraper

router = APIRouter()

# Court scrapers mapping
SCRAPERS = {
    "lagos": LagosHighCourtScraper,
    "abuja": AbujaHighCourtScraper,
    "kano": KanoHighCourtScraper,
    "rivers": RiversHighCourtScraper,
}

@router.post("/judgments/{court}")
async def scrape_judgments(
    court: str,
    user=Depends(get_current_user)
) -> List[Dict[str, Any]]:
    """Scrape judgments from specified court"""
    if court not in SCRAPERS:
        return {"error": f"Court '{court}' not supported. Available: {list(SCRAPERS.keys())}"}

    scraper_class = SCRAPERS[court]
    scraper = scraper_class()
    return await scraper.scrape_judgments()

@router.get("/cause-list/{court}")
async def scrape_cause_list(
    court: str,
    date: Optional[str] = Query(None, description="Date in YYYY-MM-DD format"),
    user=Depends(get_current_user)
) -> List[Dict[str, Any]]:
    """Scrape cause list from specified court"""
    if court not in SCRAPERS:
        return {"error": f"Court '{court}' not supported. Available: {list(SCRAPERS.keys())}"}

    scraper_class = SCRAPERS[court]
    scraper = scraper_class()
    return await scraper.scrape_cause_list(date)

@router.get("/courts")
async def list_supported_courts(user=Depends(get_current_user)) -> Dict[str, List[str]]:
    """List all supported courts"""
    return {
        "courts": list(SCRAPERS.keys()),
        "description": "Supported Nigerian courts for scraping"
    }

@router.post("/scrape-all")
async def scrape_all_courts(user=Depends(get_current_user)) -> Dict[str, Any]:
    """Scrape judgments and cause lists from all supported courts"""
    results = {
        "judgments": {},
        "cause_lists": {},
        "timestamp": "2026-01-15T10:00:00Z"
    }

    for court_name, scraper_class in SCRAPERS.items():
        try:
            scraper = scraper_class()
            results["judgments"][court_name] = await scraper.scrape_judgments()
            results["cause_lists"][court_name] = await scraper.scrape_cause_list()
        except Exception as e:
            results["errors"] = results.get("errors", {})
            results["errors"][court_name] = str(e)

    return results

# Legacy endpoints for backward compatibility
@router.post("/scrape")
def scrape_legacy(user=Depends(get_current_user)):
    """Legacy scraping endpoint"""
    scraper = LagosHighCourtScraper()
    import asyncio
    judgments = asyncio.run(scraper.scrape_judgments())
    cause_list = asyncio.run(scraper.scrape_cause_list())
    return {
        "judgments": judgments,
        "cause_list": cause_list
    }

@router.get("/cause-list")
async def scrape_cause_list_legacy(
    url: str,
    user=Depends(get_current_user)
):
    """Legacy cause list endpoint"""
    # For backward compatibility, assume Lagos if no specific court
    scraper = LagosHighCourtScraper()
    return await scraper.scrape_cause_list()
