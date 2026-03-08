from .base import SmallClaimsRule


class OyoSmallClaimsRule(SmallClaimsRule):
    state = "Oyo"
    max_amount = 5_000_000
    max_duration_days = 60
