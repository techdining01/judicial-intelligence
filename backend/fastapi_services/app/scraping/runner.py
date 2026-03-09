import asyncio
from typing import List, Dict, Any
from .sources.lagos import LagosHighCourtScraper
from .sources.abuja import AbujaHighCourtScraper
from .sources.kano import KanoHighCourtScraper
from .sources.rivers import RiversHighCourtScraper
from .normalizer import normalize_judgments_batch, normalize_cause_list_batch

# Court scrapers mapping
SCRAPERS = {
    "lagos": LagosHighCourtScraper,
    "abuja": AbujaHighCourtScraper,
    "kano": KanoHighCourtScraper,
    "rivers": RiversHighCourtScraper,
}

async def run_judgment_scraping(court: str = "all") -> Dict[str, Any]:
    """Run judgment scraping for specified court(s)"""
    results = {
        "courts_scraped": [],
        "total_judgments": 0,
        "judgments": {},
        "errors": []
    }

    courts_to_scrape = list(SCRAPERS.keys()) if court == "all" else [court]

    for court_name in courts_to_scrape:
        if court_name not in SCRAPERS:
            results["errors"].append(f"Court '{court_name}' not supported")
            continue

        try:
            scraper_class = SCRAPERS[court_name]
            scraper = scraper_class()
            raw_judgments = await scraper.scrape_judgments()
            normalized_judgments = normalize_judgments_batch(raw_judgments)

            results["courts_scraped"].append(court_name)
            results["judgments"][court_name] = normalized_judgments
            results["total_judgments"] += len(normalized_judgments)

        except Exception as e:
            results["errors"].append(f"Error scraping {court_name}: {str(e)}")

    return results

async def run_cause_list_scraping(court: str = "all", date: str = None) -> Dict[str, Any]:
    """Run cause list scraping for specified court(s)"""
    results = {
        "courts_scraped": [],
        "total_cases": 0,
        "cause_lists": {},
        "errors": []
    }

    courts_to_scrape = list(SCRAPERS.keys()) if court == "all" else [court]

    for court_name in courts_to_scrape:
        if court_name not in SCRAPERS:
            results["errors"].append(f"Court '{court_name}' not supported")
            continue

        try:
            scraper_class = SCRAPERS[court_name]
            scraper = scraper_class()
            raw_cases = await scraper.scrape_cause_list(date)
            normalized_cases = normalize_cause_list_batch(raw_cases)

            results["courts_scraped"].append(court_name)
            results["cause_lists"][court_name] = normalized_cases
            results["total_cases"] += len(normalized_cases)

        except Exception as e:
            results["errors"].append(f"Error scraping {court_name}: {str(e)}")

    return results

async def run_full_scraping(court: str = "all", date: str = None) -> Dict[str, Any]:
    """Run both judgment and cause list scraping"""
    judgments_result = await run_judgment_scraping(court)
    cause_lists_result = await run_cause_list_scraping(court, date)

    return {
        "judgments": judgments_result,
        "cause_lists": cause_lists_result,
        "summary": {
            "courts_processed": list(set(judgments_result["courts_scraped"] + cause_lists_result["courts_scraped"])),
            "total_judgments": judgments_result["total_judgments"],
            "total_cases": cause_lists_result["total_cases"],
            "errors": judgments_result["errors"] + cause_lists_result["errors"]
        }
    }

# Legacy function for backward compatibility
def run_scraping():
    """Legacy scraping function"""
    scraper = LagosHighCourtScraper()
    judgments = asyncio.run(scraper.scrape_judgments())
    cause_list = asyncio.run(scraper.scrape_cause_list())

    return {
        "judgments": normalize_judgments_batch(judgments),
        "cause_list": normalize_cause_list_batch(cause_list)
    }
