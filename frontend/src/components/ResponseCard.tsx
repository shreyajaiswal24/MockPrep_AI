"use client";

import { useState } from "react";
import { MockResponse, AiFeedback } from "@/types";
import GlassPanel from "@/components/GlassPanel";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, CheckCircle, AlertTriangle } from "lucide-react";

interface ResponseCardProps {
  response: MockResponse;
  index: number;
}

export default function ResponseCard({ response, index }: ResponseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  let feedback: AiFeedback | null = null;
  try {
    if (response.ai_feedback) {
      feedback = JSON.parse(response.ai_feedback);
    }
  } catch {
    // feedback remains null
  }

  const score = response.ai_score || 0;

  const getScoreColor = (s: number) => {
    if (s >= 80) return "bg-green-500";
    if (s >= 60) return "bg-violet-500";
    if (s >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreBadge = (s: number) => {
    if (s >= 80) return "bg-green-500/20 text-green-300 border-green-500/20";
    if (s >= 60) return "bg-violet-500/20 text-violet-300 border-violet-500/20";
    if (s >= 40) return "bg-yellow-500/20 text-yellow-300 border-yellow-500/20";
    return "bg-red-500/20 text-red-300 border-red-500/20";
  };

  return (
    <GlassPanel variant="subtle" className="overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm font-mono text-white/50">
            {index + 1}
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-white/90 line-clamp-1">
              {response.question_detail?.text || `Question ${index + 1}`}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {response.question_detail?.category_name && (
                <span className="text-xs text-white/40">{response.question_detail.category_name}</span>
              )}
              {response.duration > 0 && (
                <span className="text-xs text-white/30">
                  {Math.floor(response.duration / 60)}:{(response.duration % 60).toString().padStart(2, "0")}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`${getScoreBadge(score)} border text-xs`}>
            {Math.round(score)}/100
          </Badge>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-white/40" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/40" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4">
              {/* Score bar */}
              <div>
                <div className="flex justify-between text-xs text-white/40 mb-1">
                  <span>Score</span>
                  <span>{Math.round(score)}%</span>
                </div>
                <Progress value={score} className={`h-2 bg-white/5 [&>div]:${getScoreColor(score)}`} />
              </div>

              {/* Sub-scores */}
              {feedback && (
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Communication", value: feedback.communication_score },
                    { label: "Relevance", value: feedback.relevance_score },
                    { label: "Structure", value: feedback.structure_score },
                  ].map((sub) => (
                    <div key={sub.label} className="text-center">
                      <p className="text-lg font-bold text-white/80">{Math.round(sub.value || 0)}</p>
                      <p className="text-xs text-white/40">{sub.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Feedback */}
              {feedback?.feedback && (
                <div className="bg-white/[0.02] rounded-lg p-3">
                  <p className="text-sm text-white/70 leading-relaxed">{feedback.feedback}</p>
                </div>
              )}

              {/* Strengths */}
              {feedback?.strengths && feedback.strengths.length > 0 && (
                <div>
                  <p className="text-xs text-white/40 mb-2 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-400" /> Strengths
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {feedback.strengths.map((s, i) => (
                      <Badge key={i} className="bg-green-500/10 text-green-300 border-green-500/20 text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvements */}
              {feedback?.improvements && feedback.improvements.length > 0 && (
                <div>
                  <p className="text-xs text-white/40 mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-yellow-400" /> Areas to Improve
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {feedback.improvements.map((s, i) => (
                      <Badge key={i} className="bg-yellow-500/10 text-yellow-300 border-yellow-500/20 text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Transcript */}
              {response.transcript && (
                <div>
                  <p className="text-xs text-white/40 mb-2">Transcript</p>
                  <div className="bg-white/[0.02] rounded-lg p-3 max-h-32 overflow-y-auto">
                    <p className="text-xs text-white/50 leading-relaxed">{response.transcript}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassPanel>
  );
}
