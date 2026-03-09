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


class SimulationScenario(models.Model):
    title = models.CharField(max_length=255)
    legal_category = models.CharField(max_length=100)  # e.g., Constitutional, Civil, Criminal
    case_background = models.TextField()
    governing_laws = models.TextField()  # e.g., Section 221 Nigerian Constitution
    judge_persona = models.CharField(max_length=100)  # e.g., Strict constitutionalist
    difficulty_level = models.CharField(max_length=50, choices=[
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class SimulationSession(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    scenario = models.ForeignKey(SimulationScenario, on_delete=models.CASCADE)
    session_start = models.DateTimeField(auto_now_add=True)
    session_end = models.DateTimeField(null=True, blank=True)
    score = models.FloatField(null=True, blank=True)
    ai_feedback = models.TextField(blank=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"Session for {self.user.email} on {self.scenario.title}"


class SimulationMessage(models.Model):
    session = models.ForeignKey(SimulationSession, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=[
        ('user', 'User'),
        ('judge', 'Judge'),
    ])
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.role}: {self.message[:50]}..."

    def __str__(self):
        return f"{self.title} ({self.category})"
