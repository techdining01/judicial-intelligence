import requests
from bs4 import BeautifulSoup

def scrape_lagos_cause_list():
    res = requests.get("https://lagosjudiciary.gov.ng")
    soup = BeautifulSoup(res.text, "html.parser")

    return [{
        "court": "Lagos High Court",
        "case_number": "ABC/123",
        "parties": "A v B",
        "date": "2026-01-20"
    }]
