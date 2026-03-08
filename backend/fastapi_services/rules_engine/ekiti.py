from .base import SmallClaimsRule


class EkitiSmallClaimsRule(SmallClaimsRule):
    state = "Ekiti"
    max_amount = 5_000_000
    max_duration_days = 60