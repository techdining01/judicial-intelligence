from .base import SmallClaimsRule

class BornoSmallClaimsRule(SmallClaimsRule):
    state = "Borno"
    max_amount = 5_000_000
    max_duration_days = 60
