import logging
from django.utils import timezone
from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Interview, CandidateSession, QuestionResponse, MockSession, MockResponse
from .serializers import (
    InterviewListSerializer,
    InterviewDetailSerializer,
    InterviewCreateSerializer,
    CandidateSessionListSerializer,
    CandidateSessionDetailSerializer,
    VideoUploadSerializer,
    MockSessionListSerializer,
    MockSessionDetailSerializer,
    MockSessionCreateSerializer,
    MockVideoUploadSerializer,
)
from .permissions import IsRecruiter, IsRecruiterOrReadOnly

logger = logging.getLogger(__name__)


class InterviewViewSet(viewsets.ModelViewSet):
    permission_classes = [IsRecruiterOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.role == "recruiter":
            return Interview.objects.filter(recruiter=user).prefetch_related("questions", "sessions")
        return Interview.objects.filter(status="active").prefetch_related("questions")

    def get_serializer_class(self):
        if self.action == "create":
            return InterviewCreateSerializer
        if self.action in ("retrieve",):
            return InterviewDetailSerializer
        return InterviewListSerializer


class CandidateSessionViewSet(viewsets.ModelViewSet):
    http_method_names = ["get", "post", "head", "options"]

    def get_queryset(self):
        user = self.request.user
        if user.role == "recruiter":
            return CandidateSession.objects.filter(
                interview__recruiter=user
            ).select_related("candidate", "interview").prefetch_related("responses")
        return CandidateSession.objects.filter(
            candidate=user
        ).select_related("candidate", "interview").prefetch_related("responses")

    def get_serializer_class(self):
        if self.action == "retrieve":
            return CandidateSessionDetailSerializer
        return CandidateSessionListSerializer

    def create(self, request, *args, **kwargs):
        interview_id = request.data.get("interview")
        try:
            interview = Interview.objects.get(id=interview_id, status="active")
        except Interview.DoesNotExist:
            return Response(
                {"error": "Interview not found or not active."},
                status=status.HTTP_404_NOT_FOUND,
            )

        session, created = CandidateSession.objects.get_or_create(
            interview=interview,
            candidate=request.user,
            defaults={"status": "in_progress", "started_at": timezone.now()},
        )

        if not created and session.status == "not_started":
            session.status = "in_progress"
            session.started_at = timezone.now()
            session.save()

        return Response(
            CandidateSessionDetailSerializer(session).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class VideoUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = VideoUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        session_id = serializer.validated_data["session_id"]
        question_id = serializer.validated_data["question_id"]
        video = serializer.validated_data["video"]
        duration = serializer.validated_data.get("duration", 0)

        try:
            session = CandidateSession.objects.get(
                id=session_id, candidate=request.user
            )
        except CandidateSession.DoesNotExist:
            return Response(
                {"error": "Session not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        response, created = QuestionResponse.objects.update_or_create(
            session=session,
            question_id=question_id,
            defaults={"video_file": video, "duration": duration},
        )

        return Response(
            {"id": str(response.id), "message": "Video uploaded successfully."},
            status=status.HTTP_201_CREATED,
        )


class SessionCompleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, session_id):
        try:
            session = CandidateSession.objects.get(
                id=session_id, candidate=request.user
            )
        except CandidateSession.DoesNotExist:
            return Response(
                {"error": "Session not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        session.status = "completed"
        session.completed_at = timezone.now()
        session.save()

        return Response(
            CandidateSessionDetailSerializer(session).data,
            status=status.HTTP_200_OK,
        )


class MockSessionListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        sessions = MockSession.objects.filter(candidate=request.user)
        serializer = MockSessionListSerializer(sessions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MockSessionCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        session_type = serializer.validated_data["session_type"]
        question_count = serializer.validated_data["question_count"]

        from questions.models import Question

        # Filter questions by category based on session_type
        questions_qs = Question.objects.filter(is_active=True)
        if session_type == "behavioral":
            questions_qs = questions_qs.filter(
                category__name__in=["Behavioral", "Communication"]
            )
        elif session_type == "technical":
            questions_qs = questions_qs.filter(
                category__name__in=["Technical", "Problem Solving", "System Design"]
            )
        # "mixed" uses all categories

        questions_list = list(questions_qs.order_by("?")[:question_count])

        if not questions_list:
            return Response(
                {"error": "No questions available for this session type."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        mock_session = MockSession.objects.create(
            candidate=request.user,
            session_type=session_type,
            question_count=len(questions_list),
        )

        for i, q in enumerate(questions_list):
            MockResponse.objects.create(
                session=mock_session,
                question=q,
                question_order=i,
            )

        return Response(
            MockSessionDetailSerializer(mock_session).data,
            status=status.HTTP_201_CREATED,
        )


class MockSessionDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, session_id):
        try:
            session = MockSession.objects.get(id=session_id, candidate=request.user)
        except MockSession.DoesNotExist:
            return Response(
                {"error": "Mock session not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(MockSessionDetailSerializer(session).data)


class MockVideoUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = MockVideoUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        session_id = serializer.validated_data["session_id"]
        question_id = serializer.validated_data["question_id"]
        video = serializer.validated_data["video"]
        duration = serializer.validated_data.get("duration", 0)
        emotion_data = serializer.validated_data.get("emotion_data", {})

        try:
            mock_session = MockSession.objects.get(
                id=session_id, candidate=request.user
            )
        except MockSession.DoesNotExist:
            return Response(
                {"error": "Mock session not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            mock_response = MockResponse.objects.get(
                session=mock_session, question_id=question_id
            )
        except MockResponse.DoesNotExist:
            return Response(
                {"error": "Question not found in this mock session."},
                status=status.HTTP_404_NOT_FOUND,
            )

        mock_response.video_file = video
        mock_response.duration = duration
        mock_response.emotion_data = emotion_data
        mock_response.save()

        return Response(
            {"id": str(mock_response.id), "message": "Video uploaded successfully."},
            status=status.HTTP_201_CREATED,
        )


class MockSessionCompleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, session_id):
        try:
            mock_session = MockSession.objects.get(
                id=session_id, candidate=request.user
            )
        except MockSession.DoesNotExist:
            return Response(
                {"error": "Mock session not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        mock_session.status = "completed"
        mock_session.completed_at = timezone.now()
        mock_session.save()

        # Run AI analysis synchronously
        try:
            from .ai_pipeline import analyze_mock_session
            analyze_mock_session(mock_session)
        except Exception as e:
            logger.error(f"AI analysis failed for mock session {session_id}: {e}")
            # Still return results even if AI fails
            mock_session.overall_feedback = "AI analysis could not be completed. Please try again."
            mock_session.save()

        mock_session.refresh_from_db()
        return Response(MockSessionDetailSerializer(mock_session).data)


class MockSessionResultsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, session_id):
        try:
            mock_session = MockSession.objects.get(
                id=session_id, candidate=request.user
            )
        except MockSession.DoesNotExist:
            return Response(
                {"error": "Mock session not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(MockSessionDetailSerializer(mock_session).data)
