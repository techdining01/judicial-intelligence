from django.db import models
from courts.models import CourtCase

class CaseSummary(models.Model):
    case = models.OneToOneField(CourtCase, on_delete=models.CASCADE)
    summary = models.TextField()
    plain_english = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Summary for {self.case.title}"



class CaseEmbedding(models.Model):
    case = models.OneToOneField(CourtCase, on_delete=models.CASCADE)
    vector = models.BinaryField()  # stored embedding
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Embedding for {self.case.title}"
    

    
class PrecedentResult(models.Model):
    source_case = models.ForeignKey(
        CourtCase, related_name="searched_from", on_delete=models.CASCADE
    )
    matched_case = models.ForeignKey(
        CourtCase, related_name="matched_to", on_delete=models.CASCADE
    )
    similarity_score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Precedent match: {self.source_case.title} -> {self.matched_case.title} (Score: {self.similarity_score})"


class AIVideoSimulation(models.Model):
    CATEGORY_CHOICES = [
        ("Constitutional", "Constitutional"),
        ("Civil", "Civil"),
        ("Criminal", "Criminal"),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    video_url = models.URLField(blank=True, null=True)
    ai_prompt_used = models.TextField(help_text="References to the Nigerian Constitution")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.category})"
