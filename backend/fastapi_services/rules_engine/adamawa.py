from .base import SmallClaimsRule

class AdamawaSmallClaimsRule(SmallClaimsRule):
    state = "Adamawa"
    max_amount = 5_000_000
    max_duration_days = 60
