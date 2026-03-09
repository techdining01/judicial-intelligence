"""
Data Seeding Script for Judicial Intelligence Platform
Populates the database with sample courts, cases, and alerts for testing
"""

import os
import django
from datetime import datetime, timedelta
import random

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from courts.models import Court, CourtCase, Judgment, CauseList
from alerts.models import CourtAlert, AlertSubscription
from users.models import User

def create_sample_courts():
    """Create sample courts"""
    courts_data = [
        {
            "name": "Lagos State High Court, Ikeja",
            "court_type": "HCJ",
            "state": "Lagos"
        },
        {
            "name": "Lagos State High Court, Lagos Island",
            "court_type": "HCJ", 
            "state": "Lagos"
        },
        {
            "name": "Federal High Court, Lagos",
            "court_type": "HCJ",
            "state": "Lagos"
        },
        {
            "name": "Court of Appeal, Lagos Division",
            "court_type": "COA",
            "state": "Lagos"
        },
        {
            "name": "Kano State High Court",
            "court_type": "HCJ",
            "state": "Kano"
        },
        {
            "name": "Rivers State High Court, Port Harcourt",
            "court_type": "HCJ",
            "state": "Rivers"
        }
    ]
    
    created_courts = []
    for court_data in courts_data:
        court, created = Court.objects.get_or_create(
            name=court_data["name"],
            defaults=court_data
        )
        created_courts.append(court)
        print(f"{'Created' if created else 'Found'} court: {court.name}")
    
    return created_courts

def create_sample_cases(courts):
    """Create sample court cases"""
    case_types = [
        ("Contract Breach", "Pending"),
        ("Land Dispute", "Hearing"),
        ("Family Matter", "Settled"),
        ("Criminal Case", "Judgment Reserved"),
        ("Commercial Dispute", "Pending"),
        ("Tort Claim", "Hearing"),
        ("Constitutional Matter", "Pending"),
        ("Employment Dispute", "Settled"),
    ]
    
    cases = []
    for i, court in enumerate(courts):
        for j in range(3, 8):  # 3-7 cases per court
            case_type, status = random.choice(case_types)
            filing_date = datetime.now() - timedelta(days=random.randint(30, 365))
            sitting_date = filing_date + timedelta(days=random.randint(15, 90))
            
            case, created = CourtCase.objects.get_or_create(
                court=court,
                suit_number=f"Suit No. {court.court_type}/{i+1}/{j+1}/2024",
                defaults={
                    "title": f"{chr(65+i)} vs {chr(66+j)} - {case_type}",
                    "filing_date": filing_date.date(),
                    "sitting_date": sitting_date.date(),
                    "parties": f"Plaintiff: {chr(65+i)} Corporation\nDefendant: {chr(66+j)} Limited",
                    "summary": f"This is a sample case involving {case_type.lower()} between the parties. The matter was filed on {filing_date.strftime('%Y-%m-%d')} and is currently {status.lower()}.",
                    "status": status
                }
            )
            cases.append(case)
            print(f"{'Created' if created else 'Found'} case: {case.suit_number}")
    
    return cases

def create_sample_judgments(cases):
    """Create sample judgments"""
    judgment_count = 0
    for case in cases[:15]:  # Create judgments for first 15 cases
        if case.status in ["Settled", "Judgment Reserved"]:
            judgment_date = case.sitting_date + timedelta(days=random.randint(1, 30))
            
            judgment, created = Judgment.objects.get_or_create(
                courtcases=case,
                defaults={
                    "judgment_date": judgment_date,  # Removed .date()
                    "document_url": f"https://example.com/judgments/{case.id}.pdf",
                    "is_final": random.choice([True, False]),
                    "summary": f"Judgment delivered in favor of {'plaintiff' if random.choice([True, False]) else 'defendant'} based on the merits of the case."
                }
            )
            if created:
                judgment_count += 1
                print(f"Created judgment for: {case.suit_number}")
    
    return judgment_count

