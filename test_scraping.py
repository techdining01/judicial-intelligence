#!/usr/bin/env python3
"""
Test script for judicial intelligence scraping functionality
"""
import asyncio
import sys
import os

print("Starting test script...")
# Add the backend directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))
print(f"Added path: {sys.path[0]}")

from fastapi_services.app.scraping.sources import COURT_SCRAPERS

async def test_scraping():
    """Test the scraping functionality for all available courts"""
    print("Testing Judicial Intelligence Scraping System")
    print("=" * 50)

    for court_name, scraper_class in COURT_SCRAPERS.items():
        print(f"\nTesting {court_name} scraper...")
        try:
            scraper = scraper_class()
            # Test basic functionality - get recent cases
            cases = await scraper.get_recent_cases(limit=3)
            print(f"✓ {court_name}: Found {len(cases)} recent cases")

            if cases:
                print(f"  Sample case: {cases[0].get('title', 'N/A')[:50]}...")

        except Exception as e:
            print(f"✗ {court_name}: Error - {str(e)}")

    print("\n" + "=" * 50)
    print("Scraping test completed!")

if __name__ == "__main__":
    asyncio.run(test_scraping())