from .base import SmallClaimsRule

class NasarawaSmallClaimsRule(SmallClaimsRule):
    state = "Nasarawa"
    max_amount = 5_000_000
    max_duration_days = 60
