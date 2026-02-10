"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { CandidateSession, Question } from "@/types";
import AuthGuard from "@/components/AuthGuard";
import GlassPanel from "@/components/GlassPanel";
import VideoRecorder from "@/components/VideoRecorder";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Lightbulb,
  Sparkles,
  LogOut,
} from "lucide-react";

export default function InterviewRoomPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<CandidateSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await api.get(`/sessions/${sessionId}/`);
        setSession(res.data);

        const interviewRes = await api.get(`/interviews/${res.data.interview}/`);
        setQuestions(interviewRes.data.questions_detail || []);

        const answered = new Set<string>();
        (res.data.responses || []).forEach((r: { question: string; video_file: string | null }) => {
          if (r.video_file) answered.add(r.question);
        });
        setAnsweredQuestions(answered);
      } catch {
        toast.error("Failed to load interview session");
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, [sessionId, router]);

  const currentQuestion = questions[currentIndex];
  const totalProgress = questions.length > 0
    ? (answeredQuestions.size / questions.length) * 100
    : 0;

  const handleVideoSubmit = useCallback(async (blob: Blob, duration: number) => {
    if (!currentQuestion) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("question_id", currentQuestion.id);
      formData.append("video", blob, `response_${currentQuestion.id}.webm`);
      formData.append("duration", duration.toString());

      await api.post("/upload-video/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAnsweredQuestions((prev) => new Set([...Array.from(prev), currentQuestion.id]));
      toast.success("Video uploaded successfully!");

      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }, [currentQuestion, sessionId, currentIndex, questions.length]);

  const handleCompleteSession = async () => {
    try {
      await api.post(`/sessions/${sessionId}/complete/`);
      toast.success("Interview completed!");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to complete session");
    }
  };

  const difficultyColor: Record<string, string> = {
    easy: "bg-green-500/20 text-green-300 border-green-500/20",
    medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/20",
    hard: "bg-red-500/20 text-red-300 border-red-500/20",
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen p-6 bg-grid">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <Skeleton className="aspect-video w-full bg-white/5 rounded-xl" />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-32 bg-white/5 rounded-xl" />
              <Skeleton className="h-48 bg-white/5 rounded-xl" />
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-grid">
        {/* Top bar */}
        <div className="glass-subtle border-b border-white/5 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <span className="font-semibold text-white/90">{session?.interview_title}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-white/50">
              <CheckCircle className="w-4 h-4" />
              {answeredQuestions.size}/{questions.length} answered
            </div>
            {answeredQuestions.size === questions.length && (
              <Button
                onClick={handleCompleteSession}
                className="btn-gradient text-white border-0 text-sm"
                size="sm"
              >
                Complete Interview
              </Button>
            )}
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

        {/* Progress */}
        <Progress value={totalProgress} className="h-1 rounded-none bg-white/5" />

        {/* Main content */}
        <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Video area - left 60% */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion?.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <VideoRecorder
                  timeLimit={currentQuestion?.time_limit || 120}
                  onSubmit={handleVideoSubmit}
                />
              </motion.div>
            </AnimatePresence>

            {isUploading && (
              <GlassPanel className="mt-4 p-4 text-center">
                <p className="text-white/70 text-sm">Uploading video...</p>
                <Progress value={50} className="h-1 mt-2 bg-white/5" />
              </GlassPanel>
            )}
          </div>

          {/* Question panel - right 40% */}
          <div className="lg:col-span-2 space-y-4">
            {/* Question card */}
            <GlassPanel variant="strong" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-white/40">
                  Question {currentIndex + 1} of {questions.length}
                </p>
                {currentQuestion && (
                  <Badge className={`${difficultyColor[currentQuestion.difficulty]} border text-xs`}>
                    {currentQuestion.difficulty}
                  </Badge>
                )}
              </div>

              <p className="text-white/90 leading-relaxed mb-4">
                {currentQuestion?.text}
              </p>

              <div className="flex items-center gap-4 text-sm text-white/40">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {currentQuestion ? Math.floor(currentQuestion.time_limit / 60) : 0} min
                </div>
                <span className="text-white/20">|</span>
                <span>{currentQuestion?.category_name}</span>
              </div>

              {answeredQuestions.has(currentQuestion?.id || "") && (
                <div className="mt-4 flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Answered
                </div>
              )}
            </GlassPanel>

            {/* Tips */}
            {currentQuestion?.tips && (
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
                    {currentQuestion.tips}
                  </motion.p>
                )}
              </GlassPanel>
            )}

            {/* Navigation */}
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
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                disabled={currentIndex === questions.length - 1}
                variant="outline"
                size="sm"
                className="border-white/10 text-white/60 hover:bg-white/5 flex-1"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {/* Question navigator */}
            <GlassPanel variant="subtle" className="p-4">
              <p className="text-xs text-white/40 mb-3">All Questions</p>
              <div className="grid grid-cols-4 gap-2">
                {questions.map((q, i) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-10 rounded-lg text-xs font-medium transition-all ${
                      i === currentIndex
                        ? "bg-violet-600 text-white"
                        : answeredQuestions.has(q.id)
                        ? "bg-green-500/20 text-green-300 border border-green-500/20"
                        : "bg-white/5 text-white/40 hover:bg-white/10"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>

      {/* Exit confirmation dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="glass-strong border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Exit Interview?</DialogTitle>
            <DialogDescription className="text-white/50">
              Your progress has been saved. You can resume this interview later from your dashboard.
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
              onClick={() => router.push("/dashboard")}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Exit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthGuard>
  );
}
