from rest_framework import serializers
from .models import QuestionCategory, Question


class QuestionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Question
        fields = ("id", "text", "category", "category_name", "difficulty", "time_limit", "tips", "is_active")


class QuestionCategorySerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    question_count = serializers.IntegerField(source="questions.count", read_only=True)

    class Meta:
        model = QuestionCategory
        fields = ("id", "name", "description", "icon", "questions", "question_count")
