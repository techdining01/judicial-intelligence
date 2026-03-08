from .base import SmallClaimsRule

class BenueSmallClaimsRule(SmallClaimsRule):
    state = "Benue"
    max_amount = 5_000_000
    max_duration_days = 60
