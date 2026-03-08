"""
Seed SmallClaimsRule for all 36 states + FCT (37 jurisdictions in Nigeria).
Aligns with FastAPI rules_engine limits where known (e.g. Kwara ₦3M).
"""
from decimal import Decimal
from django.core.management.base import BaseCommand
from law_engine.models import SmallClaimsRule

# 36 states + FCT. Kwara uses ₦3M per state guidelines; others default ₦5M.
NIGERIA_JURISDICTIONS = [
    ("Abia", 5_000_000),
    ("Adamawa", 5_000_000),
    ("Akwa Ibom", 5_000_000),
    ("Anambra", 5_000_000),
    ("Bauchi", 5_000_000),
    ("Bayelsa", 5_000_000),
    ("Benue", 5_000_000),
    ("Borno", 5_000_000),
    ("Cross River", 5_000_000),
    ("Delta", 5_000_000),
    ("Ebonyi", 5_000_000),
    ("Edo", 5_000_000),
    ("Ekiti", 5_000_000),
    ("Enugu", 5_000_000),
    ("FCT", 5_000_000),
    ("Gombe", 5_000_000),
    ("Imo", 5_000_000),
    ("Jigawa", 5_000_000),
    ("Kaduna", 5_000_000),
    ("Kano", 5_000_000),
    ("Katsina", 5_000_000),
    ("Kebbi", 5_000_000),
    ("Kogi", 5_000_000),
    ("Kwara", 3_000_000),
    ("Lagos", 5_000_000),
    ("Nasarawa", 5_000_000),
    ("Niger", 5_000_000),
    ("Ogun", 5_000_000),
    ("Ondo", 5_000_000),
    ("Osun", 5_000_000),
    ("Oyo", 5_000_000),
    ("Plateau", 5_000_000),
    ("Rivers", 5_000_000),
    ("Sokoto", 5_000_000),
    ("Taraba", 5_000_000),
    ("Yobe", 5_000_000),
    ("Zamfara", 5_000_000),
]

DEFAULT_FILING_FEE = Decimal("5000.00")
DEFAULT_PROCEDURE_STEPS = [
    "File claim at the appropriate court",
    "Serve defendant and await response",
    "Attend mediation/settlement (if applicable)",
    "Trial and judgment",
    "Enforcement if applicable",
]


class Command(BaseCommand):
    help = "Seed SmallClaimsRule for all Nigerian states and FCT (37 jurisdictions)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--update",
            action="store_true",
            help="Update existing rules (monetary_limit, filing_fee) instead of only creating missing ones.",
        )

    def handle(self, *args, **options):
        created = 0
        updated = 0
        for state_name, limit in NIGERIA_JURISDICTIONS:
            fee = DEFAULT_FILING_FEE
            allows_lawyers = True
            steps = DEFAULT_PROCEDURE_STEPS
            rule, was_created = SmallClaimsRule.objects.update_or_create(
                state=state_name,
                defaults={
                    "monetary_limit": Decimal(str(limit)),
                    "filing_fee": fee,
                    "allows_lawyers": allows_lawyers,
                    "procedure_steps": steps,
                },
            )
            if was_created:
                created += 1
            elif options.get("update"):
                updated += 1
        self.stdout.write(
            self.style.SUCCESS(
                f"Small claims: {created} created, {updated} updated. "
                f"Total jurisdictions: {len(NIGERIA_JURISDICTIONS)}."
            )
        )
