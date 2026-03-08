from .base import SmallClaimsRule

class DeltaSmallClaimsRule(SmallClaimsRule):
    state = "Delta"
    max_amount = 5_000_000
    max_duration_days = 60
