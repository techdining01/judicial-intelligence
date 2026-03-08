from .base import SmallClaimsRule

class TarabaSmallClaimsRule(SmallClaimsRule):
    state = "Taraba"
    max_amount = 5_000_000
    max_duration_days = 60
