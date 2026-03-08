from .base import SmallClaimsRule


class KwaraSmallClaimsRule(SmallClaimsRule):
    state = "Kwara"
    max_amount = 3_000_000
    max_duration_days = 60