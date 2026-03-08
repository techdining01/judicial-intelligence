from .base import SmallClaimsRule

class FCTSmallClaimsRule(SmallClaimsRule):
    state = "FCT"
    max_amount = 3_000_000
    max_duration_days = 60