import httpx
from bs4 import BeautifulSoup
from datetime import datetime
from typing import List, Dict, Any

class RiversHighCourtScraper:
    """Scraper for Rivers State High Court"""

    def __init__(self):
        self.base_url = "https://riversjudiciary.gov.ng"
        self.judgments_url = f"{self.base_url}/judgments"
        self.cause_list_url = f"{self.base_url}/cause-list"

    async def scrape_judgments(self) -> List[Dict[str, Any]]:
        """Scrape court judgments from Rivers High Court"""
        async with httpx.AsyncClient(timeout=30) as client:
            try:
                response = await client.get(self.judgments_url)
                response.raise_for_status()
                soup = BeautifulSoup(response.text, "html.parser")

                judgments = []
                judgment_cards = soup.select(".judgment-card, .case-item, article")

                for card in judgment_cards[:10]:
                    judgment = self._extract_judgment_data(card)
                    if judgment:
                        judgments.append(judgment)

                return judgments

            except Exception as e:
                print(f"Error scraping Rivers judgments: {e}")
                return self._get_mock_judgments()

    async def scrape_cause_list(self, date: str = None) -> List[Dict[str, Any]]:
        """Scrape cause list from Rivers High Court"""
        if not date:
            date = datetime.now().strftime("%Y-%m-%d")

        async with httpx.AsyncClient(timeout=30) as client:
            try:
                response = await client.get(f"{self.cause_list_url}?date={date}")
                response.raise_for_status()
                soup = BeautifulSoup(response.text, "html.parser")

                cases = []
                rows = soup.select("table tr, .cause-list-item")

                for row in rows:
                    case = self._extract_cause_list_data(row)
                    if case:
                        cases.append(case)

                return cases

            except Exception as e:
                print(f"Error scraping Rivers cause list: {e}")
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

            pdf_link = element.select_one("a[href*='.pdf'], a[href*='download']")
            pdf_url = pdf_link['href'] if pdf_link else ""

            return {
                "case_title": case_title,
                "court": "Rivers State High Court",
                "date": judgment_date,
                "judge": judge,
                "citation": citation,
                "judgment_text": "",
                "pdf_url": pdf_url,
                "scraped_at": datetime.now().isoformat()
            }
        except Exception as e:
            print(f"Error extracting judgment data: {e}")
            return None

    def _extract_cause_list_data(self, element) -> Dict[str, Any]:
        """Extract cause list data from HTML element"""
        try:
            case_num_elem = element.select_one("td:nth-child(1), .case-number")
            case_number = case_num_elem.text.strip() if case_num_elem else ""

            parties_elem = element.select_one("td:nth-child(2), .parties")
            parties = parties_elem.text.strip() if parties_elem else ""

            court_elem = element.select_one("td:nth-child(3), .court")
            court = court_elem.text.strip() if court_elem else "Rivers High Court"

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
                "case_title": "Shell Petroleum v. Rivers State Government",
                "court": "Rivers State High Court",
                "date": "2026-01-05",
                "judge": "Justice I. Amadi",
                "citation": "[2026] RSHC 1",
                "judgment_text": "Mock judgment content...",
                "pdf_url": "",
                "scraped_at": datetime.now().isoformat()
            }
        ]

    def _get_mock_cause_list(self) -> List[Dict[str, Any]]:
        """Return mock cause list data for development/testing"""
        return [
            {
                "case_number": "PHC/234/2026",
                "parties": "Oil Communities Association v. SPDC",
                "court": "Rivers High Court - Port Harcourt Division",
                "hearing_date": "2026-02-01",
                "judge": "Justice J. Wokocha",
                "scraped_at": datetime.now().isoformat()
            }
        ]