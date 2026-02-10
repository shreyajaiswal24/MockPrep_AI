# MockPrep.AI - AI Mock Interview Practice Platform

An AI-powered mock interview practice platform built for college students and working professionals. Practice real interview questions on camera, get instant AI scoring, facial emotion analysis, and personalized feedback to ace your next interview.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Django](https://img.shields.io/badge/Django-4.2-green?logo=django)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)
![Groq](https://img.shields.io/badge/Groq-Whisper%20%2B%20LLM-orange)

---

## Features

### AI-Powered Mock Interviews
- Choose from **Behavioral**, **Technical**, or **Mixed** interview types
- Select 3-10 questions per session from a curated question bank
- Record video answers in-browser with a real interview timer

### Instant AI Scoring & Feedback
- Automatic speech-to-text transcription using **Groq Whisper**
- AI scoring (out of 100) with sub-scores for Communication, Relevance, Structure, and Confidence
- Personalized strengths, improvement areas, and actionable tips per question

### Facial Emotion Analysis
- Real-time emotion detection during recording using **face-api.js**
- Tracks expressions: happy, sad, angry, surprised, neutral, fearful, disgusted
- Emotion summary and confidence score included in results

### Behavioral Insights
- AI-generated overall interview assessment
- Communication style analysis
- Interview readiness level (Beginner / Intermediate / Ready / Strong)
- Key strengths and development areas

### Recruiter Dashboard
- Create custom interviews with your own questions
- Share interview links with candidates
- Review candidate video responses and scores

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| Next.js 14 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| Framer Motion | Animations |
| face-api.js | Browser-side facial emotion detection |
| Axios | API communication |

### Backend
| Technology | Purpose |
|-----------|---------|
| Django 4.2 | Web framework |
| Django REST Framework | REST API |
| SimpleJWT | JWT authentication |
| Groq API | Whisper transcription + LLM scoring |
| PostgreSQL | Production database |
| WhiteNoise | Static file serving |

---

## Project Structure

```
MockPrep_AI/
├── backend/                    # Django REST API
│   ├── accounts/               # User auth (JWT, registration, login)
│   ├── interviews/             # Interview sessions, mock sessions, AI pipeline
│   ├── questions/              # Question bank & seed data
│   ├── interview_ai/           # Django project settings
│   ├── build.sh                # Render build script
│   └── requirements.txt
├── frontend/                   # Next.js 14 App
│   ├── src/
│   │   ├── app/                # Pages (App Router)
│   │   │   ├── (dashboard)/    # Dashboard layout & pages
│   │   │   ├── mock/           # Mock interview flow
│   │   │   │   ├── session/    # AI mock interview room
│   │   │   │   └── results/    # Score & insights dashboard
│   │   │   ├── interview/      # Recruiter interview room
│   │   │   ├── login/          # Login page
│   │   │   └── signup/         # Registration page
│   │   ├── components/         # Reusable UI components
│   │   ├── hooks/              # Custom hooks (video, face detection)
│   │   ├── context/            # Auth context provider
│   │   ├── lib/                # API client & utilities
│   │   └── types/              # TypeScript interfaces
│   └── public/models/          # face-api.js model weights
└── render.yaml                 # Render deployment blueprint
```

---

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm

### Backend Setup

```bash
cd backend

# Create virtual environment (optional)
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python3 manage.py migrate

# Seed the question bank
python3 manage.py seed_questions

# Create admin user
python3 manage.py createsuperuser

# Start server
export GROQ_API_KEY="your_groq_api_key"
python3 manage.py runserver 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Visit **http://localhost:3000** to see the app.

---

## Environment Variables

### Backend
| Variable | Description | Required |
|----------|-------------|----------|
| `SECRET_KEY` | Django secret key | Yes (production) |
| `DEBUG` | Debug mode (`True`/`False`) | No (defaults to `True`) |
| `DATABASE_URL` | PostgreSQL connection string | Yes (production) |
| `GROQ_API_KEY` | Groq API key for AI features | Yes |
| `CORS_ALLOWED_ORIGINS` | Frontend URL(s), comma-separated | Yes (production) |
| `ALLOWED_HOSTS` | Allowed hostnames, comma-separated | No (defaults to `*`) |

### Frontend
| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | No (defaults to `http://localhost:8000/api`) |

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | User registration |
| POST | `/api/auth/login/` | Login (returns JWT tokens) |
| POST | `/api/auth/refresh/` | Refresh access token |
| GET | `/api/auth/me/` | Get current user profile |

### Mock Interviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/mock/sessions/` | List/create mock sessions |
| GET | `/api/mock/sessions/<id>/` | Session details |
| POST | `/api/mock/upload-video/` | Upload video response |
| POST | `/api/mock/sessions/<id>/complete/` | Complete & run AI analysis |
| GET | `/api/mock/sessions/<id>/results/` | Get AI results & scores |

### Interviews (Recruiter)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/interviews/` | List/create interviews |
| GET/POST | `/api/sessions/` | List/create candidate sessions |
| GET | `/api/questions/` | List questions |

---

## Deployment (Render)

This project includes a `render.yaml` blueprint for one-click deployment.

1. Push code to GitHub
2. Go to [render.com](https://render.com) > **New +** > **Blueprint**
3. Connect your repo — Render auto-detects `render.yaml`
4. Set environment variables for each service
5. Deploy

Services created:
- **mockprep-backend** — Django web service
- **mockprep-frontend** — Next.js web service
- **mockprep-db** — PostgreSQL database (free tier)

---

## Screenshots

### Landing Page
AI-powered mock interview practice platform with feature showcase, score preview, and interview type selection.

### Mock Interview Room
Split-screen layout with video recording (left) and question panel (right). Real-time emotion detection overlay on video feed.

### Results Dashboard
Overall score circle, per-question breakdown with AI feedback, emotion analysis bars, and behavioral insights panel.

---

## License

This project is for educational and personal use.
