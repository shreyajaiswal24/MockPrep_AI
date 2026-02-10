from django.contrib import admin
from .models import Interview, CandidateSession, QuestionResponse, MockSession, MockResponse


@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    list_display = ("title", "recruiter", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("title",)
    filter_horizontal = ("questions",)


@admin.register(CandidateSession)
class CandidateSessionAdmin(admin.ModelAdmin):
    list_display = ("candidate", "interview", "status", "overall_score", "created_at")
    list_filter = ("status",)


@admin.register(QuestionResponse)
class QuestionResponseAdmin(admin.ModelAdmin):
    list_display = ("session", "question_short", "ai_score", "duration", "created_at")

    def question_short(self, obj):
        return obj.question.text[:60]
    question_short.short_description = "Question"


@admin.register(MockSession)
class MockSessionAdmin(admin.ModelAdmin):
    list_display = ("candidate", "session_type", "status", "overall_score", "question_count", "created_at")
    list_filter = ("status", "session_type")
    search_fields = ("candidate__email", "candidate__first_name")


@admin.register(MockResponse)
class MockResponseAdmin(admin.ModelAdmin):
    list_display = ("session", "question_order", "ai_score", "analysis_status", "duration", "created_at")
    list_filter = ("analysis_status",)
