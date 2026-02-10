"use client";

import Link from "next/link";
import GlassPanel from "@/components/GlassPanel";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Brain,
  Video,
  BarChart3,
  ArrowRight,
  ChevronRight,
  GraduationCap,
  Target,
  TrendingUp,
  Mic,
  Shield,
  Zap,
  Star,
  CheckCircle2,
  MessageSquare,
  SmilePlus,
  Award,
  BookOpen,
  Clock,
  Users,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[200px] animate-float-slow pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[180px] animate-float-delay-2 pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 glass-subtle border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-400" />
            <span className="text-xl font-bold text-gradient">MockPrep.AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/mock">
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5">
                Try Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="btn-gradient text-white border-0">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm text-white/70">
            <GraduationCap className="w-4 h-4 text-violet-400" />
            AI-Powered Mock Interview Practice Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="text-violet-400">Ace Your Next</span>
            <br />
            <span className="text-white">Interview</span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10">
            Practice mock interviews with AI-powered feedback, real-time emotion tracking,
            and detailed scoring. Perfect for students and professionals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="btn-gradient text-white border-0 px-8 h-12 text-base gap-2">
                Start Practicing Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/mock">
              <Button
                size="lg"
                variant="outline"
                className="border-white/10 text-white/70 hover:bg-white/5 hover:text-white px-8 h-12 text-base"
              >
                Try Mock Interview
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Preview Card */}
        <div className="mt-16 max-w-3xl mx-auto">
          <GlassPanel variant="strong" className="p-1">
            <div className="rounded-lg bg-gradient-to-br from-violet-600/10 to-cyan-500/10 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="w-full aspect-video rounded-lg bg-black/40 flex items-center justify-center border border-white/10">
                    <Video className="w-12 h-12 text-white/20" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 recording-pulse" />
                    <span className="text-sm text-white/50">Recording</span>
                    <span className="text-sm text-white/70 ml-auto font-mono">02:34</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <GlassPanel variant="subtle" className="p-4">
                    <p className="text-sm text-white/40 mb-2">Question 3 of 5</p>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Tell me about a time you led a team project under a tight deadline...
                    </p>
                  </GlassPanel>
                  <div className="flex gap-2">
                    {["Behavioral", "Medium", "2 min"].map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs bg-violet-600/20 text-violet-300 border border-violet-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <GlassPanel variant="subtle" className="p-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-white/50">AI Score: </span>
                      <span className="text-sm font-bold text-green-400">82/100</span>
                    </div>
                  </GlassPanel>
                </div>
              </div>
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <GlassPanel variant="strong" className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "10K+", label: "Mock Interviews", icon: Video },
              { value: "95%", label: "Improvement Rate", icon: TrendingUp },
              { value: "50+", label: "Question Types", icon: BookOpen },
              { value: "4.9/5", label: "User Rating", icon: Star },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2">
                <stat.icon className="w-5 h-5 text-violet-400" />
                <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/40">{stat.label}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </section>

      {/* What We Offer - Feature Cards */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need to{" "}
            <span className="text-violet-400">Nail Your Interview</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            A complete AI-powered practice platform that gives you real interview experience and actionable insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Brain,
              title: "AI-Powered Scoring",
              description: "Get instant scores out of 100 with detailed feedback on communication, relevance, structure, and confidence for each answer.",
              color: "violet",
              badge: "Core Feature",
            },
            {
              icon: Video,
              title: "Video Recording",
              description: "Record yourself answering real interview questions on camera. Review your body language and presentation skills.",
              color: "cyan",
              badge: "Practice Mode",
            },
            {
              icon: SmilePlus,
              title: "Emotion Analysis",
              description: "Real-time facial emotion tracking during your interview. Understand how confident, happy, and calm you appear on camera.",
              color: "violet",
              badge: "AI Powered",
            },
            {
              icon: Mic,
              title: "Speech Transcription",
              description: "Your answers are automatically transcribed by AI. Read back exactly what you said and identify filler words or gaps.",
              color: "cyan",
              badge: "Automatic",
            },
            {
              icon: BarChart3,
              title: "Detailed Analytics",
              description: "Track your scores across sessions. See improvement trends in communication, confidence, and technical accuracy over time.",
              color: "violet",
              badge: "Progress",
            },
            {
              icon: MessageSquare,
              title: "Behavioral Insights",
              description: "Receive AI-generated insights about your communication style, interview readiness level, strengths, and areas to improve.",
              color: "cyan",
              badge: "Personalized",
            },
          ].map((feature) => (
            <GlassPanel
              key={feature.title}
              hover3d
              glow={feature.color as "violet" | "cyan"}
              className="p-8 h-full group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  feature.color === "violet" ? "bg-violet-600/20" : "bg-cyan-500/20"
                }`}>
                  <feature.icon className={`w-6 h-6 ${
                    feature.color === "violet" ? "text-violet-400" : "text-cyan-400"
                  }`} />
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                  feature.color === "violet"
                    ? "bg-violet-600/10 text-violet-300 border-violet-500/20"
                    : "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
                }`}>
                  {feature.badge}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
            </GlassPanel>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It <span className="text-cyan-400">Works</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Start practicing in under a minute. No complex setup required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-gradient-to-r from-violet-600/40 via-cyan-500/40 to-violet-600/40" />

          {[
            { num: "01", title: "Pick Your Focus", desc: "Choose behavioral, technical, or mixed interview practice. Select 3-10 questions per session.", icon: Target },
            { num: "02", title: "Record Answers", desc: "Answer questions on camera with a real interview timer. AI tracks your facial expressions in real-time.", icon: Video },
            { num: "03", title: "Get AI Insights", desc: "Receive detailed scores, speech transcripts, emotion analysis, and personalized improvement tips.", icon: Award },
          ].map((step) => (
            <div key={step.num} className="text-center">
              <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full glass-strong mb-6">
                <span className="text-2xl font-bold text-violet-400">{step.num}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-white/50 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What You'll Get - Detailed Score Preview */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Your <span className="text-violet-400">Results</span> Look Like
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            After each mock interview, you get a comprehensive AI-generated report.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Score Card Preview */}
          <GlassPanel variant="strong" className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-4">Overall Performance</h3>
            <div className="flex items-center gap-6 mb-6">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${78 * 2.64} ${264}`} />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">78</span>
                </div>
              </div>
              <div className="space-y-2 flex-1">
                {[
                  { label: "Communication", value: 82, color: "bg-violet-500" },
                  { label: "Relevance", value: 75, color: "bg-cyan-500" },
                  { label: "Structure", value: 80, color: "bg-violet-500" },
                  { label: "Confidence", value: 70, color: "bg-cyan-500" },
                ].map((sub) => (
                  <div key={sub.label} className="flex items-center gap-3">
                    <span className="text-xs text-white/40 w-24">{sub.label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/5">
                      <div className={`h-full rounded-full ${sub.color}`} style={{ width: `${sub.value}%` }} />
                    </div>
                    <span className="text-xs text-white/60 w-8">{sub.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassPanel>

          {/* AI Feedback Preview */}
          <GlassPanel variant="strong" className="p-6">
            <h3 className="text-sm font-medium text-white/60 mb-4">AI Feedback Sample</h3>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                <p className="text-xs font-medium text-green-400 mb-1">Strengths</p>
                <div className="flex flex-wrap gap-1.5">
                  {["Clear communication", "Good examples", "Structured answer"].map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-green-500/10 text-green-300 border border-green-500/15">
                      <CheckCircle2 className="w-2.5 h-2.5" /> {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                <p className="text-xs font-medium text-amber-400 mb-1">Areas to Improve</p>
                <div className="flex flex-wrap gap-1.5">
                  {["Add more metrics", "Reduce filler words", "Eye contact"].map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/15">
                      <Zap className="w-2.5 h-2.5" /> {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-violet-500/5 border border-violet-500/10">
                <p className="text-xs font-medium text-violet-400 mb-1">Emotion Analysis</p>
                <div className="flex gap-4 mt-2">
                  {[
                    { label: "Confident", pct: 45 },
                    { label: "Happy", pct: 30 },
                    { label: "Neutral", pct: 20 },
                  ].map((e) => (
                    <div key={e.label} className="text-center flex-1">
                      <div className="h-16 rounded bg-white/5 relative overflow-hidden mb-1">
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-violet-500/40 to-violet-500/10"
                          style={{ height: `${e.pct}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-white/40">{e.label}</p>
                      <p className="text-xs font-medium text-white/70">{e.pct}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* Interview Types */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Practice <span className="text-cyan-400">Any Interview Type</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Prepare for every scenario with our curated question bank.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              title: "Behavioral",
              icon: MessageSquare,
              questions: ["Tell me about yourself", "Describe a challenge you overcame", "Leadership experience", "Teamwork examples"],
              color: "violet",
              desc: "STAR method questions to showcase your soft skills",
            },
            {
              title: "Technical",
              icon: Brain,
              questions: ["System design concepts", "Problem-solving approach", "Technical decision making", "Project architecture"],
              color: "cyan",
              desc: "Technical thinking and problem-solving questions",
            },
            {
              title: "Mixed",
              icon: Zap,
              questions: ["Combination of behavioral & technical", "Situational judgment", "Case study questions", "Role-specific scenarios"],
              color: "violet",
              desc: "Best simulation of a real interview experience",
            },
          ].map((type) => (
            <GlassPanel
              key={type.title}
              hover3d
              glow={type.color as "violet" | "cyan"}
              className="p-6 h-full"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  type.color === "violet" ? "bg-violet-600/20" : "bg-cyan-500/20"
                }`}>
                  <type.icon className={`w-5 h-5 ${type.color === "violet" ? "text-violet-400" : "text-cyan-400"}`} />
                </div>
                <h3 className="text-lg font-semibold text-white">{type.title}</h3>
              </div>
              <p className="text-white/40 text-xs mb-4">{type.desc}</p>
              <ul className="space-y-2">
                {type.questions.map((q) => (
                  <li key={q} className="flex items-start gap-2 text-sm text-white/60">
                    <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                      type.color === "violet" ? "text-violet-400/60" : "text-cyan-400/60"
                    }`} />
                    {q}
                  </li>
                ))}
              </ul>
            </GlassPanel>
          ))}
        </div>
      </section>

      {/* Who It's For */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Built for <span className="text-violet-400">You</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <GlassPanel hover3d glow="violet" className="p-8">
            <GraduationCap className="w-8 h-8 text-violet-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">College Students</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Preparing for campus placements, internships, or your first job? Practice behavioral and technical questions with AI coaching.
            </p>
            <ul className="space-y-2">
              {["Campus placement prep", "Internship interview practice", "Build confidence before D-day"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-white/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-400/60" />
                  {item}
                </li>
              ))}
            </ul>
          </GlassPanel>
          <GlassPanel hover3d glow="cyan" className="p-8">
            <TrendingUp className="w-8 h-8 text-cyan-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Working Professionals</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Switching jobs or going for a promotion? Sharpen your skills with realistic practice and detailed performance insights.
            </p>
            <ul className="space-y-2">
              {["Career switch preparation", "Leadership role interviews", "Track improvement over time"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-white/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400/60" />
                  {item}
                </li>
              ))}
            </ul>
          </GlassPanel>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why <span className="text-cyan-400">MockPrep.AI</span>?
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: Zap, title: "Instant AI Feedback", desc: "No waiting. Get scores and insights in seconds." },
            { icon: Shield, title: "100% Private", desc: "Your videos and data stay on your account only." },
            { icon: Clock, title: "Practice Anytime", desc: "24/7 availability. No scheduling needed." },
            { icon: SmilePlus, title: "Emotion Tracking", desc: "See how you look on camera with AI analysis." },
            { icon: Mic, title: "Auto Transcription", desc: "Read back exactly what you said in each answer." },
            { icon: Users, title: "Free to Start", desc: "Try unlimited practice mode without signing up." },
          ].map((item) => (
            <GlassPanel key={item.title} variant="subtle" className="p-5 flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-violet-600/15 flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            </GlassPanel>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <GlassPanel variant="strong" className="p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Ace Your Next Interview?
            </h2>
            <p className="text-white/50 max-w-lg mx-auto mb-8">
              Join thousands of students and professionals using AI-powered mock interviews to land their dream roles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="btn-gradient text-white border-0 px-8 h-12 text-base gap-2">
                  Get Started Free
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/mock">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/10 text-white/70 hover:bg-white/5 px-8 h-12 text-base"
                >
                  Try Without Signing Up
                </Button>
              </Link>
            </div>
          </div>
        </GlassPanel>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <GlassPanel variant="subtle" className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <span className="font-semibold text-gradient">MockPrep.AI</span>
            </div>
            <p className="text-sm text-white/30">
              &copy; 2026 MockPrep.AI. AI-powered interview practice for students & professionals.
            </p>
          </GlassPanel>
        </div>
      </footer>
    </div>
  );
}
