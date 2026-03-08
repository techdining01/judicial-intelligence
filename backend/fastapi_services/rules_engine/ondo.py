from .base import SmallClaimsRule

class OndoSmallClaimsRule(SmallClaimsRule):
    state = "Ondo"
    max_amount = 5_000_000
    max_duration_days = 60