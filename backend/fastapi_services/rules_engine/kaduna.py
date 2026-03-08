from .base import SmallClaimsRule


class KadunaSmallClaimsRule(SmallClaimsRule):
    state = "Kaduna"
    max_amount = 5_000_000
    max_duration_days = 60