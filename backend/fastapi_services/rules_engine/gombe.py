from .base import SmallClaimsRule

class GombeSmallClaimsRule(SmallClaimsRule):
    state = "Gombe"
    max_amount = 5_000_000
    max_duration_days = 60
