from django.db import models

from django.db import models
from courts.models import Case

class CaseSummary(models.Model):
    case = models.OneToOneField(Case, on_delete=models.CASCADE)
    summary = models.TextField()
    plain_english = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Summary for {self.case.title}"


class CaseEmbedding(models.Model):
    case = models.OneToOneField(Case, on_delete=models.CASCADE)
    vector = models.BinaryField()  # stored embedding
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Embedding for {self.case.title}"
    
class PrecedentResult(models.Model):
    source_case = models.ForeignKey(
        Case, related_name="searched_from", on_delete=models.CASCADE
    )
    matched_case = models.ForeignKey(
        Case, related_name="matched_to", on_delete=models.CASCADE
    )
    similarity_score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Precedent match: {self.source_case.title} -> {self.matched_case.title} (Score: {self.similarity_score})"
