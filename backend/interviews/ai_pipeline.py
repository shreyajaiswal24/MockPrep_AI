import json
import logging
import os

from django.conf import settings

logger = logging.getLogger(__name__)


def get_groq_client():
    from groq import Groq
    api_key = settings.GROQ_API_KEY
    if not api_key:
        raise ValueError("GROQ_API_KEY not configured")
    return Groq(api_key=api_key)


def transcribe_video(video_path: str) -> str:
    """Transcribe video/audio using Groq Whisper API."""
    client = get_groq_client()
    try:
        with open(video_path, "rb") as f:
            transcription = client.audio.transcriptions.create(
                file=(os.path.basename(video_path), f.read()),
                model="whisper-large-v3",
                response_format="text",
            )
        return transcription.strip() if isinstance(transcription, str) else str(transcription).strip()
    except Exception as e:
        logger.error(f"Transcription failed for {video_path}: {e}")
        return ""


def score_response(question_text: str, transcript: str, tips: str = "") -> dict:
    """Score an interview response using Groq LLM."""
    client = get_groq_client()

    prompt = f"""You are an expert interview coach. Analyze this interview response and provide a detailed evaluation.

Question: {question_text}

Candidate's Response (transcript): {transcript}

{f"Tips for this question: {tips}" if tips else ""}

Provide your evaluation as a JSON object with these exact fields:
- "score": overall score from 0-100
- "feedback": 2-3 sentences of constructive feedback
- "strengths": array of 2-3 specific strengths observed
- "improvements": array of 2-3 specific areas for improvement
- "communication_score": score from 0-100 for communication clarity
- "relevance_score": score from 0-100 for answer relevance to the question
- "structure_score": score from 0-100 for answer structure and organization

Return ONLY valid JSON, no additional text."""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=1000,
            response_format={"type": "json_object"},
        )
        result = json.loads(response.choices[0].message.content)
        return {
            "score": max(0, min(100, float(result.get("score", 50)))),
            "feedback": result.get("feedback", ""),
            "strengths": result.get("strengths", []),
            "improvements": result.get("improvements", []),
            "communication_score": max(0, min(100, float(result.get("communication_score", 50)))),
            "relevance_score": max(0, min(100, float(result.get("relevance_score", 50)))),
            "structure_score": max(0, min(100, float(result.get("structure_score", 50)))),
        }
    except Exception as e:
        logger.error(f"Scoring failed: {e}")
        return {
            "score": 0,
            "feedback": "Could not analyze this response.",
            "strengths": [],
            "improvements": [],
            "communication_score": 0,
            "relevance_score": 0,
            "structure_score": 0,
        }


def generate_behavioral_insights(responses_data: list) -> dict:
    """Generate overall behavioral insights from all responses."""
    client = get_groq_client()

    responses_summary = ""
    for i, r in enumerate(responses_data, 1):
        responses_summary += f"\nQuestion {i}: {r['question']}\nResponse: {r['transcript']}\nScore: {r['score']}/100\n"

    prompt = f"""You are an expert interview coach. Based on these interview responses, provide overall behavioral insights.

{responses_summary}

Provide your analysis as a JSON object with these exact fields:
- "overall_impression": 2-3 sentences summarizing the candidate's overall interview performance
- "communication_style": one of "confident", "articulate", "hesitant", "verbose", "concise"
- "strengths": array of 3-4 key strengths across all responses
- "development_areas": array of 2-3 areas that need improvement
- "interview_readiness": one of "ready", "almost_ready", "needs_practice", "beginner"
- "tips": array of 3-4 actionable tips for improvement

Return ONLY valid JSON, no additional text."""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=1000,
            response_format={"type": "json_object"},
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        logger.error(f"Behavioral insights generation failed: {e}")
        return {
            "overall_impression": "Unable to generate behavioral insights.",
            "communication_style": "unknown",
            "strengths": [],
            "development_areas": [],
            "interview_readiness": "needs_practice",
            "tips": ["Practice answering questions out loud", "Record yourself and review"],
        }


def calculate_confidence_from_emotions(emotion_data: dict) -> float:
    """Derive a confidence score from emotion detection data."""
    if not emotion_data:
        return 0.0

    averages = emotion_data.get("averages", {})
    if not averages:
        return 0.0

    # Confidence = high happy/neutral, low fearful/sad/angry
    happy = averages.get("happy", 0)
    neutral = averages.get("neutral", 0)
    surprised = averages.get("surprised", 0)
    fearful = averages.get("fearful", 0)
    sad = averages.get("sad", 0)
    angry = averages.get("angry", 0)
    disgusted = averages.get("disgusted", 0)

    positive = happy * 0.3 + neutral * 0.4 + surprised * 0.1
    negative = fearful * 0.3 + sad * 0.2 + angry * 0.1 + disgusted * 0.1

    confidence = min(100, max(0, (positive - negative) * 100 + 50))
    return round(confidence, 1)


def analyze_mock_session(mock_session):
    """Run full AI analysis pipeline on a mock session."""
    responses = mock_session.responses.all().select_related("question")
    all_scores = []
    responses_data = []

    for mock_response in responses:
        if not mock_response.video_file:
            continue

        mock_response.analysis_status = "analyzing"
        mock_response.save(update_fields=["analysis_status"])

        try:
            # Transcribe
            video_path = mock_response.video_file.path
            transcript = transcribe_video(video_path)
            mock_response.transcript = transcript

            # Score
            if transcript:
                score_result = score_response(
                    question_text=mock_response.question.text,
                    transcript=transcript,
                    tips=mock_response.question.tips,
                )
                mock_response.ai_score = score_result["score"]
                mock_response.ai_feedback = json.dumps(score_result)
                all_scores.append(score_result["score"])

                responses_data.append({
                    "question": mock_response.question.text,
                    "transcript": transcript,
                    "score": score_result["score"],
                })
            else:
                mock_response.ai_score = 0
                mock_response.ai_feedback = json.dumps({
                    "score": 0,
                    "feedback": "No speech detected in recording.",
                    "strengths": [],
                    "improvements": ["Ensure your microphone is working", "Speak clearly"],
                })

            # Confidence from emotions
            if mock_response.emotion_data:
                mock_response.confidence_score = calculate_confidence_from_emotions(
                    mock_response.emotion_data
                )

            mock_response.analysis_status = "completed"
            mock_response.save()

        except Exception as e:
            logger.error(f"Analysis failed for response {mock_response.id}: {e}")
            mock_response.analysis_status = "failed"
            mock_response.save(update_fields=["analysis_status"])

    # Generate session-level insights
    if responses_data:
        behavioral_insights = generate_behavioral_insights(responses_data)
        mock_session.behavioral_insights = behavioral_insights
        mock_session.overall_feedback = behavioral_insights.get("overall_impression", "")

    # Calculate overall score
    if all_scores:
        mock_session.overall_score = round(sum(all_scores) / len(all_scores), 1)

    # Aggregate emotion summary
    all_emotions = {}
    emotion_count = 0
    for mock_response in responses:
        avg = mock_response.emotion_data.get("averages", {})
        if avg:
            emotion_count += 1
            for emotion, value in avg.items():
                all_emotions[emotion] = all_emotions.get(emotion, 0) + value

    if emotion_count > 0:
        mock_session.emotion_summary = {
            emotion: round(value / emotion_count, 3)
            for emotion, value in all_emotions.items()
        }

    mock_session.status = "analyzed"
    mock_session.save()
