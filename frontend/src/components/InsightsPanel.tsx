"use client";

import { BehavioralInsights } from "@/types";
import GlassPanel from "@/components/GlassPanel";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  MessageSquare,
  Target,
  TrendingUp,
  Lightbulb,
  Shield,
} from "lucide-react";

interface InsightsPanelProps {
  insights: BehavioralInsights;
}

const readinessConfig: Record<string, { label: string; color: string }> = {
  ready: { label: "Interview Ready", color: "bg-green-500/20 text-green-300 border-green-500/20" },
  almost_ready: { label: "Almost Ready", color: "bg-violet-500/20 text-violet-300 border-violet-500/20" },
  needs_practice: { label: "Needs Practice", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/20" },
  beginner: { label: "Beginner", color: "bg-red-500/20 text-red-300 border-red-500/20" },
};

export default function InsightsPanel({ insights }: InsightsPanelProps) {
  const readiness = readinessConfig[insights.interview_readiness || "needs_practice"] || readinessConfig.needs_practice;

  return (
    <div className="space-y-4">
      {/* Readiness + Communication Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlassPanel variant="subtle" className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-violet-400" />
            <p className="text-xs text-white/40">Interview Readiness</p>
          </div>
          <Badge className={`${readiness.color} border text-sm px-3 py-1`}>
            {readiness.label}
          </Badge>
        </GlassPanel>

        <GlassPanel variant="subtle" className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <p className="text-xs text-white/40">Communication Style</p>
          </div>
          <p className="text-white/80 font-medium capitalize">
            {insights.communication_style || "Unknown"}
          </p>
        </GlassPanel>
      </div>

      {/* Overall Impression */}
      {insights.overall_impression && (
        <GlassPanel variant="subtle" className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-violet-400" />
            <p className="text-sm font-medium text-white/70">Overall Impression</p>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">{insights.overall_impression}</p>
        </GlassPanel>
      )}

      {/* Strengths */}
      {insights.strengths && insights.strengths.length > 0 && (
        <GlassPanel variant="subtle" className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-green-400" />
            <p className="text-sm font-medium text-white/70">Key Strengths</p>
          </div>
          <div className="space-y-2">
            {insights.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                <p className="text-sm text-white/60">{s}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
      )}

      {/* Development Areas */}
      {insights.development_areas && insights.development_areas.length > 0 && (
        <GlassPanel variant="subtle" className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-yellow-400" />
            <p className="text-sm font-medium text-white/70">Areas for Development</p>
          </div>
          <div className="space-y-2">
            {insights.development_areas.map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 shrink-0" />
                <p className="text-sm text-white/60">{s}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
      )}

      {/* Tips */}
      {insights.tips && insights.tips.length > 0 && (
        <GlassPanel variant="subtle" className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-cyan-400" />
            <p className="text-sm font-medium text-white/70">Tips for Improvement</p>
          </div>
          <div className="space-y-2">
            {insights.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-xs text-cyan-400 font-mono mt-0.5 shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/60">{tip}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
      )}
    </div>
  );
}
