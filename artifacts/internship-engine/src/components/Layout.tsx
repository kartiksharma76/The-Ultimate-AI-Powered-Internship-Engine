import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/internships", label: "Internships" },
  { href: "/profile", label: "Profile" },
  { href: "/ai-assistant", label: "AI Assistant" },
  { href: "/ai-assessments", label: "AI Assessments" },
  { href: "/github-gamification", label: "Developer Rank" },
  { href: "/leaderboards", label: "Leaderboards" },
  { href: "/pricing", label: "Pricing" },
  { href: "/admin", label: "Admin" },
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20 selection:text-primary">
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled 
            ? "py-3 px-4" 
            : "py-5 px-0"
        )}
      >
        <div 
          className={cn(
            "max-w-7xl mx-auto transition-all duration-300",
            scrolled 
              ? "glass-card rounded-2xl px-6 h-14" 
              : "bg-transparent px-4 sm:px-6 h-16 border-b border-transparent"
          )}
        >
          <div className="h-full flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all group-hover:scale-105 active:scale-95">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 group-hover:to-foreground transition-all">InternAI</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border/50">
              {NAV_LINKS.map(link => {
                const isActive = location === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-1.5 rounded-lg text-sm font-semibold transition-all overflow-hidden",
                      isActive
                        ? "text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-primary z-0"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-4">
              <div className="relative group hidden lg:block">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-xl border border-border/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground group-hover:border-primary/30 transition-all cursor-pointer">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  AI Translate: [ EN ]
                </div>
                <div className="absolute top-full right-0 mt-2 w-32 bg-background border rounded-xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all z-[60] overflow-hidden">
                  <div className="p-2 space-y-1">
                    {["EN", "HI", "BN", "ES"].map(lang => (
                      <button key={lang} className="w-full text-left px-3 py-2 rounded-lg text-[10px] font-black hover:bg-primary hover:text-white transition-all">
                        {lang === "EN" ? "English" : lang === "HI" ? "Hindi" : lang === "BN" ? "Bengali" : "Spanish"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-bold text-foreground leading-tight">{user.name}</span>
                    <button 
                      onClick={logout}
                      className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
                    >
                      Logout
                    </button>
                  </div>
                  <Link href="/profile">
                    <div className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5 hover:border-primary transition-all cursor-pointer">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <div className="w-full h-full rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                          {user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              ) : (
                <Link href="/login">
                  <button className="bg-primary text-primary-foreground px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95">
                    Login
                  </button>
                </Link>
              )}

              <button
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-muted border border-border hover:bg-muted/80 transition-all active:scale-95"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                  }
                </svg>
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-full left-4 right-4 mt-2 p-2 glass-card rounded-2xl flex flex-col gap-1 shadow-2xl"
            >
              {NAV_LINKS.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group",
                    location === link.href 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                  <svg className={cn("w-4 h-4 transition-transform group-hover:translate-x-1", location === link.href ? "text-primary-foreground/50" : "text-muted-foreground/30")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 pt-24 pb-12">{children}</main>

      <footer className="border-t border-border/50 py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col gap-4">
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <span className="font-bold text-lg tracking-tight">InternAI</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">
                Empowering the next generation of talent through AI-driven career recommendations and skill analysis.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <h4 className="font-bold text-sm uppercase tracking-wider text-foreground/50">Platform</h4>
                {NAV_LINKS.map(link => (
                  <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.label}</Link>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <h4 className="font-bold text-sm uppercase tracking-wider text-foreground/50">Company</h4>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-sm uppercase tracking-wider text-foreground/50">Newsletter</h4>
              <p className="text-sm text-muted-foreground">Get the latest internship trends and AI insights.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email address" className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95">Join</button>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-border/30 text-center text-xs font-medium text-muted-foreground">
            &copy; {new Date().getFullYear()} InternAI. All recommendations are powered by NVIDIA AI algorithms.
          </div>
        </div>
      </footer>
    </div>
  );
}
