# Court scrapers registry for easy extension
from .lagos import LagosHighCourtScraper
from .abuja import AbujaHighCourtScraper
from .kano import KanoHighCourtScraper
from .rivers import RiversHighCourtScraper

# Registry of all available court scrapers
COURT_SCRAPERS = {
    "lagos": LagosHighCourtScraper,
    "abuja": AbujaHighCourtScraper,
    "kano": KanoHighCourtScraper,
    "rivers": RiversHighCourtScraper,
}

# Template for adding new state scrapers
"""
To add a new state scraper:

1. Create a new file: sources/{state}.py
2. Implement a class inheriting from the pattern above
3. Add to COURT_SCRAPERS dict
4. Update routers.py imports

Example for Oyo State:
```python
class OyoHighCourtScraper:
    def __init__(self):
        self.base_url = "https://oyojudiciary.gov.ng"
        # ... implement scraping logic
```
"""