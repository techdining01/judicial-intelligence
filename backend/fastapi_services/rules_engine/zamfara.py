from .base import SmallClaimsRule

class ZamfaraSmallClaimsRule(SmallClaimsRule):
    state = "Zamfara"
    max_amount = 5_000_000
    max_duration_days = 60
