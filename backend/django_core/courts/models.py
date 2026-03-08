from django.db import models


class Court(models.Model):
    SUPREME = "SCN"
    APPEAL = "COA"
    HIGH = "HCJ"

    COURT_TYPES = [
        (SUPREME, "Supreme Court"),
        (APPEAL, "Court of Appeal"),
        (HIGH, "High Court of Justice"),
    ]

    name = models.CharField(max_length=100)
    court_type = models.CharField(max_length=3, choices=COURT_TYPES)
    state = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.name}"


class CourtCase(models.Model):
    court = models.ForeignKey(Court, on_delete=models.CASCADE)
    suit_number = models.CharField(max_length=100)
    title = models.CharField(max_length=255)  # A v B
    filing_date = models.DateField()
    sitting_date = models.DateField()
    parties = models.TextField()
    summary = models.TextField(blank=True)
    status = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.suit_number} - {self.court}"


class CauseList(models.Model):
    court = models.ForeignKey(Court, on_delete=models.CASCADE)
    sitting_date = models.DateField()
    published_at = models.DateTimeField()
    source_url = models.URLField()
    courtcases = models.ManyToManyField(CourtCase, related_name="cause_lists")



class Judgment(models.Model):
    courtcases = models.ForeignKey(CourtCase, on_delete=models.CASCADE)
    judgment_date = models.DateField()
    document_url = models.URLField()
    is_final = models.BooleanField(default=False)
    summary = models.TextField(blank=True, null=True)