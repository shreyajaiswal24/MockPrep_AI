"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GlassPanel from "@/components/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, EyeOff, Sparkles, User, Briefcase } from "lucide-react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    role: "candidate" as "candidate" | "recruiter",
    password: "",
    password_confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setIsSubmitting(true);

    try {
      await register(formData);
      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-grid relative overflow-hidden">
      <div className="absolute top-20 right-20 w-72 h-72 bg-violet-600/20 rounded-full blur-[120px] animate-float-slow" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px] animate-float-delay-2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <GlassPanel variant="strong" className="p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-violet-400" />
              <h1 className="text-2xl font-bold text-gradient">MockPrep.AI</h1>
            </div>
            <p className="text-white/60 text-sm">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role toggle */}
            <div className="flex gap-2 p-1 rounded-lg bg-white/5">
              <button
                type="button"
                onClick={() => handleChange("role", "candidate")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                  formData.role === "candidate"
                    ? "bg-violet-600 text-white shadow-lg"
                    : "text-white/50 hover:text-white/70"
                }`}
              >
                <User className="w-4 h-4" />
                Candidate
              </button>
              <button
                type="button"
                onClick={() => handleChange("role", "recruiter")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                  formData.role === "recruiter"
                    ? "bg-violet-600 text-white shadow-lg"
                    : "text-white/50 hover:text-white/70"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Recruiter
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm text-white/70">First Name</label>
                <Input
                  placeholder="John"
                  value={formData.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  required
                  className="bg-white/5 border-white/10 focus:border-violet-500/50 text-white placeholder:text-white/30"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/70">Last Name</label>
                <Input
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  required
                  className="bg-white/5 border-white/10 focus:border-violet-500/50 text-white placeholder:text-white/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70">Username</label>
              <Input
                placeholder="johndoe"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                required
                className="bg-white/5 border-white/10 focus:border-violet-500/50 text-white placeholder:text-white/30"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                className="bg-white/5 border-white/10 focus:border-violet-500/50 text-white placeholder:text-white/30"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 characters"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                  minLength={8}
                  className="bg-white/5 border-white/10 focus:border-violet-500/50 text-white placeholder:text-white/30 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70">Confirm Password</label>
              <Input
                type="password"
                placeholder="Confirm your password"
                value={formData.password_confirm}
                onChange={(e) => handleChange("password_confirm", e.target.value)}
                required
                minLength={8}
                className="bg-white/5 border-white/10 focus:border-violet-500/50 text-white placeholder:text-white/30"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-gradient text-white font-medium h-11 border-0"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-white/50">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
              Sign in
            </Link>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  );
}
