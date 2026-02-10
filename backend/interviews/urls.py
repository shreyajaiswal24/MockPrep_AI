from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    InterviewViewSet,
    CandidateSessionViewSet,
    VideoUploadView,
    SessionCompleteView,
    MockSessionListCreateView,
    MockSessionDetailView,
    MockVideoUploadView,
    MockSessionCompleteView,
    MockSessionResultsView,
)

router = DefaultRouter()
router.register("interviews", InterviewViewSet, basename="interview")
router.register("sessions", CandidateSessionViewSet, basename="session")

urlpatterns = [
    path("", include(router.urls)),
    path("upload-video/", VideoUploadView.as_view(), name="upload-video"),
    path("sessions/<uuid:session_id>/complete/", SessionCompleteView.as_view(), name="session-complete"),
    # Mock interview endpoints
    path("mock/sessions/", MockSessionListCreateView.as_view(), name="mock-sessions"),
    path("mock/sessions/<uuid:session_id>/", MockSessionDetailView.as_view(), name="mock-session-detail"),
    path("mock/upload-video/", MockVideoUploadView.as_view(), name="mock-upload-video"),
    path("mock/sessions/<uuid:session_id>/complete/", MockSessionCompleteView.as_view(), name="mock-session-complete"),
    path("mock/sessions/<uuid:session_id>/results/", MockSessionResultsView.as_view(), name="mock-session-results"),
]
