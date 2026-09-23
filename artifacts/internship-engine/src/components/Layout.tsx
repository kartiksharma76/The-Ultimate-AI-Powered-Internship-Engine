import { Link, useLocation } from "wouter";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import AIAssistantWidget from "./AIAssistantWidget";
import { 
  Home, 
  LayoutDashboard, 
  Briefcase, 
  User, 
  MessageSquare, 
  FileCheck, 
  Code2, 
  Trophy, 
  CreditCard, 
  ShieldCheck,
  LogOut,
  Languages,
  Menu,
  X,
  ChevronRight,
  Sun,
  Moon,
  FileText,
  TrendingUp,
  Map,
  Component,
  Brain,
  Network,
  DollarSign,
  Sparkles,
  Ghost,
  Scale,
  Heart,
  Users,
  Activity,
  Globe
} from "lucide-react";

const NAV_GROUPS = [
  {
    label: "Core",
    links: [
      { href: "/", label: "Home", icon: Home },
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/internships", label: "Internships", icon: Briefcase },
      { href: "/profile", label: "Profile", icon: User },
    ]
  },
  {
    label: "Intelligence Hub",
    links: [
      { href: "/ai-assistant", label: "AI Assistant", icon: MessageSquare },
      { href: "/ai-assessments", label: "AI Assessments", icon: FileCheck },
      { href: "/resume-architect", label: "Resume Architect", icon: FileText },
      { href: "/code-architect", label: "Code Architect", icon: Component },
      { href: "/psych-lab", label: "Psychology Lab", icon: Brain },
    ]
  },
  {
    label: "Career Growth",
    links: [
      { href: "/career-multiplier", label: "Career Multiplier", icon: TrendingUp },
      { href: "/global-heatmap", label: "Global Heatmap", icon: Map },
      { href: "/network-engine", label: "Network Engine", icon: Network },
      { href: "/negotiation-sim", label: "Negotiation Sim", icon: DollarSign },
    ]
  },
  {
    label: "Elite Insights",
    links: [
      { href: "/visa-intelligence", label: "Visa Intelligence", icon: ShieldCheck },
      { href: "/salary-benchmarker", label: "Salary Benchmarker", icon: DollarSign },
      { href: "/company-deep-dive", label: "Company Deep-Dive", icon: Briefcase },
      { href: "/tech-evolution", label: "Tech Evolution", icon: Sparkles },
      { href: "/referrals", label: "Referral Network", icon: Network },
      { href: "/open-source", label: "Open Source Hub", icon: Code2 },
      { href: "/mentorship", label: "Elite Mentorship", icon: User },
      { href: "/events", label: "Events & Hackathons", icon: Trophy },
      { href: "/learning-paths", label: "Mastery Paths", icon: Map },
      { href: "/interview-room", label: "Interview Room", icon: MessageSquare },
    ]
  },
  {
    label: "Intelligence Command",
    links: [
      { href: "/talent-scout", label: "AI Talent Scout", icon: Users },
      { href: "/project-architect", label: "Project Architect", icon: Component },
      { href: "/skill-graph", label: "Skill Graph 3D", icon: Network },
      { href: "/market-sentiment", label: "Market Sentiment", icon: TrendingUp },
      { href: "/interview-ghost", label: "Interview Ghost", icon: Ghost },
      { href: "/portfolio-optimizer", label: "Portfolio Optimizer", icon: LayoutDashboard },
      { href: "/legal-assistant", label: "Legal Assistant", icon: Scale },
      { href: "/diversity-insights", label: "Diversity Insights", icon: Heart },
      { href: "/burnout-predictor", label: "Burnout Predictor", icon: Activity },
      { href: "/alumni-hub", label: "Global Alumni Hub", icon: Globe },
    ]
  },
  {
    label: "Performance",
    links: [
      { href: "/github-gamification", label: "Developer Rank", icon: Code2 },
      { href: "/leaderboards", label: "Leaderboards", icon: Trophy },
      { href: "/pricing", label: "Pricing", icon: CreditCard },
      { href: "/admin", label: "Admin", icon: ShieldCheck },
    ]
  }
];

export function useActiveStudent() {
  const { user } = useAuth();
  
  if (typeof window === 'undefined') return 1;
  
  const storedId = localStorage.getItem("activeStudentId");
  if (user?.id) return user.id;
  if (storedId) return parseInt(storedId);
  
  return 1;
}

