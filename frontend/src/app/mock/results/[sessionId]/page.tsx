"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { MockSession } from "@/types";
import AuthGuard from "@/components/AuthGuard";
import GlassPanel from "@/components/GlassPanel";
import ScoreCircle from "@/components/ScoreCircle";
import ResponseCard from "@/components/ResponseCard";
import InsightsPanel from "@/components/InsightsPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  RotateCcw,
  LayoutDashboard,
  Brain,
  BarChart3,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function MockResultsPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<MockSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get(`/mock/sessions/${sessionId}/results/`);
        setSession(res.data);
      } catch {
        toast.error("Failed to load results");
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [sessionId, router]);

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-grid p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-8 w-48 bg-white/5" />
            <Skeleton className="h-64 bg-white/5 rounded-xl" />
            <Skeleton className="h-48 bg-white/5 rounded-xl" />
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (!session) return null;

  const responses = session.responses || [];
  const emotionSummary = session.emotion_summary || {};
  const maxEmotion = Object.entries(emotionSummary).reduce(
    (max, [key, val]) => (val > max.val ? { key, val } : max),
    { key: "neutral", val: 0 }
  );

  return (
    <AuthGuard>
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
            <span className="font-semibold text-white/90">Interview Results</span>
            <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/20 text-xs capitalize">
              {session.session_type}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/mock">
              <Button variant="outline" size="sm" className="border-white/10 text-white/60 gap-1">
                <RotateCcw className="w-4 h-4" />
                Try Again
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="border-white/10 text-white/60 gap-1">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-6">
          {/* Overall Score + Emotion Summary */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.4 }}
          >
            <GlassPanel variant="strong" className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Score circle */}
                <ScoreCircle
                  score={session.overall_score || 0}
                  size={180}
                  strokeWidth={14}
                />

                {/* Summary */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-xl font-bold text-white mb-2">
                    {(session.overall_score || 0) >= 80
                      ? "Excellent Performance!"
                      : (session.overall_score || 0) >= 60
                      ? "Good Job!"
                      : (session.overall_score || 0) >= 40
                      ? "Room for Improvement"
                      : "Keep Practicing"}
                  </h2>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">
                    {session.overall_feedback || "Your results are ready."}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/20 text-xs">
                      {responses.length} Questions
                    </Badge>
                    <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/20 text-xs capitalize">
                      {session.session_type}
                    </Badge>
                    {session.completed_at && (
                      <Badge className="bg-white/10 text-white/50 border-white/10 text-xs">
                        {new Date(session.completed_at).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </GlassPanel>
          </motion.div>

          {/* Emotion Summary */}
          {Object.keys(emotionSummary).length > 0 && (
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <GlassPanel variant="strong" className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-semibold text-white">Emotion Analysis</h3>
                </div>
                <div className="space-y-3">
                  {Object.entries(emotionSummary)
                    .sort(([, a], [, b]) => b - a)
                    .map(([emotion, value]) => {
                      const percentage = Math.round(value * 100);
                      return (
                        <div key={emotion} className="flex items-center gap-3">
                          <span className="text-sm text-white/60 capitalize w-20">{emotion}</span>
                          <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                emotion === maxEmotion.key
                                  ? "bg-violet-500"
                                  : "bg-white/20"
                              }`}
                              style={{ width: `${Math.min(100, percentage)}%` }}
                            />
                          </div>
                          <span className="text-xs text-white/40 font-mono w-10 text-right">{percentage}%</span>
                        </div>
                      );
                    })}
                </div>
              </GlassPanel>
            </motion.div>
          )}

          {/* Per-Question Results */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-violet-400" />
              <h3 className="text-lg font-semibold text-white">Question-by-Question Analysis</h3>
            </div>
            <div className="space-y-3">
              {responses.map((response, i) => (
                <ResponseCard key={response.id} response={response} index={i} />
              ))}
            </div>
          </motion.div>

          {/* Behavioral Insights */}
          {session.behavioral_insights && Object.keys(session.behavioral_insights).length > 0 && (
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Behavioral Insights</h3>
              </div>
              <InsightsPanel insights={session.behavioral_insights} />
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <GlassPanel variant="subtle" className="p-6 text-center">
              <p className="text-white/40 text-sm mb-4">Want to improve your score?</p>
              <div className="flex items-center justify-center gap-3">
                <Link href="/mock">
                  <Button className="btn-gradient text-white border-0 gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="border-white/10 text-white/60 gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  );
}
