from rest_framework import serializers
from .models import Interview, CandidateSession, QuestionResponse, MockSession, MockResponse
from questions.serializers import QuestionSerializer
from accounts.serializers import UserSerializer


class QuestionResponseSerializer(serializers.ModelSerializer):
    question_detail = QuestionSerializer(source="question", read_only=True)

    class Meta:
        model = QuestionResponse
        fields = (
            "id", "session", "question", "question_detail", "video_file",
            "transcript", "ai_score", "ai_feedback", "confidence_score",
            "duration", "created_at",
        )
        read_only_fields = ("id", "transcript", "ai_score", "ai_feedback", "confidence_score", "created_at")


class CandidateSessionListSerializer(serializers.ModelSerializer):
    candidate = UserSerializer(read_only=True)
    interview_title = serializers.CharField(source="interview.title", read_only=True)
    response_count = serializers.IntegerField(source="responses.count", read_only=True)

    class Meta:
        model = CandidateSession
        fields = (
            "id", "interview", "interview_title", "candidate", "status",
            "overall_score", "started_at", "completed_at", "created_at", "response_count",
        )


class CandidateSessionDetailSerializer(serializers.ModelSerializer):
    candidate = UserSerializer(read_only=True)
    interview_title = serializers.CharField(source="interview.title", read_only=True)
    responses = QuestionResponseSerializer(many=True, read_only=True)

    class Meta:
        model = CandidateSession
        fields = (
            "id", "interview", "interview_title", "candidate", "status",
            "overall_score", "started_at", "completed_at", "created_at", "responses",
        )


class InterviewListSerializer(serializers.ModelSerializer):
    recruiter = UserSerializer(read_only=True)
    question_count = serializers.IntegerField(source="questions.count", read_only=True)
    session_count = serializers.IntegerField(source="sessions.count", read_only=True)

    class Meta:
        model = Interview
        fields = (
            "id", "title", "description", "recruiter", "status",
            "question_count", "session_count", "max_duration", "created_at",
        )


class InterviewDetailSerializer(serializers.ModelSerializer):
    recruiter = UserSerializer(read_only=True)
    questions_detail = QuestionSerializer(source="questions", many=True, read_only=True)
    sessions = CandidateSessionListSerializer(many=True, read_only=True)

    class Meta:
        model = Interview
        fields = (
            "id", "title", "description", "recruiter", "status", "questions",
            "questions_detail", "sessions", "max_duration", "created_at",
        )


class InterviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        fields = ("id", "title", "description", "questions", "status", "max_duration")

    def create(self, validated_data):
        questions = validated_data.pop("questions", [])
        interview = Interview.objects.create(
            recruiter=self.context["request"].user,
            **validated_data,
        )
        interview.questions.set(questions)
        return interview


class VideoUploadSerializer(serializers.Serializer):
    session_id = serializers.UUIDField()
    question_id = serializers.UUIDField()
    video = serializers.FileField()
    duration = serializers.IntegerField(required=False, default=0)


class MockResponseSerializer(serializers.ModelSerializer):
    question_detail = QuestionSerializer(source="question", read_only=True)

    class Meta:
        model = MockResponse
        fields = (
            "id", "session", "question", "question_detail", "question_order",
            "video_file", "transcript", "ai_score", "ai_feedback",
            "confidence_score", "emotion_data", "duration", "analysis_status",
            "created_at",
        )
        read_only_fields = (
            "id", "transcript", "ai_score", "ai_feedback",
            "confidence_score", "analysis_status", "created_at",
        )


class MockSessionListSerializer(serializers.ModelSerializer):
    candidate = UserSerializer(read_only=True)
    response_count = serializers.IntegerField(source="responses.count", read_only=True)

    class Meta:
        model = MockSession
        fields = (
            "id", "candidate", "session_type", "status", "overall_score",
            "question_count", "created_at", "completed_at", "response_count",
        )


class MockSessionDetailSerializer(serializers.ModelSerializer):
    candidate = UserSerializer(read_only=True)
    responses = MockResponseSerializer(many=True, read_only=True)

    class Meta:
        model = MockSession
        fields = (
            "id", "candidate", "session_type", "status", "overall_score",
            "overall_feedback", "behavioral_insights", "emotion_summary",
            "question_count", "created_at", "completed_at", "responses",
        )


class MockSessionCreateSerializer(serializers.Serializer):
    session_type = serializers.ChoiceField(choices=["behavioral", "technical", "mixed"], default="behavioral")
    question_count = serializers.IntegerField(min_value=3, max_value=10, default=5)


class MockVideoUploadSerializer(serializers.Serializer):
    session_id = serializers.UUIDField()
    question_id = serializers.UUIDField()
    video = serializers.FileField()
    duration = serializers.IntegerField(required=False, default=0)
    emotion_data = serializers.JSONField(required=False, default=dict)
