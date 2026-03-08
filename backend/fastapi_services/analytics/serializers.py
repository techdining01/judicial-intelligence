# fastapi_ai/analytics/serializers.py

class CourtAnalyticsSerializer:
    @staticmethod
    def court_summary(court, metrics):
        return {
            "court_id": court.id,
            "court_name": court.name,
            "total_cases": metrics.get("total_cases"),
            "status_breakdown": metrics.get("status_breakdown"),
            "average_duration_days": metrics.get("avg_duration"),
        }

    @staticmethod
    def system_overview(data):
        return [
            {
                "court": item["court"],
                "total_cases": item["total_cases"],
            }
            for item in data
        ]
