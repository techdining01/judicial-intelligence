from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from courts.models import Court, CourtCase

User = get_user_model()

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        admin, _ = User.objects.get_or_create(
            email="admin@court.ai",
            defaults={"role": "ADMIN"}
        )
        admin.set_password("password123")
        admin.save()

        court, _ = Court.objects.get_or_create(name="Lagos High Court")

        CourtCase.objects.get_or_create(
            court=court,
            suit_number="LD/123/2024",
            title="A v B",
            status="Pending",
        )

        self.stdout.write(self.style.SUCCESS("Seed complete"))
