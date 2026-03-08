from .base import SmallClaimsRule

class NigerSmallClaimsRule(SmallClaimsRule):
    state = "Niger"
    max_amount = 5_000_000
    max_duration_days = 60
