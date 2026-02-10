from rest_framework import viewsets, permissions
from .models import QuestionCategory, Question
from .serializers import QuestionCategorySerializer, QuestionSerializer


class QuestionCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = QuestionCategory.objects.prefetch_related("questions")
    serializer_class = QuestionCategorySerializer
    permission_classes = [permissions.IsAuthenticated]


class QuestionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Question.objects.filter(is_active=True).select_related("category")
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["category", "difficulty"]
