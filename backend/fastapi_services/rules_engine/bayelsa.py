from .base import SmallClaimsRule

class BayelsaSmallClaimsRule(SmallClaimsRule):
    state = "Bayelsa"
    max_amount = 5_000_000
    max_duration_days = 60
