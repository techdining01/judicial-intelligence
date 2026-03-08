from .base import SmallClaimsRule

class OsunSmallClaimsRule(SmallClaimsRule):
    state = "Osun"
    max_amount = 5_000_000
    max_duration_days = 60