export function setActiveStudent(id: number) {
  if (typeof window !== 'undefined') {
    localStorage.setItem("activeStudentId", id.toString());
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const NavigationItems = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn("flex flex-col gap-8", mobile ? "px-2" : "px-3")}>
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="flex flex-col gap-2">
          <h3 className="px-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 mb-1">{group.label}</h3>
          <div className="flex flex-col gap-1">
            {group.links.map((link) => {
              const isActive = location === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => mobile && setSidebarOpen(false)}
                  className={cn(
                    "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 overflow-hidden",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className={cn("w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                  <span className="relative z-10">{link.label}</span>
                  {!isActive && (
                    <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-pill"
                      className="absolute inset-0 bg-primary z-0"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 border-r border-border/50 bg-sidebar/30 backdrop-blur-xl z-50">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all group-hover:scale-105 active:scale-95">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 group-hover:to-foreground transition-all">InternAI</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <NavigationItems />
        </div>

        <div className="p-4 mt-auto border-t border-border/50 space-y-4">
          {/* Theme Toggle & AI Translate */}
          <div className="flex items-center gap-2">
            <div className="relative group flex-1">
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-xl border border-border/50 text-[10px] font-black uppercase tracking-wider text-muted-foreground group-hover:text-foreground group-hover:border-primary/30 transition-all cursor-pointer">
                <Languages className="w-3.5 h-3.5 text-primary" />
                <span>Translate: [ EN ]</span>
              </div>
              <div className="absolute bottom-full left-0 mb-2 w-full bg-background border rounded-xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all z-[60] overflow-hidden">
                <div className="p-2 grid grid-cols-2 gap-1">
                  {["EN", "HI", "BN", "ES"].map(lang => (
                    <button key={lang} className="text-left px-2 py-1.5 rounded-lg text-[9px] font-black hover:bg-primary hover:text-white transition-all uppercase">
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {mounted && (
              <button 
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 bg-muted/50 border border-border/50 rounded-xl hover:bg-primary/10 hover:text-primary transition-all group"
                title="Toggle Theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* User Profile / Logout */}
          {user ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-muted/30 border border-border/20 group hover:border-primary/30 transition-all">
                <div className="w-9 h-9 rounded-full border border-primary/20 p-0.5 overflow-hidden shrink-0 group-hover:border-primary transition-colors">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold text-foreground truncate">
                    {typeof user.name === "string" ? user.name : (user.name as any)?.employee || "Student"}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    <span className="text-[9px] text-primary font-black uppercase tracking-tight">Premium Member</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={logout}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button className="w-full bg-primary text-primary-foreground px-5 py-3 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-2">
                <User className="w-4 h-4" />
                Login
              </button>
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">InternAI</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted border border-border hover:bg-muted/80 transition-all active:scale-95"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-background border-r border-border/50 z-[70] lg:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <span className="font-bold text-xl tracking-tight">InternAI</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                <NavigationItems mobile />
              </div>
              <div className="p-4 border-t border-border/50 space-y-4">
                {user ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{user.name}</span>
                      <button onClick={logout} className="text-xs text-primary font-bold text-left">Logout</button>
                    </div>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setSidebarOpen(false)}>
                    <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold">Login</button>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 lg:p-8 pt-20 lg:pt-8 pb-12">
          <div className="max-w-[1440px] mx-auto h-full">
            {children}
          </div>
        </main>

        <footer className="border-t border-border/50 py-12 bg-muted/10">
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary fill-current">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <span className="font-bold text-xl tracking-tight">InternAI</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Empowering the next generation of talent through AI-driven career recommendations and skill analysis.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-4">
                  <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/60">Platform</h4>
                  <div className="flex flex-col gap-2.5">
                    {NAV_GROUPS.flatMap(g => g.links).slice(0, 8).map(link => (
                      <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">{link.label}</Link>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/60">Support</h4>
                  <div className="flex flex-col gap-2.5">
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Documentation</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Privacy Policy</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Terms of Service</a>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/60">Newsletter</h4>
                <div className="flex gap-2">
                  <input type="email" placeholder="Email address" className="flex-1 bg-muted/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                  <button className="bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95">Join</button>
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-muted-foreground/50 uppercase tracking-widest">
              <span>&copy; {new Date().getFullYear()} InternAI. All rights reserved.</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                Powered by NVIDIA AI
              </span>
            </div>
          </div>
        </footer>
      </div>
      <AIAssistantWidget />
    </div>
  );
}


