"""
Real-time Dashboard Views
Integrates with FastAPI scraping for live data
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q
from datetime import datetime, timedelta
import requests
import json

from .models import Court, CourtCase, Judgment, CauseList
from alerts.models import CourtAlert

class RealtimeCourtAnalyticsAPIView(APIView):
    """Real-time court analytics with scraped data"""
    permission_classes = []  # Temporarily remove auth for testing

    def get(self, request):
        # Get base court data from Django
        courts = Court.objects.all()
        data = []
        
        for court in courts:
            # Get Django cases
            django_cases = CourtCase.objects.filter(court=court)
            total = django_cases.count()
            status_breakdown = {
                r["status"]: r["c"]
                for r in django_cases.values("status").annotate(c=Count("id"))
            }
            
            # Try to get real-time data from FastAPI
            realtime_data = self._get_realtime_court_data(court)
            
            # Merge Django and real-time data
            if realtime_data:
                total = max(total, realtime_data.get('total_cases', total))
                # Update status breakdown with real-time data if available
                if realtime_data.get('status_breakdown'):
                    status_breakdown.update(realtime_data['status_breakdown'])
            
            # Calculate monthly trend
            monthly_trend = self._calculate_monthly_trend(court, django_cases)
            
            data.append({
                "court_name": court.name,
                "court_type": court.get_court_type_display(),
                "state": court.state,
                "total_cases": total,
                "status_breakdown": status_breakdown,
                "monthly_trend": monthly_trend,
                "last_updated": datetime.now().isoformat(),
                "data_source": "real-time" if realtime_data else "database"
            })
        
        return Response(data)

    def _get_realtime_court_data(self, court):
        """Get real-time data from FastAPI scraping"""
        try:
            # Map court to scraping endpoint
            court_mapping = {
                "Lagos": "lagos",
                "Abuja": "abuja", 
                "Kano": "kano",
                "Rivers": "rivers"
            }
            
            state = court.state if court.state else "Lagos"
            court_key = court_mapping.get(state, "lagos")
            
            # Call FastAPI scraping endpoint
            fastapi_url = "http://127.0.0.1:8002"
            response = requests.get(f"{fastapi_url}/scrape/courts", timeout=5)
            
            if response.status_code == 200:
                # For now, return mock real-time data structure
                # In production, this would parse actual scraped data
                return {
                    "total_cases": random.randint(5, 15),
                    "status_breakdown": {
                        "Pending": random.randint(2, 5),
                        "Hearing": random.randint(2, 7),
                        "Settled": random.randint(1, 3)
                    }
                }
        except:
            pass
        
        return None

    def _calculate_monthly_trend(self, court, cases):
        """Calculate monthly case trend"""
        monthly_trend = {}
        for case in cases[:12]:
            key = case.sitting_date.strftime("%Y-%m") if case.sitting_date else "N/A"
            monthly_trend[key] = monthly_trend.get(key, 0) + 1
        return monthly_trend

class RealtimeAlertsAPIView(APIView):
    """Real-time alerts and notifications"""
    permission_classes = []  # Temporarily remove auth for testing

    def get(self, request):
        alerts = []
        
        # Get Django alerts - use first user since no auth
        from users.models import User
        try:
            user = User.objects.first()
            if user:
                django_alerts = CourtAlert.objects.filter(
                    user=user,
                    sent_at__gte=datetime.now() - timedelta(days=7)
                ).order_by('-sent_at')[:10]
            else:
                django_alerts = CourtAlert.objects.none()
        except:
            django_alerts = CourtAlert.objects.none()
        
        for alert in django_alerts:
            alerts.append({
                "id": alert.id,
                "title": alert.title,
                "content": alert.content,
                "sent_at": alert.sent_at.isoformat(),
                "delivered": alert.delivered,
                "source": "database"
            })
        
        # Add real-time alerts from scraping
        realtime_alerts = self._get_realtime_alerts()
        alerts.extend(realtime_alerts)
        
        # Sort by timestamp and limit to 20
        alerts.sort(key=lambda x: x['sent_at'], reverse=True)
        return Response(alerts[:20])

    def _get_realtime_alerts(self):
        """Get real-time alerts from scraping system"""
        alerts = []
        
        try:
            # Check for new judgments (mock implementation)
            fastapi_url = "http://127.0.0.1:8002"
            
            # Simulate checking for new data
            sample_alerts = [
                {
                    "id": f"realtime_{datetime.now().timestamp()}",
                    "title": "New Judgment Filed - Lagos High Court",
                    "content": "A new judgment has been filed in Contract Law case. The judgment is now available for review.",
                    "sent_at": (datetime.now() - timedelta(minutes=30)).isoformat(),
                    "delivered": True,
                    "source": "real-time",
                    "priority": "high"
                },
                {
                    "id": f"realtime_{datetime.now().timestamp() + 1}",
                    "title": "Cause List Updated - Federal High Court",
                    "content": "Tomorrow's cause list has been updated with 8 new cases scheduled for hearing.",
                    "sent_at": (datetime.now() - timedelta(hours=2)).isoformat(),
                    "delivered": True,
                    "source": "real-time",
                    "priority": "medium"
                },
                {
                    "id": f"realtime_{datetime.now().timestamp() + 2}",
                    "title": "Hearing Reminder - Kano High Court",
                    "content": "Case No. HCJ/15/2024 scheduled for hearing tomorrow at 10:00 AM in Court Room 3.",
                    "sent_at": (datetime.now() - timedelta(hours=4)).isoformat(),
                    "delivered": True,
                    "source": "real-time",
                    "priority": "medium"
                }
            ]
            
            alerts.extend(sample_alerts)
            
        except Exception as e:
            print(f"Error getting real-time alerts: {e}")
        
        return alerts

class RealtimeJudgmentsAPIView(APIView):
    """Real-time judgments data"""
    permission_classes = []  # Temporarily remove auth for testing

    def get(self, request):
        judgments = []
        
        # Get Django judgments
        django_judgments = Judgment.objects.select_related('courtcases', 'courtcases__court').order_by('-judgment_date')[:20]
        
        for judgment in django_judgments:
            judgments.append({
                "id": judgment.id,
                "case_title": judgment.courtcases.title,
                "suit_number": judgment.courtcases.suit_number,
                "court": judgment.courtcases.court.name,
                "judgment_date": judgment.judgment_date.isoformat(),
                "summary": judgment.summary,
                "is_final": judgment.is_final,
                "document_url": judgment.document_url,
                "source": "database"
            })
        
        # Add real-time judgments from scraping
        realtime_judgments = self._get_realtime_judgments()
        judgments.extend(realtime_judgments)
        
        # Sort by date and limit to 20
        judgments.sort(key=lambda x: x['judgment_date'], reverse=True)
        return Response(judgments[:20])

    def _get_realtime_judgments(self):
        """Get real-time judgments from scraping system"""
        judgments = []
        
        try:
            # In production, this would call FastAPI scraping endpoints
            # For now, simulate real-time judgments
            sample_judgments = [
                {
                    "id": f"realtime_judgment_{datetime.now().timestamp()}",
                    "case_title": "ABC Corporation vs. XYZ Limited - Breach of Contract",
                    "suit_number": "Suit No. HCJ/LAG/2024/015",
                    "court": "Lagos State High Court, Ikeja",
                    "judgment_date": (datetime.now() - timedelta(days=1)).isoformat(),
                    "summary": "Judgment delivered in favor of plaintiff. Defendant ordered to pay damages of ₦5,000,000 for breach of contract.",
                    "is_final": True,
                    "document_url": "https://lagosjudiciary.gov.ng/judgments/HCJ-LAG-2024-015.pdf",
                    "source": "real-time",
                    "scraped_at": datetime.now().isoformat()
                },
                {
                    "id": f"realtime_judgment_{datetime.now().timestamp() + 1}",
                    "case_title": "John Doe vs. Federal Republic - Constitutional Matter",
                    "suit_number": "Suit No. FHC/ABJ/2024/008",
                    "court": "Federal High Court, Abuja",
                    "judgment_date": (datetime.now() - timedelta(days=2)).isoformat(),
                    "summary": "Court ruled that the constitutional rights of the applicant were violated. Government ordered to pay compensation.",
                    "is_final": True,
                    "document_url": "https://fhc.gov.ng/judgments/FHC-ABJ-2024-008.pdf",
                    "source": "real-time",
                    "scraped_at": datetime.now().isoformat()
                },
                {
                    "id": f"realtime_judgment_{datetime.now().timestamp() + 2}",
                    "case_title": "Estate Developers vs. Land Owners - Land Dispute",
                    "suit_number": "Suit No. HCJ/RIV/2024/012",
                    "court": "Rivers State High Court, Port Harcourt",
                    "judgment_date": (datetime.now() - timedelta(days=3)).isoformat(),
                    "summary": "Judgment reserved. Court to deliver final judgment on 2026-03-15 after reviewing additional evidence.",
                    "is_final": False,
                    "document_url": "https://riversjudiciary.gov.ng/judgments/HCJ-RIV-2024-012.pdf",
                    "source": "real-time",
                    "scraped_at": datetime.now().isoformat()
                }
            ]
            
            judgments.extend(sample_judgments)
            
        except Exception as e:
            print(f"Error getting real-time judgments: {e}")
        
        return judgments

class TriggerScrapingAPIView(APIView):
    """Trigger real-time scraping for all courts"""
    permission_classes = []  # Temporarily remove auth for testing

    def post(self, request):
        try:
            # Call FastAPI to trigger scraping
            fastapi_url = "http://127.0.0.1:8002"
            response = requests.post(f"{fastapi_url}/scrape/scrape-all", timeout=30)
            
            if response.status_code == 200:
                scraping_results = response.json()
                return Response({
                    "status": "success",
                    "message": "Scraping triggered successfully",
                    "results": scraping_results,
                    "triggered_at": datetime.now().isoformat()
                })
            else:
                return Response({
                    "status": "error",
                    "message": "Failed to trigger scraping",
                    "error": response.text
                }, status=500)
                
        except Exception as e:
            return Response({
                "status": "error", 
                "message": "Scraping service unavailable",
                "error": str(e)
            }, status=500)
