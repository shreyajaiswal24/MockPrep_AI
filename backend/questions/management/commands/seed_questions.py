from django.core.management.base import BaseCommand
from questions.models import QuestionCategory, Question


SEED_DATA = {
    "Behavioral": {
        "description": "Questions about past experiences and soft skills",
        "icon": "users",
        "questions": [
            {
                "text": "Tell me about a time when you had to deal with a difficult team member. How did you handle the situation?",
                "difficulty": "medium",
                "time_limit": 120,
                "tips": "Use the STAR method: Situation, Task, Action, Result.",
            },
            {
                "text": "Describe a situation where you had to meet a tight deadline. What was your approach?",
                "difficulty": "easy",
                "time_limit": 120,
                "tips": "Focus on your time management and prioritization skills.",
            },
            {
                "text": "Give an example of a time you showed leadership, even if you weren't in a leadership role.",
                "difficulty": "medium",
                "time_limit": 120,
                "tips": "Highlight initiative and influence without authority.",
            },
            {
                "text": "Tell me about a failure you experienced. What did you learn from it?",
                "difficulty": "hard",
                "time_limit": 150,
                "tips": "Be honest and focus on growth and lessons learned.",
            },
        ],
    },
    "Technical": {
        "description": "Questions about technical knowledge and problem-solving",
        "icon": "code",
        "questions": [
            {
                "text": "Explain the difference between REST and GraphQL APIs. When would you choose one over the other?",
                "difficulty": "medium",
                "time_limit": 120,
                "tips": "Compare flexibility, performance, and use cases for each.",
            },
            {
                "text": "What is your approach to debugging a production issue that you cannot reproduce locally?",
                "difficulty": "hard",
                "time_limit": 150,
                "tips": "Discuss logging, monitoring, and systematic elimination.",
            },
            {
                "text": "Describe how you would design a scalable notification system.",
                "difficulty": "hard",
                "time_limit": 180,
                "tips": "Consider message queues, delivery channels, and user preferences.",
            },
            {
                "text": "What are the key principles of writing clean, maintainable code?",
                "difficulty": "easy",
                "time_limit": 120,
                "tips": "Mention SOLID principles, readability, and testing.",
            },
        ],
    },
    "Problem Solving": {
        "description": "Questions that test analytical thinking and creativity",
        "icon": "lightbulb",
        "questions": [
            {
                "text": "How would you improve the user onboarding experience for a complex SaaS product?",
                "difficulty": "medium",
                "time_limit": 150,
                "tips": "Think about progressive disclosure and user journey mapping.",
            },
            {
                "text": "If you had to reduce page load time by 50%, what strategies would you consider?",
                "difficulty": "hard",
                "time_limit": 150,
                "tips": "Cover caching, code splitting, CDN, image optimization, etc.",
            },
            {
                "text": "Describe how you would prioritize features for a new product with limited resources.",
                "difficulty": "medium",
                "time_limit": 120,
                "tips": "Mention frameworks like MoSCoW, RICE, or impact vs effort matrix.",
            },
            {
                "text": "Walk me through how you would estimate the number of gas stations in the United States.",
                "difficulty": "hard",
                "time_limit": 180,
                "tips": "Show your logical reasoning process step by step.",
            },
        ],
    },
    "Communication": {
        "description": "Questions that assess communication and presentation skills",
        "icon": "message-circle",
        "questions": [
            {
                "text": "Explain a complex technical concept to someone with no technical background.",
                "difficulty": "medium",
                "time_limit": 120,
                "tips": "Use analogies and avoid jargon.",
            },
            {
                "text": "How do you handle disagreements with stakeholders about project direction?",
                "difficulty": "medium",
                "time_limit": 120,
                "tips": "Emphasize active listening, data-driven arguments, and compromise.",
            },
            {
                "text": "Describe your approach to giving constructive feedback to a peer.",
                "difficulty": "easy",
                "time_limit": 120,
                "tips": "Mention specific, actionable, and kind feedback principles.",
            },
            {
                "text": "How would you present a project that failed to achieve its goals to senior leadership?",
                "difficulty": "hard",
                "time_limit": 150,
                "tips": "Focus on transparency, lessons learned, and next steps.",
            },
        ],
    },
}


class Command(BaseCommand):
    help = "Seed the database with sample interview questions"

    def handle(self, *args, **options):
        total_questions = 0

        for category_name, data in SEED_DATA.items():
            category, created = QuestionCategory.objects.get_or_create(
                name=category_name,
                defaults={
                    "description": data["description"],
                    "icon": data["icon"],
                },
            )
            action = "Created" if created else "Found existing"
            self.stdout.write(f"  {action} category: {category_name}")

            for q_data in data["questions"]:
                _, q_created = Question.objects.get_or_create(
                    text=q_data["text"],
                    defaults={
                        "category": category,
                        "difficulty": q_data["difficulty"],
                        "time_limit": q_data["time_limit"],
                        "tips": q_data["tips"],
                    },
                )
                if q_created:
                    total_questions += 1

        self.stdout.write(
            self.style.SUCCESS(f"\nSeeded {total_questions} new questions across {len(SEED_DATA)} categories.")
        )
