from .base import SmallClaimsRule

class BauchiSmallClaimsRule(SmallClaimsRule):
    state = "Bauchi"
    max_amount = 5_000_000
    max_duration_days = 60
