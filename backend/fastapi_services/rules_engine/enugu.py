from .base import SmallClaimsRule


class EnuguSmallClaimsRule(SmallClaimsRule):
    state = "Enugu"
    max_amount = 5_000_000
    max_duration_days = 60