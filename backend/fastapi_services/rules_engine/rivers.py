from .base import SmallClaimsRule


class RiversSmallClaimsRule(SmallClaimsRule):
    state = "Rivers"
    max_amount = 3_000_000
    max_duration_days = 60