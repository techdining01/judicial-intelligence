class SmallClaimsRule:
    state = ""
    max_amount = 0
    max_duration_days = 0

    def validate(self, amount):
        return amount <= self.max_amount
