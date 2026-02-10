export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: "recruiter" | "candidate";
  avatar: string | null;
  created_at: string;
}

export interface QuestionCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  questions: Question[];
  question_count: number;
}

export interface Question {
  id: string;
  text: string;
  category: string;
  category_name: string;
  difficulty: "easy" | "medium" | "hard";
  time_limit: number;
  tips: string;
  is_active: boolean;
}

export interface Interview {
  id: string;
  title: string;
  description: string;
  recruiter: User;
  status: "draft" | "active" | "closed";
  questions: string[];
  questions_detail?: Question[];
  sessions?: CandidateSession[];
  question_count: number;
  session_count: number;
  max_duration: number;
  created_at: string;
}

export interface CandidateSession {
  id: string;
  interview: string;
  interview_title: string;
  candidate: User;
  status: "not_started" | "in_progress" | "completed" | "reviewed";
  overall_score: number | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  responses?: QuestionResponse[];
  response_count?: number;
}

export interface QuestionResponse {
  id: string;
  session: string;
  question: string;
  question_detail?: Question;
  video_file: string | null;
  transcript: string;
  ai_score: number | null;
  ai_feedback: string;
  confidence_score: number | null;
  duration: number;
  created_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: "recruiter" | "candidate";
  password: string;
  password_confirm: string;
}

export interface MockSession {
  id: string;
  candidate: User;
  session_type: "behavioral" | "technical" | "mixed";
  status: "in_progress" | "completed" | "analyzed";
  overall_score: number | null;
  overall_feedback: string;
  behavioral_insights: BehavioralInsights;
  emotion_summary: Record<string, number>;
  question_count: number;
  created_at: string;
  completed_at: string | null;
  responses?: MockResponse[];
  response_count?: number;
}

export interface MockResponse {
  id: string;
  session: string;
  question: string;
  question_detail?: Question;
  question_order: number;
  video_file: string | null;
  transcript: string;
  ai_score: number | null;
  ai_feedback: string;
  confidence_score: number | null;
  emotion_data: EmotionData;
  duration: number;
  analysis_status: "pending" | "analyzing" | "completed" | "failed";
  created_at: string;
}

export interface BehavioralInsights {
  overall_impression?: string;
  communication_style?: string;
  strengths?: string[];
  development_areas?: string[];
  interview_readiness?: string;
  tips?: string[];
}

export interface EmotionData {
  averages?: Record<string, number>;
  dominant?: string;
  timeline?: Array<{ time: number; emotions: Record<string, number> }>;
}

export interface AiFeedback {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  communication_score: number;
  relevance_score: number;
  structure_score: number;
}
