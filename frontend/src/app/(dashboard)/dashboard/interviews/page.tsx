"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Interview, QuestionCategory } from "@/types";
import { useAuth } from "@/context/AuthContext";
import GlassPanel from "@/components/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Plus,
  Video,
  CheckCircle,
} from "lucide-react";

export default function InterviewsPage() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [categories, setCategories] = useState<QuestionCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newInterview, setNewInterview] = useState({
    title: "",
    description: "",
    questions: [] as string[],
    status: "draft" as "draft" | "active",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [interviewRes, categoryRes] = await Promise.all([
        api.get("/interviews/"),
        api.get("/questions/categories/"),
      ]);
      setInterviews(interviewRes.data);
      setCategories(categoryRes.data);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateInterview = async () => {
    if (!newInterview.title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (newInterview.questions.length === 0) {
      toast.error("Please select at least one question");
      return;
    }

    try {
      await api.post("/interviews/", newInterview);
      toast.success("Interview created!");
      setIsDialogOpen(false);
      setNewInterview({ title: "", description: "", questions: [], status: "draft" });
      fetchData();
    } catch {
      toast.error("Failed to create interview");
    }
  };

  const toggleQuestion = (qId: string) => {
    setNewInterview((prev) => ({
      ...prev,
      questions: prev.questions.includes(qId)
        ? prev.questions.filter((id) => id !== qId)
        : [...prev.questions, qId],
    }));
  };

  const handleStatusChange = async (interviewId: string, newStatus: string) => {
    try {
      await api.patch(`/interviews/${interviewId}/`, { status: newStatus });
      toast.success(`Interview ${newStatus === "active" ? "activated" : "updated"}`);
      fetchData();
    } catch {
      toast.error("Failed to update");
    }
  };

  if (user?.role !== "recruiter") {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Available Interviews</h1>
        <CandidateInterviewList />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-white/5" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 bg-white/5 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Interviews</h1>
          <p className="text-white/50 text-sm mt-1">Create and manage your interviews</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient text-white border-0 gap-2">
              <Plus className="w-4 h-4" />
              Create Interview
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-strong border-white/10 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Interview</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm text-white/70">Title</label>
                <Input
                  placeholder="e.g. Senior Frontend Developer Interview"
                  value={newInterview.title}
                  onChange={(e) => setNewInterview((prev) => ({ ...prev, title: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/70">Description</label>
                <Textarea
                  placeholder="Interview description..."
                  value={newInterview.description}
                  onChange={(e) => setNewInterview((prev) => ({ ...prev, description: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/70">Status</label>
                <Select
                  value={newInterview.status}
                  onValueChange={(val) => setNewInterview((prev) => ({ ...prev, status: val as "draft" | "active" }))}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-strong border-white/10 text-white">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <label className="text-sm text-white/70">
                  Questions ({newInterview.questions.length} selected)
                </label>
                {categories.map((cat) => (
                  <div key={cat.id}>
                    <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">{cat.name}</p>
                    <div className="space-y-2">
                      {cat.questions.map((q) => (
                        <button
                          key={q.id}
                          onClick={() => toggleQuestion(q.id)}
                          className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
                            newInterview.questions.includes(q.id)
                              ? "bg-violet-600/20 border-violet-500/30 text-white/90"
                              : "bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/[0.04]"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {newInterview.questions.includes(q.id) && (
                              <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
                            )}
                            <span className="line-clamp-1">{q.text}</span>
                          </div>
                          <div className="flex gap-2 mt-1.5">
                            <Badge className="text-[10px] bg-white/5 text-white/40 border-white/10">
                              {q.difficulty}
                            </Badge>
                            <Badge className="text-[10px] bg-white/5 text-white/40 border-white/10">
                              {Math.floor(q.time_limit / 60)}m
                            </Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleCreateInterview}
                className="w-full btn-gradient text-white border-0"
              >
                Create Interview
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {interviews.length === 0 ? (
        <GlassPanel className="p-12 text-center">
          <Video className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No interviews yet. Create your first one!</p>
        </GlassPanel>
      ) : (
        <div className="space-y-4">
          {interviews.map((interview, i) => (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassPanel variant="subtle" className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-violet-600/20 flex items-center justify-center flex-shrink-0">
                      <Video className="w-5 h-5 text-violet-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-white/90 truncate">{interview.title}</h3>
                      <p className="text-xs text-white/40 mt-0.5">
                        {interview.question_count} questions &middot; {interview.session_count} candidates
                        &middot; {new Date(interview.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge className={`text-xs ${
                      interview.status === "active"
                        ? "bg-green-500/20 text-green-300 border-green-500/20"
                        : interview.status === "draft"
                        ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/20"
                        : "bg-white/10 text-white/40 border-white/10"
                    }`}>
                      {interview.status}
                    </Badge>
                    {interview.status === "draft" && (
                      <Button
                        onClick={() => handleStatusChange(interview.id, "active")}
                        size="sm"
                        className="btn-gradient text-white border-0 text-xs"
                      >
                        Activate
                      </Button>
                    )}
                    {interview.status === "active" && (
                      <Button
                        onClick={() => handleStatusChange(interview.id, "closed")}
                        size="sm"
                        variant="outline"
                        className="border-white/10 text-white/60 text-xs"
                      >
                        Close
                      </Button>
                    )}
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function CandidateInterviewList() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [sessions, setSessions] = useState<import("@/types").CandidateSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
        toast.error("Failed to load interviews");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStart = async (interviewId: string) => {
    try {
      const res = await api.post("/sessions/", { interview: interviewId });
      router.push(`/interview/${res.data.id}`);
    } catch {
      toast.error("Failed to start");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => <Skeleton key={i} className="h-24 bg-white/5 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {interviews.map((interview) => {
        const session = sessions.find((s) => s.interview === interview.id);
        return (
          <GlassPanel key={interview.id} variant="subtle" hover3d className="p-5">
            <h3 className="font-medium text-white/90 mb-1">{interview.title}</h3>
            <p className="text-sm text-white/40 mb-4 line-clamp-2">{interview.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/30">{interview.question_count} questions</span>
              {session?.status === "completed" ? (
                <Badge className="bg-green-500/20 text-green-300 border-green-500/20 text-xs">Completed</Badge>
              ) : session?.status === "in_progress" ? (
                <Button
                  onClick={() => router.push(`/interview/${session.id}`)}
                  size="sm"
                  className="btn-gradient text-white border-0 text-xs"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={() => handleStart(interview.id)}
                  size="sm"
                  className="btn-gradient text-white border-0 text-xs"
                >
                  Start
                </Button>
              )}
            </div>
          </GlassPanel>
        );
      })}
    </div>
  );
}
