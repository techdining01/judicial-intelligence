import requests
import httpx
from bs4 import BeautifulSoup
from datetime import datetime
from typing import List, Dict, Any

class LagosHighCourtScraper:
    """Scraper for Lagos State High Court judgments and cause lists"""

    def __init__(self):
        self.base_url = "https://lagosjudiciary.gov.ng"
        self.judgments_url = f"{self.base_url}/judgments"
        self.cause_list_url = f"{self.base_url}/cause-list"

    async def scrape_judgments(self) -> List[Dict[str, Any]]:
        """Scrape court judgments from Lagos High Court"""
        async with httpx.AsyncClient(timeout=30) as client:
            try:
                response = await client.get(self.judgments_url)
                response.raise_for_status()
                soup = BeautifulSoup(response.text, "html.parser")

                judgments = []
                # Look for judgment listings - adjust selectors based on actual site structure
                judgment_cards = soup.select(".judgment-card, .case-item, article")

                for card in judgment_cards[:10]:  # Limit to 10 for testing
                    judgment = self._extract_judgment_data(card)
                    if judgment:
                        judgments.append(judgment)

                return judgments

            except Exception as e:
                print(f"Error scraping Lagos judgments: {e}")
                # Return mock data for development
                return self._get_mock_judgments()

    async def scrape_cause_list(self, date: str = None) -> List[Dict[str, Any]]:
        """Scrape cause list from Lagos High Court"""
        if not date:
            date = datetime.now().strftime("%Y-%m-%d")

        async with httpx.AsyncClient(timeout=30) as client:
            try:
                response = await client.get(f"{self.cause_list_url}?date={date}")
                response.raise_for_status()
                soup = BeautifulSoup(response.text, "html.parser")

                cases = []
                # Look for cause list table - adjust selectors based on actual site structure
                rows = soup.select("table tr, .cause-list-item")

                for row in rows:
                    case = self._extract_cause_list_data(row)
                    if case:
                        cases.append(case)

                return cases

            except Exception as e:
                print(f"Error scraping Lagos cause list: {e}")
                # Return mock data for development
                return self._get_mock_cause_list()

    def _extract_judgment_data(self, element) -> Dict[str, Any]:
        """Extract judgment data from HTML element"""
        try:
            title_elem = element.select_one("h3, .title, .case-title")
            case_title = title_elem.text.strip() if title_elem else "Unknown Case"

            date_elem = element.select_one(".date, .judgment-date, time")
            judgment_date = date_elem.text.strip() if date_elem else datetime.now().strftime("%Y-%m-%d")

            judge_elem = element.select_one(".judge, .justice")
            judge = judge_elem.text.strip() if judge_elem else "Unknown Judge"

            citation_elem = element.select_one(".citation, .reference")
            citation = citation_elem.text.strip() if citation_elem else ""

            # Try to get full text link
            pdf_link = element.select_one("a[href*='.pdf'], a[href*='download']")
            pdf_url = pdf_link['href'] if pdf_link else ""

            return {
                "case_title": case_title,
                "court": "Lagos State High Court",
                "date": judgment_date,
                "judge": judge,
                "citation": citation,
                "judgment_text": "",  # Would be populated from PDF content
                "pdf_url": pdf_url,
                "scraped_at": datetime.now().isoformat()
            }
        except Exception as e:
            print(f"Error extracting judgment data: {e}")
            return None

    def _extract_cause_list_data(self, element) -> Dict[str, Any]:
        """Extract cause list data from HTML element"""
        try:
            # Adjust selectors based on actual HTML structure
            case_num_elem = element.select_one("td:nth-child(1), .case-number")
            case_number = case_num_elem.text.strip() if case_num_elem else ""

            parties_elem = element.select_one("td:nth-child(2), .parties")
            parties = parties_elem.text.strip() if parties_elem else ""

            court_elem = element.select_one("td:nth-child(3), .court")
            court = court_elem.text.strip() if court_elem else "Lagos High Court"

            date_elem = element.select_one("td:nth-child(4), .hearing-date")
            hearing_date = date_elem.text.strip() if date_elem else datetime.now().strftime("%Y-%m-%d")

            judge_elem = element.select_one("td:nth-child(5), .judge")
            judge = judge_elem.text.strip() if judge_elem else ""

            return {
                "case_number": case_number,
                "parties": parties,
                "court": court,
                "hearing_date": hearing_date,
                "judge": judge,
                "scraped_at": datetime.now().isoformat()
            }
        except Exception as e:
            print(f"Error extracting cause list data: {e}")
            return None

    def _get_mock_judgments(self) -> List[Dict[str, Any]]:
        """Return mock judgment data for development/testing"""
        return [
            {
                "case_title": "Adebayo v. Federal Republic of Nigeria",
                "court": "Lagos State High Court",
                "date": "2026-01-15",
                "judge": "Justice A. Okafor",
                "citation": "[2026] LSHC 1",
                "judgment_text": "This is a mock judgment text for development purposes...",
                "pdf_url": "",
                "scraped_at": datetime.now().isoformat()
            },
            {
                "case_title": "Okafor Enterprises Ltd v. Lagos State Government",
                "court": "Lagos State High Court",
                "date": "2026-01-10",
                "judge": "Justice B. Adeyemi",
                "citation": "[2026] LSHC 2",
                "judgment_text": "Mock judgment content for testing...",
                "pdf_url": "",
                "scraped_at": datetime.now().isoformat()
            }
        ]

    def _get_mock_cause_list(self) -> List[Dict[str, Any]]:
        """Return mock cause list data for development/testing"""
        return [
            {
                "case_number": "LD/123/2026",
                "parties": "Johnson v. Nigerian Telecom Ltd",
                "court": "Lagos High Court - Ikeja Division",
                "hearing_date": "2026-01-20",
                "judge": "Justice C. Okon",
                "scraped_at": datetime.now().isoformat()
            },
            {
                "case_number": "LD/456/2026",
                "parties": "Adebayo & Sons Ltd v. Federal Inland Revenue Service",
                "court": "Lagos High Court - Lagos Division",
                "hearing_date": "2026-01-22",
                "judge": "Justice D. Nwosu",
                "scraped_at": datetime.now().isoformat()
            }
        ]

# Legacy function for backward compatibility
def scrape_lagos_cause_list():
    scraper = LagosHighCourtScraper()
    import asyncio
    return asyncio.run(scraper.scrape_cause_list())
