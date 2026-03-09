"""
Real-time Scraping Scheduler
Automatically scrapes court data and updates dashboard
"""

import requests
import json
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
import time

from courts.models import Court, CourtCase, Judgment, CauseList
from alerts.models import CourtAlert

class CourtDataScraper:
    """Real-time court data scraper"""
    
    def __init__(self):
        self.fastapi_url = "http://127.0.0.1:8002"
        self.court_mapping = {
            "lagos": "Lagos State High Court",
            "abuja": "Federal High Court", 
            "kano": "Kano State High Court",
            "rivers": "Rivers State High Court"
        }
    
    def scrape_all_courts(self):
        """Scrape data from all courts and update database"""
        print(f"Starting real-time scraping at {datetime.now()}")
        
        results = {
            "scraped_at": datetime.now().isoformat(),
            "courts": {},
            "new_cases": 0,
            "new_judgments": 0,
            "new_cause_lists": 0,
            "alerts_created": 0
        }
        
        try:
            # Call FastAPI to scrape all courts
            response = requests.post(f"{self.fastapi_url}/scrape/scrape-all", timeout=60)
            
            if response.status_code == 200:
                scraped_data = response.json()
                
                # Process scraped judgments
                if "judgments" in scraped_data:
                    for court, judgments in scraped_data["judgments"].items():
                        if isinstance(judgments, list):
                            results["courts"][court] = self._process_judgments(court, judgments)
                
                # Process scraped cause lists
                if "cause_lists" in scraped_data:
                    for court, cause_lists in scraped_data["cause_lists"].items():
                        if isinstance(cause_lists, list):
                            self._process_cause_lists(court, cause_lists)
                
                # Create alerts for new data
                results["alerts_created"] = self._create_scraping_alerts(results)
                
            else:
                print(f"Scraping failed: {response.status_code}")
                results["error"] = f"FastAPI error: {response.status_code}"
                
        except Exception as e:
            print(f"Scraping error: {e}")
            results["error"] = str(e)
        
        return results
    
    def _process_judgments(self, court_name, judgments):
        """Process scraped judgments and update database"""
        court_name_full = self.court_mapping.get(court_name, court_name)
        
        try:
            # Use first() instead of get() to handle multiple courts
            court = Court.objects.filter(name__icontains=court_name.split()[0]).first()
            if not court:
                print(f"Court not found: {court_name_full}")
                return {"error": "Court not found"}
        except Court.DoesNotExist:
            print(f"Court not found: {court_name_full}")
            return {"error": "Court not found"}
        
        processed = 0
        for judgment_data in judgments:
            if isinstance(judgment_data, dict):
                # Create or update case
                case, created = CourtCase.objects.get_or_create(
                    court=court,
                    suit_number=judgment_data.get("suit_number", f"SCRAPED/{court_name}/{processed+1}"),
                    defaults={
                        "title": judgment_data.get("title", "Scraped Case"),
                        "filing_date": datetime.now().date(),
                        "sitting_date": datetime.now().date(),
                        "parties": judgment_data.get("parties", "Scraped Parties"),
                        "status": "Judgment Delivered",
                        "summary": judgment_data.get("summary", "")
                    }
                )
                
                # Create judgment if case was created or doesn't have one
                if created or not hasattr(case, 'judgment_set') or not case.judgment_set.exists():
                    Judgment.objects.get_or_create(
                        courtcases=case,
                        defaults={
                            "judgment_date": datetime.now().date(),
                            "document_url": judgment_data.get("document_url", ""),
                            "is_final": judgment_data.get("is_final", True),
                            "summary": judgment_data.get("summary", "")
                        }
                    )
                    processed += 1
        
        return {"processed": processed}
    
    def _process_cause_lists(self, court_name, cause_lists):
        """Process scraped cause lists and update database"""
        court_name_full = self.court_mapping.get(court_name, court_name)
        
        try:
            # Use first() instead of get() to handle multiple courts
            court = Court.objects.filter(name__icontains=court_name.split()[0]).first()
            if not court:
                print(f"Court not found: {court_name_full}")
                return
        except Court.DoesNotExist:
            print(f"Court not found: {court_name_full}")
            return
        
        for cause_list_data in cause_lists:
            if isinstance(cause_list_data, dict):
                CauseList.objects.get_or_create(
                    court=court,
                    sitting_date=datetime.now().date(),
                    defaults={
                        "published_at": datetime.now(),
                        "source_url": cause_list_data.get("source_url", "")
                    }
                )
    
    def _create_scraping_alerts(self, results):
        """Create alerts for newly scraped data"""
        alerts_created = 0
        
        # Create alert for scraping completion
        try:
            admin_user = CourtAlert.objects.first()
            if admin_user:
                CourtAlert.objects.create(
                    user=admin_user.user,
                    title=f"Real-time Scraping Completed",
                    content=f"Scraping completed at {datetime.now().strftime('%Y-%m-%d %H:%M')}. New data has been processed and is now available in the dashboard.",
                    delivered=True
                )
                alerts_created += 1
        except:
            pass
        
        return alerts_created
    
    def get_mock_realtime_data(self):
        """Generate mock real-time data for testing"""
        return {
            "judgments": {
                "lagos": [
                    {
                        "suit_number": f"SCRAPED/LAG/{datetime.now().strftime('%Y%m%d')}/001",
                        "title": "New Contract Case - Real-time",
                        "parties": "Tech Corp vs. Services Ltd",
                        "summary": "Judgment delivered in contract dispute",
                        "document_url": "https://example.com/judgment.pdf",
                        "is_final": True
                    }
                ],
                "kano": [
                    {
                        "suit_number": f"SCRAPED/KAN/{datetime.now().strftime('%Y%m%d')}/001", 
                        "title": "Land Dispute - Real-time",
                        "parties": "Property Owner vs. Developer",
                        "summary": "Case adjourned for further evidence",
                        "document_url": "https://example.com/judgment.pdf",
                        "is_final": False
                    }
                ]
            },
            "cause_lists": {
                "lagos": [
                    {
                        "source_url": "https://lagosjudiciary.gov.ng/cause-list/today",
                        "cases": ["Case A", "Case B", "Case C"]
                    }
                ]
            }
        }

