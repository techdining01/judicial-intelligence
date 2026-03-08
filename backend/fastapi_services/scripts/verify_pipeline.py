from app.scraping.runner import run_scraping

cases = run_scraping()
assert len(cases) > 0
print("Scraping verified")
