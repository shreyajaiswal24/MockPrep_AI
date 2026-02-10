"use client";

import { useAuth } from "@/context/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import GlassPanel from "@/components/GlassPanel";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Video,
  Users,
  Brain,
  LogOut,
  Sparkles,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const recruiterNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/interviews", label: "Interviews", icon: Video },
  { href: "/dashboard/candidates", label: "Candidates", icon: Users },
];

const candidateNav = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/interviews", label: "Interviews", icon: Video },
  { href: "/mock", label: "AI Mock", icon: Brain },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = user?.role === "recruiter" ? recruiterNav : candidateNav;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const initials = user ? `${user.first_name[0] || ""}${user.last_name[0] || ""}`.toUpperCase() : "?";

  return (
    <AuthGuard>
      <div className="min-h-screen flex bg-grid">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:transform-none ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <GlassPanel variant="strong" className="h-full flex flex-col rounded-none border-r border-white/5">
            {/* Logo */}
            <div className="p-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-violet-400" />
              <span className="text-xl font-bold text-gradient">MockPrep.AI</span>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-violet-600/20 text-violet-300 border border-violet-500/20"
                        : "text-white/60 hover:text-white/90 hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* User section */}
            <div className="p-4 border-t border-white/5">
              <div className="flex items-center gap-3">
                <Avatar className="w-9 h-9 bg-violet-600/30 border border-violet-500/30">
                  <AvatarFallback className="bg-transparent text-violet-300 text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/90 truncate">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-white/40 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </GlassPanel>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="glass-subtle border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white/60 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="hidden lg:block" />

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                <Avatar className="w-8 h-8 bg-violet-600/30 border border-violet-500/30">
                  <AvatarFallback className="bg-transparent text-violet-300 text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm hidden sm:inline">{user?.first_name}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-strong border-white/10 text-white/80">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          {/* Page content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