def create_sample_cause_lists(courts, cases):
    """Create sample cause lists"""
    cause_list_count = 0
    for court in courts:
        for i in range(2, 4):  # 2-3 cause lists per court
            sitting_date = datetime.now() + timedelta(days=random.randint(1, 30))
            
            cause_list, created = CauseList.objects.get_or_create(
                court=court,
                sitting_date=sitting_date,  # Removed .date()
                defaults={
                    "published_at": datetime.now() - timedelta(hours=random.randint(1, 24)),
                    "source_url": f"https://example.com/cause-lists/{court.id}/{i}.html"
                }
            )
            
            if created:
                # Add some cases to the cause list
                court_cases = [c for c in cases if c.court == court][:random.randint(3, 6)]
                cause_list.courtcases.add(*court_cases)
                cause_list_count += 1
                print(f"Created cause list for {court.name} on {sitting_date.strftime('%Y-%m-%d')}")
    
    return cause_list_count

def create_sample_alerts():
    """Create sample alerts"""
    alert_templates = [
        "New judgment filed in {court}",
        "Case hearing scheduled for {date}",
        "Cause list updated for {court}",
        "Judgment reserved in {case}",
        "Settlement reached in {case}",
    ]
    
    alert_count = 0
    for i in range(10):
        template = random.choice(alert_templates)
        alert = CourtAlert.objects.create(
            user=User.objects.first(),  # Use first user
            title=template.format(
                court=random.choice(["Lagos High Court", "Federal High Court", "Court of Appeal"]),
                date=datetime.now() + timedelta(days=random.randint(1, 7)),
                case=f"Suit No. HCJ/1/{i+1}/2024"
            ),
            content=f"This is an automated alert notification with details about the legal matter. The alert was generated on {datetime.now().strftime('%Y-%m-%d %H:%M')}.",
            delivered=random.choice([True, False])
        )
        alert_count += 1
    
    return alert_count

def create_sample_subscriptions():
    """Create sample alert subscriptions"""
    if User.objects.exists():
        user = User.objects.first()
        
        subscription, created = AlertSubscription.objects.get_or_create(
            user=user,
            defaults={
                "court": "Lagos State High Court",
                "keywords": ["contract", "land", "commercial"],
                "active": True
            }
        )
        print(f"{'Created' if created else 'Found'} alert subscription for {user.email}")

def main():
    """Main seeding function"""
    print("Starting data seeding for Judicial Intelligence Platform...")
    print("=" * 60)
    
    # Check if there's any existing data
    if Court.objects.exists():
        print("Existing data found. This will add to existing data.")
    
    # Create sample data
    courts = create_sample_courts()
    print(f"Courts: {len(courts)} total")
    
    cases = create_sample_cases(courts)
    print(f"Cases: {len(cases)} total")
    
    judgment_count = create_sample_judgments(cases)
    print(f"Judgments: {judgment_count} total")
    
    cause_list_count = create_sample_cause_lists(courts, cases)
    print(f"Cause Lists: {cause_list_count} total")
    
    alert_count = create_sample_alerts()
    print(f"Alerts: {alert_count} total")
    
    create_sample_subscriptions()
    print("Alert Subscriptions: created")
    
    print("\n" + "=" * 60)
    print("Data seeding completed successfully!")
    print("\nSummary:")
    print(f"- Courts: {Court.objects.count()}")
    print(f"- Cases: {CourtCase.objects.count()}")
    print(f"- Judgments: {Judgment.objects.count()}")
    print(f"- Cause Lists: {CauseList.objects.count()}")
    print(f"- Alerts: {CourtAlert.objects.count()}")
    
    print("\nYour admin dashboard should now show data!")
    print("Visit: http://127.0.0.1:8001/admin to manage the data")
    print("Visit: http://127.0.0.1:8001/api/courts/analytics/ to see analytics")

if __name__ == "__main__":
    main()
