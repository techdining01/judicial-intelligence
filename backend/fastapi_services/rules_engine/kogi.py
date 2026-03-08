from .base import SmallClaimsRule

class KogiSmallClaimsRule(SmallClaimsRule):
    state = "Kogi"
    max_amount = 5_000_000
    max_duration_days = 60
