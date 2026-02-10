"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { CandidateSession } from "@/types";
import GlassPanel from "@/components/GlassPanel";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Users,
  Video,
  Clock,
  Eye,
} from "lucide-react";

export default function CandidatesPage() {
  const [sessions, setSessions] = useState<CandidateSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<CandidateSession | null>(null);
  const [detailSession, setDetailSession] = useState<CandidateSession | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/sessions/");
        setSessions(res.data);
      } catch {
        toast.error("Failed to load sessions");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const handleViewDetail = async (session: CandidateSession) => {
    try {
      const res = await api.get(`/sessions/${session.id}/`);
      setDetailSession(res.data);
      setSelectedSession(session);
    } catch {
      toast.error("Failed to load session details");
    }
  };

  const statusColor: Record<string, string> = {
    not_started: "bg-white/10 text-white/40 border-white/10",
    in_progress: "bg-blue-500/20 text-blue-300 border-blue-500/20",
    completed: "bg-green-500/20 text-green-300 border-green-500/20",
    reviewed: "bg-violet-500/20 text-violet-300 border-violet-500/20",
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-white/5" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 bg-white/5 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Candidates</h1>
        <p className="text-white/50 text-sm mt-1">
          Review candidate sessions and responses ({sessions.length} total)
        </p>
      </div>

      {sessions.length === 0 ? (
        <GlassPanel className="p-12 text-center">
          <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No candidate sessions yet.</p>
          <p className="text-white/30 text-sm mt-1">Sessions will appear here when candidates start interviews.</p>
        </GlassPanel>
      ) : (
        <div className="space-y-3">
          {sessions.map((session, i) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassPanel variant="subtle" className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <span className="text-sm font-medium text-cyan-300">
                        {session.candidate.first_name[0]}{session.candidate.last_name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-white/90">
                        {session.candidate.first_name} {session.candidate.last_name}
                      </p>
                      <p className="text-xs text-white/40 mt-0.5">
                        {session.interview_title} &middot;{" "}
                        {session.response_count || 0} responses &middot;{" "}
                        {session.started_at
                          ? new Date(session.started_at).toLocaleDateString()
                          : "Not started"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {session.overall_score !== null && (
                      <span className="text-lg font-mono font-bold text-gradient-static">
                        {session.overall_score.toFixed(0)}%
                      </span>
                    )}
                    <Badge className={`text-xs border ${statusColor[session.status]}`}>
                      {session.status.replace("_", " ")}
                    </Badge>
                    <Button
                      onClick={() => handleViewDetail(session)}
                      size="sm"
                      variant="outline"
                      className="border-white/10 text-white/60 hover:bg-white/5 gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </Button>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="glass-strong border-white/10 text-white max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedSession?.candidate.first_name} {selectedSession?.candidate.last_name} - Session Details
            </DialogTitle>
          </DialogHeader>

          {detailSession && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-3">
                <GlassPanel variant="subtle" className="p-3 text-center">
                  <p className="text-xs text-white/40">Status</p>
                  <p className="text-sm font-medium text-white/90 capitalize mt-1">
                    {detailSession.status.replace("_", " ")}
                  </p>
                </GlassPanel>
                <GlassPanel variant="subtle" className="p-3 text-center">
                  <p className="text-xs text-white/40">Responses</p>
                  <p className="text-sm font-medium text-white/90 mt-1">
                    {detailSession.responses?.length || 0}
                  </p>
                </GlassPanel>
                <GlassPanel variant="subtle" className="p-3 text-center">
                  <p className="text-xs text-white/40">Score</p>
                  <p className="text-sm font-medium text-white/90 mt-1">
                    {detailSession.overall_score !== null
                      ? `${detailSession.overall_score.toFixed(0)}%`
                      : "Pending"}
                  </p>
                </GlassPanel>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-white/70">Responses</h3>
                {detailSession.responses && detailSession.responses.length > 0 ? (
                  detailSession.responses.map((response, i) => (
                    <GlassPanel key={response.id} variant="subtle" className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-xs text-white/40">Question {i + 1}</p>
                          <p className="text-sm text-white/80 mt-1">
                            {response.question_detail?.text || "Question"}
                          </p>
                        </div>
                        {response.ai_score !== null && (
                          <Badge className="bg-violet-600/20 text-violet-300 border-violet-500/20">
                            {response.ai_score.toFixed(0)}%
                          </Badge>
                        )}
                      </div>
                      {response.video_file && (
                        <div className="mt-3">
                          <video
                            src={`http://localhost:8000${response.video_file}`}
                            controls
                            className="w-full rounded-lg max-h-48 bg-black/40"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {response.duration}s
                        </span>
                        {response.video_file && (
                          <span className="flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            Video recorded
                          </span>
                        )}
                      </div>
                    </GlassPanel>
                  ))
                ) : (
                  <p className="text-white/40 text-sm text-center py-4">No responses yet</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
