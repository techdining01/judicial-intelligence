from .models import SmallClaimsRule

def is_small_claims_eligible(state, claim_amount):
    try:
        rule = SmallClaimsRule.objects.get(state=state)
        return claim_amount <= rule.monetary_limit
    except SmallClaimsRule.DoesNotExist:
        return False
