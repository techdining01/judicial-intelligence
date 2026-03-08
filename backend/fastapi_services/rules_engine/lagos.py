from .base import SmallClaimsRule


class LagosSmallClaimsRule(SmallClaimsRule):
    state = "Lagos"
    max_amount = 5_000_000
    max_duration_days = 60
