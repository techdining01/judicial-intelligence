from django.db import models

from django.db import models

class Statute(models.Model):
    title = models.CharField(max_length=255)
    citation = models.CharField(max_length=255)
    year = models.PositiveIntegerField()
    jurisdiction = models.CharField(max_length=100)  # Federal / State
    full_text = models.TextField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title



class CourtRule(models.Model):
    court_name = models.CharField(max_length=255)
    rule_title = models.CharField(max_length=255)
    order_number = models.CharField(max_length=50)
    rule_text = models.TextField()
    effective_from = models.DateField()
    effective_to = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.court_name} - {self.order_number}"



class SmallClaimsRule(models.Model):
    state = models.CharField(max_length=100)
    monetary_limit = models.DecimalField(max_digits=12, decimal_places=2)
    filing_fee = models.DecimalField(max_digits=10, decimal_places=2)
    allows_lawyers = models.BooleanField()
    procedure_steps = models.JSONField()

    def __str__(self):
        return f"{self.state} Small Claims"
