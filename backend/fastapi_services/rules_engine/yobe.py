from .base import SmallClaimsRule

class YobeSmallClaimsRule(SmallClaimsRule):
    state = "Yobe"
    max_amount = 5_000_000
    max_duration_days = 60
