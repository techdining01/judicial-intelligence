from .base import SmallClaimsRule

class KanoSmallClaimsRule(SmallClaimsRule):
    state = "Kano"
    max_amount = 3_000_000
    max_duration_days = 60