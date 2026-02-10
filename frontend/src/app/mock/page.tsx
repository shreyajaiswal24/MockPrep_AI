"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import GlassPanel from "@/components/GlassPanel";
import VideoRecorder from "@/components/VideoRecorder";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Clock,
  Lightbulb,
  ArrowLeft,
  LogOut,
  Brain,
  Loader2,
  Play,
} from "lucide-react";

// ----- Practice mode questions -----
const mockQuestions = [
  {
    id: "1",
    text: "Tell me about yourself and your professional background.",
    difficulty: "easy" as const,
    time_limit: 120,
    category_name: "Behavioral",
    tips: "Keep it professional and structured. Cover your current role, key achievements, and what you're looking for.",
  },
  {
    id: "2",
    text: "Describe a challenging project you worked on. What was your approach and what was the outcome?",
    difficulty: "medium" as const,
    time_limit: 150,
    category_name: "Behavioral",
    tips: "Use the STAR method: Situation, Task, Action, Result. Be specific about your contributions.",
  },
  {
    id: "3",
    text: "How do you handle disagreements with team members?",
    difficulty: "medium" as const,
    time_limit: 120,
    category_name: "Communication",
    tips: "Show empathy and problem-solving. Give a real example if possible.",
  },
  {
    id: "4",
    text: "Where do you see yourself in five years?",
    difficulty: "easy" as const,
    time_limit: 90,
    category_name: "Behavioral",
    tips: "Align your goals with the role and company. Show ambition but be realistic.",
  },
  {
    id: "5",
    text: "Explain a complex technical concept to a non-technical audience.",
    difficulty: "hard" as const,
    time_limit: 150,
    category_name: "Communication",
    tips: "Use simple analogies, avoid jargon, and check for understanding.",
  },
];

export default function MockInterviewPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  if (authLoading) return null;

  return isAuthenticated ? <AuthenticatedMockPage /> : <PracticeModePage />;
}

