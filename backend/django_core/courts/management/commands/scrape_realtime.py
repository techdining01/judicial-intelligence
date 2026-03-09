from django.core.management.base import BaseCommand
from courts.scraping_scheduler import CourtDataScraper
import json

class Command(BaseCommand):
    help = 'Trigger real-time scraping for dashboard data'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--mock',
            action='store_true',
            help='Use mock data for testing',
        )
    
    def handle(self, *args, **options):
        scraper = CourtDataScraper()
        
        if options['mock']:
            self.stdout.write("Using mock data for real-time dashboard...")
            mock_data = scraper.get_mock_realtime_data()
            
            # Process mock data
            for court, judgments in mock_data["judgments"].items():
                result = scraper._process_judgments(court, judgments)
                self.stdout.write(f"Processed {court}: {result}")
            
            for court, cause_lists in mock_data["cause_lists"].items():
                scraper._process_cause_lists(court, cause_lists)
                self.stdout.write(f"Processed cause lists for {court}")
            
            # Create alerts
            alerts_created = scraper._create_scraping_alerts({"scraped_at": "mock"})
            self.stdout.write(f"Created {alerts_created} alerts")
            
            self.stdout.write(self.style.SUCCESS('Mock real-time data created successfully!'))
        else:
            self.stdout.write("Triggering real-time scraping...")
            results = scraper.scrape_all_courts()
            
            self.stdout.write(json.dumps(results, indent=2))
            self.stdout.write(self.style.SUCCESS('Real-time scraping completed!'))
