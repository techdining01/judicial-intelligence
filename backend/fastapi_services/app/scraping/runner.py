from .sources.lagos import scrape_lagos_cause_list
from .normalizer import normalize_case

def run_scraping():
    raw_cases = scrape_lagos_cause_list()
    return [normalize_case(c) for c in raw_cases]
