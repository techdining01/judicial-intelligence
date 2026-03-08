from bs4 import BeautifulSoup
from .base import BaseScraper

class HighCourtScraper(BaseScraper):
    async def scrape_cause_list(self, url: str):
        html = await self.fetch(url)
        soup = BeautifulSoup(html, "html.parser")

        cases = []
        for row in soup.select("table tr")[1:]:
            cols = [c.text.strip() for c in row.find_all("td")]
            if len(cols) >= 4:
                cases.append({
                    "suit_number": cols[0],
                    "title": cols[1],
                    "court": cols[2],
                    "sitting_date": cols[3],
                })
        return cases
