import uuid
from django.db import models
from django.conf import settings


class Interview(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("active", "Active"),
        ("closed", "Closed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    recruiter = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="created_interviews"
    )
    questions = models.ManyToManyField("questions.Question", blank=True, related_name="interviews")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    max_duration = models.IntegerField(default=3600, help_text="Max duration in seconds")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class CandidateSession(models.Model):
    STATUS_CHOICES = [
        ("not_started", "Not Started"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("reviewed", "Reviewed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    interview = models.ForeignKey(
        Interview, on_delete=models.CASCADE, related_name="sessions"
    )
    candidate = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="interview_sessions"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="not_started")
    overall_score = models.FloatField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        unique_together = ["interview", "candidate"]

    def __str__(self):
        return f"{self.candidate} - {self.interview.title}"


class QuestionResponse(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(
        CandidateSession, on_delete=models.CASCADE, related_name="responses"
    )
    question = models.ForeignKey(
        "questions.Question", on_delete=models.CASCADE, related_name="responses"
    )
    video_file = models.FileField(upload_to="videos/", blank=True, null=True)
    transcript = models.TextField(blank=True)
    ai_score = models.FloatField(null=True, blank=True)
    ai_feedback = models.TextField(blank=True)
    confidence_score = models.FloatField(null=True, blank=True)
    duration = models.IntegerField(default=0, help_text="Recording duration in seconds")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]
        unique_together = ["session", "question"]

    def __str__(self):
        return f"Response: {self.session.candidate} - {self.question.text[:40]}"


class MockSession(models.Model):
    SESSION_TYPE_CHOICES = [
        ("behavioral", "Behavioral"),
        ("technical", "Technical"),
        ("mixed", "Mixed"),
    ]
    STATUS_CHOICES = [
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("analyzed", "Analyzed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    candidate = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="mock_sessions"
    )
    session_type = models.CharField(max_length=20, choices=SESSION_TYPE_CHOICES, default="behavioral")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="in_progress")
    overall_score = models.FloatField(null=True, blank=True)
    overall_feedback = models.TextField(blank=True)
    behavioral_insights = models.JSONField(default=dict, blank=True)
    emotion_summary = models.JSONField(default=dict, blank=True)
    question_count = models.IntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Mock: {self.candidate} - {self.session_type} ({self.status})"


class MockResponse(models.Model):
    ANALYSIS_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("analyzing", "Analyzing"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(
        MockSession, on_delete=models.CASCADE, related_name="responses"
    )
    question = models.ForeignKey(
        "questions.Question", on_delete=models.CASCADE, related_name="mock_responses"
    )
    question_order = models.IntegerField(default=0)
    video_file = models.FileField(upload_to="mock_videos/", blank=True, null=True)
    transcript = models.TextField(blank=True)
    ai_score = models.FloatField(null=True, blank=True)
    ai_feedback = models.TextField(blank=True)
    confidence_score = models.FloatField(null=True, blank=True)
    emotion_data = models.JSONField(default=dict, blank=True)
    duration = models.IntegerField(default=0, help_text="Recording duration in seconds")
    analysis_status = models.CharField(max_length=20, choices=ANALYSIS_STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["question_order"]
        unique_together = ["session", "question"]

    def __str__(self):
        return f"MockResponse: {self.session.candidate} - Q{self.question_order}"
