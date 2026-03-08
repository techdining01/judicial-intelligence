
from .base import SmallClaimsRule

class EdoSmallClaimsRule(SmallClaimsRule):
    state = "Edo"
    max_amount = 5_000_000
    max_duration_days = 60  