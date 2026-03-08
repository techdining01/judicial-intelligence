from .base import SmallClaimsRule

class JigawaSmallClaimsRule(SmallClaimsRule):
    state = "Jigawa"
    max_amount = 5_000_000
    max_duration_days = 60
