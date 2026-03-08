from fastapi import APIRouter, Depends

from ..auth.jwt import get_current_user
from .runner import run_scraping
from .high_court import HighCourtScraper

router = APIRouter()


@router.post("/scrape")
def scrape(user=Depends(get_current_user)):
    return run_scraping()


@router.get("/cause-list")
async def scrape_cause_list(url: str, user=Depends(get_current_user)):
    scraper = HighCourtScraper()
    return await scraper.scrape_cause_list(url)
