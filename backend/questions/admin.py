from django.contrib import admin
from .models import QuestionCategory, Question


@admin.register(QuestionCategory)
class QuestionCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "description", "created_at")
    search_fields = ("name",)


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("text_short", "category", "difficulty", "time_limit", "is_active")
    list_filter = ("category", "difficulty", "is_active")
    search_fields = ("text",)

    def text_short(self, obj):
        return obj.text[:80]
    text_short.short_description = "Question"
