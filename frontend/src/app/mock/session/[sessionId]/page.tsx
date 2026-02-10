"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { MockSession, MockResponse } from "@/types";
import { useVideoRecorder } from "@/hooks/useVideoRecorder";
import { useFaceDetection } from "@/hooks/useFaceDetection";
import AuthGuard from "@/components/AuthGuard";
import GlassPanel from "@/components/GlassPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Video,
  Square,
  RotateCcw,
  Upload,
  Pause,
  Play,
  Camera,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Lightbulb,
  Sparkles,
  LogOut,
  Brain,
  Loader2,
} from "lucide-react";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function MockSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<MockSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const {
    stream,
    isRecording,
    isPaused,
    recordedBlob,
    recordedUrl,
    duration,
    error,
    videoRef,
    startCamera,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
    stopCamera,
  } = useVideoRecorder();

  const {
    emotionData,
    currentEmotion,
    isModelLoaded,
    startDetection,
    stopDetection,
  } = useFaceDetection();

  const detectionStartedRef = useRef(false);

  // Fetch session data
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await api.get(`/mock/sessions/${sessionId}/`);
        setSession(res.data);
        const answered = new Set<string>();
        (res.data.responses || []).forEach((r: MockResponse) => {
          if (r.video_file) answered.add(r.question);
        });
        setAnsweredQuestions(answered);
      } catch {
        toast.error("Failed to load mock session");
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, [sessionId, router]);

  // Start camera
  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start emotion detection when video is ready
  useEffect(() => {
    if (stream && isModelLoaded && videoRef.current && !detectionStartedRef.current) {
      detectionStartedRef.current = true;
      startDetection(videoRef.current);
    }
  }, [stream, isModelLoaded, videoRef, startDetection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopDetection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const responses = session?.responses || [];
  const currentResponse = responses[currentIndex];
  const currentQuestion = currentResponse?.question_detail;
  const totalProgress = responses.length > 0
    ? (answeredQuestions.size / responses.length) * 100
    : 0;

  const timeLimit = currentQuestion?.time_limit || 120;
  const progress = timeLimit > 0 ? (duration / timeLimit) * 100 : 0;

  // Auto-stop recording at time limit
  useEffect(() => {
    if (isRecording && duration >= timeLimit) {
      stopRecording();
    }
  }, [duration, timeLimit, isRecording, stopRecording]);

  const handleVideoSubmit = useCallback(async () => {
    if (!recordedBlob || !currentResponse) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("question_id", currentResponse.question);
      formData.append("video", recordedBlob, `mock_${currentResponse.question}.webm`);
      formData.append("duration", duration.toString());
      formData.append("emotion_data", JSON.stringify(emotionData));

      await api.post("/mock/upload-video/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAnsweredQuestions((prev) => new Set([...Array.from(prev), currentResponse.question]));
      toast.success("Response recorded!");

      resetRecording();

      if (currentIndex < responses.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }, [recordedBlob, currentResponse, sessionId, duration, emotionData, resetRecording, currentIndex, responses.length]);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await api.post(`/mock/sessions/${sessionId}/complete/`);
      toast.success("Interview analyzed! Redirecting to results...");
      router.push(`/mock/results/${sessionId}`);
    } catch {
      toast.error("Failed to complete session. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  };

  const difficultyColor: Record<string, string> = {
    easy: "bg-green-500/20 text-green-300 border-green-500/20",
    medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/20",
    hard: "bg-red-500/20 text-red-300 border-red-500/20",
  };

  const emotionEmoji: Record<string, string> = {
    happy: "😊",
    neutral: "😐",
    sad: "😢",
    angry: "😠",
    fearful: "😰",
    disgusted: "🤢",
    surprised: "😲",
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

  if (isCompleting) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-grid flex items-center justify-center">
          <GlassPanel variant="strong" className="p-12 text-center max-w-md">
            <Loader2 className="w-12 h-12 text-violet-400 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Analyzing Your Interview</h2>
            <p className="text-white/50 text-sm">
              Our AI is transcribing your responses, scoring them, and generating personalized insights. This may take 15-30 seconds...
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-white/40">
                <Brain className="w-4 h-4 text-violet-400" />
                <span>Transcribing audio with Whisper...</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/40">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Scoring with AI coach...</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/40">
                <Brain className="w-4 h-4 text-violet-400" />
                <span>Generating behavioral insights...</span>
              </div>
            </div>
          </GlassPanel>
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
            <span className="font-semibold text-white/90">AI Mock Interview</span>
            <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/20 text-xs capitalize">
              {session?.session_type}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-white/50">
              <CheckCircle className="w-4 h-4" />
              {answeredQuestions.size}/{responses.length} answered
            </div>
            {answeredQuestions.size === responses.length && answeredQuestions.size > 0 && (
              <Button
                onClick={handleComplete}
                className="btn-gradient text-white border-0 text-sm gap-1"
                size="sm"
              >
                <Brain className="w-4 h-4" />
                Complete & Get Results
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
          {/* Video area */}
          <div className="lg:col-span-3">
            <GlassPanel variant="strong" className="overflow-hidden">
              <div className="relative aspect-video bg-black/60 rounded-t-xl overflow-hidden">
                {recordedUrl && !isRecording ? (
                  <video
                    src={recordedUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ transform: "scaleX(-1)" }}
                  />
                )}

                {/* Recording indicator */}
                {isRecording && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 glass rounded-full px-3 py-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 recording-pulse" />
                    <span className="text-sm font-medium text-white/90">
                      {isPaused ? "Paused" : "Recording"}
                    </span>
                  </div>
                )}

                {/* Timer */}
                {(isRecording || recordedBlob) && (
                  <div className="absolute top-4 right-4 glass rounded-full px-3 py-1.5">
                    <span className="text-sm font-mono text-white/90">{formatTime(duration)}</span>
                    <span className="text-sm text-white/40"> / {formatTime(timeLimit)}</span>
                  </div>
                )}

                {/* Emotion indicator */}
                {isModelLoaded && stream && !recordedUrl && (
                  <div className="absolute bottom-4 left-4 glass rounded-full px-3 py-1.5 flex items-center gap-2">
                    <span className="text-base">{emotionEmoji[currentEmotion] || "😐"}</span>
                    <span className="text-xs text-white/60 capitalize">{currentEmotion}</span>
                  </div>
                )}

                {/* No camera */}
                {!stream && !error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Camera className="w-12 h-12 text-white/20 mb-3" />
                    <p className="text-white/40 text-sm">Starting camera...</p>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                    <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
                    <p className="text-red-300 text-sm text-center">{error}</p>
                    <Button
                      onClick={startCamera}
                      variant="outline"
                      size="sm"
                      className="mt-4 border-white/10 text-white/70"
                    >
                      Retry
                    </Button>
                  </div>
                )}
              </div>

              {/* Recording progress bar */}
              {isRecording && (
                <Progress value={progress} className="h-1 rounded-none bg-white/5" />
              )}

              {/* Controls */}
              <div className="p-4 flex items-center justify-center gap-3">
                {!isRecording && !recordedBlob && (
                  <Button
                    onClick={startRecording}
                    disabled={!stream}
                    className="btn-gradient text-white border-0 gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Start Recording
                  </Button>
                )}

                {isRecording && (
                  <>
                    {isPaused ? (
                      <Button
                        onClick={resumeRecording}
                        variant="outline"
                        className="border-white/10 text-white/70 hover:bg-white/5 gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Resume
                      </Button>
                    ) : (
                      <Button
                        onClick={pauseRecording}
                        variant="outline"
                        className="border-white/10 text-white/70 hover:bg-white/5 gap-2"
                      >
                        <Pause className="w-4 h-4" />
                        Pause
                      </Button>
                    )}
                    <Button
                      onClick={stopRecording}
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 gap-2"
                    >
                      <Square className="w-4 h-4" />
                      Stop
                    </Button>
                  </>
                )}

                {recordedBlob && !isRecording && (
                  <>
                    <Button
                      onClick={resetRecording}
                      variant="outline"
                      className="border-white/10 text-white/70 hover:bg-white/5 gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Re-record
                    </Button>
                    <Button
                      onClick={handleVideoSubmit}
                      disabled={isUploading}
                      className="btn-gradient text-white border-0 gap-2"
                    >
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      {isUploading ? "Uploading..." : "Submit"}
                    </Button>
                  </>
                )}
              </div>
            </GlassPanel>
          </div>

          {/* Question panel */}
          <div className="lg:col-span-2 space-y-4">
            <GlassPanel variant="strong" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-white/40">
                  Question {currentIndex + 1} of {responses.length}
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

              {answeredQuestions.has(currentResponse?.question || "") && (
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
                onClick={() => setCurrentIndex((prev) => Math.min(responses.length - 1, prev + 1))}
                disabled={currentIndex === responses.length - 1}
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
              <div className="grid grid-cols-5 gap-2">
                {responses.map((r, i) => (
                  <button
                    key={r.id}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-10 rounded-lg text-xs font-medium transition-all ${
                      i === currentIndex
                        ? "bg-violet-600 text-white"
                        : answeredQuestions.has(r.question)
                        ? "bg-green-500/20 text-green-300 border border-green-500/20"
                        : "bg-white/5 text-white/40 hover:bg-white/10"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </GlassPanel>

            {/* Complete button */}
            {answeredQuestions.size === responses.length && answeredQuestions.size > 0 && (
              <Button
                onClick={handleComplete}
                className="btn-gradient text-white border-0 w-full gap-2"
              >
                <Brain className="w-4 h-4" />
                Complete & Get AI Results
              </Button>
            )}
          </div>
        </div>

        {/* Exit dialog */}
        <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <DialogContent className="glass-strong border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Exit Mock Interview?</DialogTitle>
              <DialogDescription className="text-white/50">
                Your recorded responses will be saved but you won&apos;t get AI analysis until you complete all questions.
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
      </div>
    </AuthGuard>
  );
}