// ----- AI Mock setup for authenticated users -----
function AuthenticatedMockPage() {
  const router = useRouter();
  const [sessionType, setSessionType] = useState<"behavioral" | "technical" | "mixed">("behavioral");
  const [questionCount, setQuestionCount] = useState(5);
  const [isCreating, setIsCreating] = useState(false);

  const sessionTypes = [
    { value: "behavioral" as const, label: "Behavioral", desc: "Communication & soft skills" },
    { value: "technical" as const, label: "Technical", desc: "Problem-solving & technical" },
    { value: "mixed" as const, label: "Mixed", desc: "Both behavioral & technical" },
  ];

  const handleStart = async () => {
    setIsCreating(true);
    try {
      const res = await api.post("/mock/sessions/", {
        session_type: sessionType,
        question_count: questionCount,
      });
      router.push(`/mock/session/${res.data.id}`);
    } catch {
      toast.error("Failed to create mock session. Make sure there are questions in the database.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-grid relative overflow-hidden">
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[150px] pointer-events-none" />

      {/* Top bar */}
      <div className="relative z-10 glass-subtle border-b border-white/5 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Sparkles className="w-5 h-5 text-violet-400" />
          <span className="font-semibold text-white/90">AI Mock Interview</span>
        </div>
      </div>

      {/* Setup */}
      <div className="relative z-10 max-w-2xl mx-auto p-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <GlassPanel variant="strong" className="p-8">
            <div className="text-center mb-8">
              <Brain className="w-12 h-12 text-violet-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">AI Mock Interview</h1>
              <p className="text-white/50 text-sm">
                Practice with AI-powered feedback. Get scored on each answer, receive detailed insights, and track your emotions.
              </p>
            </div>

            {/* Session type */}
            <div className="mb-6">
              <p className="text-sm text-white/60 mb-3">Interview Type</p>
              <div className="grid grid-cols-3 gap-3">
                {sessionTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSessionType(type.value)}
                    className={`p-4 rounded-xl text-left transition-all border ${
                      sessionType === type.value
                        ? "bg-violet-600/20 border-violet-500/30 text-violet-300"
                        : "bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/[0.04]"
                    }`}
                  >
                    <p className="text-sm font-medium">{type.label}</p>
                    <p className="text-xs text-white/40 mt-1">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Question count */}
            <div className="mb-8">
              <p className="text-sm text-white/60 mb-3">Number of Questions</p>
              <div className="flex items-center gap-3">
                {[3, 5, 7, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={`w-14 h-14 rounded-xl text-sm font-medium transition-all border ${
                      questionCount === n
                        ? "bg-violet-600/20 border-violet-500/30 text-violet-300"
                        : "bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/[0.04]"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Start button */}
            <Button
              onClick={handleStart}
              disabled={isCreating}
              className="btn-gradient text-white border-0 w-full gap-2 h-12 text-base"
            >
              {isCreating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              {isCreating ? "Setting up..." : "Start AI Mock Interview"}
            </Button>

            <div className="mt-4 text-center">
              <Link href="/mock/practice">
                <Button variant="link" className="text-white/40 text-xs p-0 h-auto hover:text-white/60">
                  Or try free practice mode without scoring
                </Button>
              </Link>
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
}

// ----- Free practice mode for unauthenticated users -----
function PracticeModePage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());
  const [showExitDialog, setShowExitDialog] = useState(false);

  const question = mockQuestions[currentIndex];

  const difficultyColor: Record<string, string> = {
    easy: "bg-green-500/20 text-green-300 border-green-500/20",
    medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/20",
    hard: "bg-red-500/20 text-red-300 border-red-500/20",
  };

  const handleSubmit = () => {
    setCompletedQuestions((prev) => new Set([...Array.from(prev), question.id]));
    toast.success("Practice response recorded! (Not saved - this is practice mode)");

    if (currentIndex < mockQuestions.length - 1) {
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 500);
    }
  };

  const handleExit = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-grid relative overflow-hidden">
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[150px] pointer-events-none" />

      {/* Top bar */}
      <div className="relative z-10 glass-subtle border-b border-white/5 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Sparkles className="w-5 h-5 text-violet-400" />
          <span className="font-semibold text-white/90">Practice Mode</span>
          <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/20 text-xs">
            Mock
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-white/40">
            {completedQuestions.size}/{mockQuestions.length} practiced
          </p>
          <Button
            onClick={() => setShowExitDialog(true)}
            variant="outline"
            size="sm"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 gap-1"
          >
            <LogOut className="w-4 h-4" />
            Exit
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Video */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <VideoRecorder
                timeLimit={question.time_limit}
                onSubmit={handleSubmit}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Question panel */}
        <div className="lg:col-span-2 space-y-4">
          <GlassPanel variant="strong" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-white/40">
                Question {currentIndex + 1} of {mockQuestions.length}
              </p>
              <Badge className={`${difficultyColor[question.difficulty]} border text-xs`}>
                {question.difficulty}
              </Badge>
            </div>

            <p className="text-white/90 leading-relaxed mb-4">{question.text}</p>

            <div className="flex items-center gap-4 text-sm text-white/40">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {Math.floor(question.time_limit / 60)} min
              </div>
              <span className="text-white/20">|</span>
              <span>{question.category_name}</span>
            </div>
          </GlassPanel>

          {question.tips && (
            <GlassPanel variant="subtle" className="p-4">
              <button
                onClick={() => setShowTips(!showTips)}
                className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors w-full"
              >
                <Lightbulb className="w-4 h-4" />
                {showTips ? "Hide Tips" : "Show Tips"}
              </button>
              {showTips && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 text-sm text-white/50 leading-relaxed"
                >
                  {question.tips}
                </motion.p>
              )}
            </GlassPanel>
          )}

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              variant="outline"
              size="sm"
              className="border-white/10 text-white/60 hover:bg-white/5 flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              onClick={() => setCurrentIndex((prev) => Math.min(mockQuestions.length - 1, prev + 1))}
              disabled={currentIndex === mockQuestions.length - 1}
              variant="outline"
              size="sm"
              className="border-white/10 text-white/60 hover:bg-white/5 flex-1"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Question nav */}
          <GlassPanel variant="subtle" className="p-4">
            <p className="text-xs text-white/40 mb-3">Questions</p>
            <div className="grid grid-cols-5 gap-2">
              {mockQuestions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-10 rounded-lg text-xs font-medium transition-all ${
                    i === currentIndex
                      ? "bg-violet-600 text-white"
                      : completedQuestions.has(q.id)
                      ? "bg-green-500/20 text-green-300 border border-green-500/20"
                      : "bg-white/5 text-white/40 hover:bg-white/10"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel variant="subtle" className="p-4 text-center">
            <p className="text-xs text-white/30">
              Practice mode - responses are not saved. Sign up for AI-powered scoring and feedback.
            </p>
            <Link href="/signup">
              <Button variant="link" className="text-violet-400 text-xs mt-1 p-0 h-auto">
                Create Account
              </Button>
            </Link>
          </GlassPanel>
        </div>
      </div>

      {/* Exit confirmation dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="glass-strong border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Exit Practice?</DialogTitle>
            <DialogDescription className="text-white/50">
              Your practice progress will not be saved. Are you sure you want to leave?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowExitDialog(false)}
              className="border-white/10 text-white/70"
            >
              Cancel
            </Button>
            <Button
              onClick={handleExit}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Exit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
