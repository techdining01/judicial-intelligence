from .base import SmallClaimsRule

class CrossRiverSmallClaimsRule(SmallClaimsRule):
    state = "CrossRiver"
    max_amount = 5_000_000
    max_duration_days = 60