class Command(BaseCommand):
    help = 'Run real-time scraping for court data'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--mock',
            action='store_true',
            help='Use mock data instead of real scraping',
        )
    
    def handle(self, *args, **options):
        scraper = CourtDataScraper()
        
        if options['mock']:
            # Use mock data for testing
            mock_data = scraper.get_mock_realtime_data()
            self.stdout.write("Using mock data for testing...")
            
            # Process mock judgments
            for court, judgments in mock_data["judgments"].items():
                result = scraper._process_judgments(court, judgments)
                self.stdout.write(f"Processed {court}: {result}")
            
            # Process mock cause lists  
            for court, cause_lists in mock_data["cause_lists"].items():
                scraper._process_cause_lists(court, cause_lists)
                self.stdout.write(f"Processed cause lists for {court}")
            
            self.stdout.write(self.style.SUCCESS('Mock data processing completed!'))
        else:
            # Real scraping
            results = scraper.scrape_all_courts()
            
            self.stdout.write(json.dumps(results, indent=2))
            self.stdout.write(self.style.SUCCESS('Real-time scraping completed!'))

def run_continuous_scraping():
    """Run scraping continuously every 5 minutes"""
    scraper = CourtDataScraper()
    
    while True:
        try:
            print(f"Running scheduled scraping at {datetime.now()}")
            results = scraper.scrape_all_courts()
            print(f"Scraping results: {results}")
            
            # Wait 5 minutes before next scrape
            time.sleep(300)
            
        except KeyboardInterrupt:
            print("Scraping stopped by user")
            break
        except Exception as e:
            print(f"Scraping error: {e}")
            time.sleep(60)  # Wait 1 minute before retry

if __name__ == "__main__":
    # For testing
    scraper = CourtDataScraper()
    results = scraper.scrape_all_courts()
    print(json.dumps(results, indent=2))
