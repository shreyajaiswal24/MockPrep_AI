"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Interview, CandidateSession, MockSession } from "@/types";
import GlassPanel from "@/components/GlassPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Video,
  Users,
  CheckCircle,
  Clock,
  Plus,
  ArrowRight,
  Play,
  FileText,
  Brain,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  return user.role === "recruiter" ? <RecruiterDashboard /> : <CandidateDashboard />;
}

function RecruiterDashboard() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [sessions, setSessions] = useState<CandidateSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [interviewRes, sessionRes] = await Promise.all([
          api.get("/interviews/"),
          api.get("/sessions/"),
        ]);
        setInterviews(interviewRes.data);
        setSessions(sessionRes.data);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeInterviews = interviews.filter((i) => i.status === "active").length;
  const completedSessions = sessions.filter((s) => s.status === "completed" || s.status === "reviewed").length;
  const stats = [
    { label: "Total Interviews", value: interviews.length, icon: FileText, glow: "violet" as const },
    { label: "Active Interviews", value: activeInterviews, icon: Video, glow: "cyan" as const },
    { label: "Candidates", value: sessions.length, icon: Users, glow: "violet" as const },
    { label: "Completed", value: completedSessions, icon: CheckCircle, glow: "cyan" as const },
  ];

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Recruiter Dashboard</h1>
          <p className="text-white/50 text-sm mt-1">Manage your interviews and review candidates</p>
        </div>
        <Link href="/dashboard/interviews">
          <Button className="btn-gradient text-white border-0 gap-2">
            <Plus className="w-4 h-4" />
            New Interview
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <GlassPanel hover3d glow={stat.glow} className="p-6">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`w-5 h-5 ${stat.glow === "violet" ? "text-violet-400" : "text-cyan-400"}`} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-white/40 mt-1">{stat.label}</p>
            </GlassPanel>
          </motion.div>
        ))}
      </div>

      {/* Recent Interviews */}
      <GlassPanel variant="strong" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Interviews</h2>
          <Link href="/dashboard/interviews" className="text-sm text-violet-400 hover:text-violet-300">
            View all <ArrowRight className="w-3 h-3 inline ml-1" />
          </Link>
        </div>

        {interviews.length === 0 ? (
          <p className="text-white/40 text-sm py-8 text-center">No interviews yet. Create your first one!</p>
        ) : (
          <div className="space-y-3">
            {interviews.slice(0, 5).map((interview) => (
              <Link key={interview.id} href="/dashboard/interviews">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-violet-600/20 flex items-center justify-center">
                      <Video className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/90">{interview.title}</p>
                      <p className="text-xs text-white/40 mt-0.5">
                        {interview.question_count} questions &middot; {interview.session_count} candidates
                      </p>
                    </div>
                  </div>
                  <Badge className={`text-xs ${
                    interview.status === "active"
                      ? "bg-green-500/20 text-green-300 border-green-500/20"
                      : interview.status === "draft"
                      ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/20"
                      : "bg-white/10 text-white/40 border-white/10"
                  }`}>
                    {interview.status}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </GlassPanel>

      {/* Recent Sessions */}
      <GlassPanel variant="strong" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Candidate Sessions</h2>
          <Link href="/dashboard/candidates" className="text-sm text-violet-400 hover:text-violet-300">
            View all <ArrowRight className="w-3 h-3 inline ml-1" />
          </Link>
        </div>

        {sessions.length === 0 ? (
          <p className="text-white/40 text-sm py-8 text-center">No candidate sessions yet.</p>
        ) : (
          <div className="space-y-3">
            {sessions.slice(0, 5).map((session) => (
              <Link key={session.id} href="/dashboard/candidates">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/90">
                        {session.candidate.first_name} {session.candidate.last_name}
                      </p>
                      <p className="text-xs text-white/40 mt-0.5">
                        {session.interview_title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {session.overall_score !== null && (
                      <span className="text-sm font-mono text-violet-400">
                        {session.overall_score.toFixed(0)}%
                      </span>
                    )}
                    <Badge className={`text-xs ${
                      session.status === "completed"
                        ? "bg-green-500/20 text-green-300 border-green-500/20"
                        : session.status === "in_progress"
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/20"
                        : "bg-white/10 text-white/40 border-white/10"
                    }`}>
                      {session.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </GlassPanel>
    </div>
  );
}

function CandidateDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [sessions, setSessions] = useState<CandidateSession[]>([]);
  const [mockSessions, setMockSessions] = useState<MockSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [interviewRes, sessionRes, mockRes] = await Promise.all([
          api.get("/interviews/"),
          api.get("/sessions/"),
          api.get("/mock/sessions/").catch(() => ({ data: [] })),
        ]);
        setInterviews(interviewRes.data);
        setSessions(sessionRes.data);
        setMockSessions(mockRes.data);
      } catch {
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStartInterview = async (interviewId: string) => {
    try {
      const res = await api.post("/sessions/", { interview: interviewId });
      router.push(`/interview/${res.data.id}`);
    } catch {
      toast.error("Failed to start interview");
    }
  };

  const completedCount = sessions.filter((s) => s.status === "completed" || s.status === "reviewed").length;
  const inProgressCount = sessions.filter((s) => s.status === "in_progress").length;

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {user?.first_name}!
        </h1>
        <p className="text-white/50 text-sm mt-1">Practice interviews, track your scores, and improve your skills</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ duration: 0.4 }}>
          <GlassPanel hover3d glow="violet" className="p-6">
            <Video className="w-5 h-5 text-violet-400 mb-3" />
            <p className="text-2xl font-bold text-white">{interviews.length}</p>
            <p className="text-sm text-white/40 mt-1">Available Interviews</p>
          </GlassPanel>
        </motion.div>
        <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.1, duration: 0.4 }}>
          <GlassPanel hover3d glow="cyan" className="p-6">
            <Clock className="w-5 h-5 text-cyan-400 mb-3" />
            <p className="text-2xl font-bold text-white">{inProgressCount}</p>
            <p className="text-sm text-white/40 mt-1">In Progress</p>
          </GlassPanel>
        </motion.div>
        <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.2, duration: 0.4 }}>
          <GlassPanel hover3d glow="violet" className="p-6">
            <CheckCircle className="w-5 h-5 text-violet-400 mb-3" />
            <p className="text-2xl font-bold text-white">{completedCount}</p>
            <p className="text-sm text-white/40 mt-1">Completed</p>
          </GlassPanel>
        </motion.div>
      </div>

      {/* Available Interviews */}
      <GlassPanel variant="strong" className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Available Interviews</h2>

        {interviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/40 text-sm">No interviews available at the moment.</p>
            <Link href="/mock">
              <Button variant="link" className="text-violet-400 mt-2">
                Try practice mode instead
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interviews.map((interview) => {
              const existingSession = sessions.find((s) => s.interview === interview.id);
              return (
                <GlassPanel key={interview.id} variant="subtle" hover3d className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-white/90">{interview.title}</h3>
                    <Badge className="bg-violet-600/20 text-violet-300 border-violet-500/20 text-xs">
                      {interview.question_count} Q
                    </Badge>
                  </div>
                  {interview.description && (
                    <p className="text-sm text-white/40 mb-4 line-clamp-2">{interview.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/30">
                      {Math.floor(interview.max_duration / 60)} min
                    </span>
                    {existingSession ? (
                      existingSession.status === "completed" ? (
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/20 text-xs">
                          Completed
                        </Badge>
                      ) : (
                        <Button
                          onClick={() => router.push(`/interview/${existingSession.id}`)}
                          size="sm"
                          className="btn-gradient text-white border-0 text-xs gap-1"
                        >
                          <Play className="w-3 h-3" />
                          Continue
                        </Button>
                      )
                    ) : (
                      <Button
                        onClick={() => handleStartInterview(interview.id)}
                        size="sm"
                        className="btn-gradient text-white border-0 text-xs gap-1"
                      >
                        <Play className="w-3 h-3" />
                        Start
                      </Button>
                    )}
                  </div>
                </GlassPanel>
              );
            })}
          </div>
        )}
      </GlassPanel>

      {/* My Sessions */}
      {sessions.length > 0 && (
        <GlassPanel variant="strong" className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">My Sessions</h2>
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5"
              >
                <div>
                  <p className="text-sm font-medium text-white/90">{session.interview_title}</p>
                  <p className="text-xs text-white/40 mt-0.5">
                    {session.response_count || 0} responses &middot;{" "}
                    {session.started_at
                      ? new Date(session.started_at).toLocaleDateString()
                      : "Not started"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {session.overall_score !== null && (
                    <span className="text-sm font-mono text-violet-400">
                      {session.overall_score.toFixed(0)}%
                    </span>
                  )}
                  <Badge className={`text-xs ${
                    session.status === "completed"
                      ? "bg-green-500/20 text-green-300 border-green-500/20"
                      : session.status === "in_progress"
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/20"
                      : "bg-white/10 text-white/40 border-white/10"
                  }`}>
                    {session.status.replace("_", " ")}
                  </Badge>
                  {session.status === "in_progress" && (
                    <Button
                      onClick={() => router.push(`/interview/${session.id}`)}
                      size="sm"
                      variant="outline"
                      className="border-white/10 text-white/60 text-xs"
                    >
                      Resume
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      )}

      {/* Mock Interview History */}
      <GlassPanel variant="strong" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Mock Interview History</h2>
          <Link href="/mock">
            <Button size="sm" className="btn-gradient text-white border-0 text-xs gap-1">
              <Brain className="w-3 h-3" />
              New Mock
            </Button>
          </Link>
        </div>

        {mockSessions.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/40 text-sm">No mock interviews yet.</p>
            <Link href="/mock">
              <Button variant="link" className="text-violet-400 mt-2 text-sm">
                Start your first AI mock interview
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {mockSessions.slice(0, 5).map((ms) => (
              <Link
                key={ms.id}
                href={
                  ms.status === "analyzed"
                    ? `/mock/results/${ms.id}`
                    : ms.status === "in_progress"
                    ? `/mock/session/${ms.id}`
                    : `/mock/results/${ms.id}`
                }
              >
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-violet-600/20 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/90 capitalize">
                        {ms.session_type} Interview
                      </p>
                      <p className="text-xs text-white/40 mt-0.5">
                        {ms.question_count} questions &middot;{" "}
                        {new Date(ms.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {ms.overall_score !== null && (
                      <span className="text-sm font-mono text-violet-400">
                        {ms.overall_score.toFixed(0)}%
                      </span>
                    )}
                    <Badge className={`text-xs ${
                      ms.status === "analyzed"
                        ? "bg-green-500/20 text-green-300 border-green-500/20"
                        : ms.status === "in_progress"
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/20"
                        : "bg-yellow-500/20 text-yellow-300 border-yellow-500/20"
                    }`}>
                      {ms.status === "analyzed" ? "scored" : ms.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </GlassPanel>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48 bg-white/5" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 bg-white/5 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 bg-white/5 rounded-xl" />
    </div>
  );
}
