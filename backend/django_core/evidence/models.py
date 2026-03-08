from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class ElectronicEvidence(models.Model):
    """
    Any electronic record relied upon in a case
    """
    case = models.ForeignKey(
        "courts.CourtCase",
        on_delete=models.CASCADE,
        related_name="electronic_evidence"
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    source_system = models.CharField(max_length=255)  # e.g. Email Server, CCTV, Database
    created_by = models.ForeignKey(User, on_delete=models.PROTECT)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class EvidenceSection84Report(models.Model):
    """
    Machine-verifiable compliance status
    """
    evidence = models.OneToOneField(
        ElectronicEvidence,
        on_delete=models.CASCADE,
        related_name="s84_report"
    )

    regularly_used = models.BooleanField()
    ordinary_course = models.BooleanField()
    system_integrity_ok = models.BooleanField()
    data_reproduction_ok = models.BooleanField()

    compliant = models.BooleanField(default=False)
    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"S.84 Report - {self.evidence}"
