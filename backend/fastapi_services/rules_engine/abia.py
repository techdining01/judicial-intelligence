from .base import SmallClaimsRule

class AbiaSmallClaimsRule(SmallClaimsRule):
    state = "Abia"
    max_amount = 5_000_000
    max_duration_days = 60
