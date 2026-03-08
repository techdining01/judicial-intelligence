from .base import SmallClaimsRule

class SokotoSmallClaimsRule(SmallClaimsRule):
    state = "Sokoto"
    max_amount = 5_000_000
    max_duration_days = 60
