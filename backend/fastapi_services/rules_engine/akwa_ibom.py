from .base import SmallClaimsRule

class AkwaIbomSmallClaimsRule(SmallClaimsRule):
    state = "AkwaIbom"
    max_amount = 5_000_000
    max_duration_days = 60
