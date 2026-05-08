import { useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetDashboardAnalytics,
  useGetDomainStats,
  useGetTopSkills,
  useListStudents,
  useGetRecommendations,
} from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area
} from "recharts";
import { getScoreBg, getDomainColor, formatDate, cn } from "@/lib/utils";
import { useActiveStudent } from "@/components/Layout";
import { Activity, LayoutDashboard, Target, Users, Zap, Award, BookOpen, ChevronRight, TrendingUp, Briefcase, CheckCircle2, Clock, ExternalLink, Bell, MessageSquare, Sparkles } from "lucide-react";

const COLORS = ["#7c3aed", "#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];

function StatCard({ label, value, sub, color, icon: Icon, delay = 0 }: { label: string; value: string | number; sub?: string; color?: string; icon: any; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card rounded-[2rem] p-6 hover:border-primary/30 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 rounded-2xl bg-muted/50 group-hover:scale-110 transition-transform duration-300", color)}>
          <Icon className="w-5 h-5 text-current" />
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Realtime</div>
      </div>
      <div className="text-3xl font-black tracking-tight mb-1">{value}</div>
      <div className="text-xs font-bold text-muted-foreground">{label}</div>
      {sub && <div className="text-[10px] font-medium text-primary mt-3 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {sub}</div>}
    </motion.div>
  );
}

export default function DashboardPage() {
  const studentId = useActiveStudent();
  const { data: analytics, isLoading: analyticsLoading } = useGetDashboardAnalytics();
  const { data: domainStats } = useGetDomainStats();
  const { data: topSkills } = useGetTopSkills();
  const { data: students } = useListStudents();
  const { data: recommendations, refetch: refetchRecs } = useGetRecommendations(studentId, undefined, { 
    query: { 
      queryKey: ["recommendations", studentId],
      staleTime: 0,
      refetchOnWindowFocus: true 
    } 
  });

  // Custom query for applications history
  const { data: applications, isLoading: appsLoading } = useQuery({
    queryKey: ["applications", studentId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8080/api/applications/student/${studentId}`);
      if (!res.ok) throw new Error("Failed to fetch applications");
      return res.json() as Promise<any[]>;
    },
    enabled: !!studentId,
  });

  // Fetch Real Notifications
  const { data: notifications, refetch: refetchNotifications } = useQuery({
    queryKey: ["notifications", studentId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8080/api/notifications/${studentId}`);
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return res.json() as Promise<any[]>;
    },
    enabled: !!studentId,
  });

  const markAsRead = async (id: number) => {
    await fetch(`http://localhost:8080/api/notifications/${id}/read`, { method: "PATCH" });
    refetchNotifications();
  };

  useEffect(() => {
    if (notifications && notifications.length === 0 && studentId) {
      // Simulate a notification for demonstration
      fetch("http://localhost:8080/api/notifications/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          type: "match",
          title: "Premium Match Found!",
          message: "Our AI model just identified a high-affinity internship at Google India that matches your profile."
        })
      }).then(() => refetchNotifications());
    }
  }, [notifications, studentId]);

  const student = students?.find(s => s.id === studentId);

  const getStatusDisplay = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied': return { label: 'DONE', color: 'bg-emerald-500/10 text-emerald-500', icon: CheckCircle2 };
      case 'selected': return { label: 'SELECTED', color: 'bg-primary/10 text-primary', icon: Award };
      case 'pending': return { label: 'PENDING', color: 'bg-amber-500/10 text-amber-500', icon: Clock };
      default: return { label: status.toUpperCase(), color: 'bg-muted text-muted-foreground', icon: Activity };
    }
  };

  if (analyticsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card rounded-[2rem] p-8 animate-pulse h-40" />
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 glass-card rounded-[2rem] h-[400px] animate-pulse" />
          <div className="lg:col-span-2 glass-card rounded-[2rem] h-[400px] animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative">
      <div className="fixed inset-0 pointer-events-none opacity-[0.3] mesh-gradient -z-10" />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <LayoutDashboard className="w-5 h-5 text-primary" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Intelligence Center</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Platform <span className="text-gradient">Insights</span></h1>
          {student && (
            <p className="text-muted-foreground font-medium">
              Welcome back, <span className="text-foreground font-black">{student.name}</span>. Here is your ecosystem snapshot.
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-10 h-10 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="avatar" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-4 border-background bg-primary flex items-center justify-center text-[10px] font-black text-white">
              +12
            </div>
          </div>
          <div className="h-10 w-[1px] bg-border mx-2" />
          <button className="px-6 py-3 bg-foreground text-background rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl">
            Export Data
          </button>
        </div>
      </div>

      {/* Real-time AI Notification Engine */}
      <AnimatePresence>
        {notifications?.filter(n => !n.isRead).map((notif, i) => (
          <motion.div 
            key={notif.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: i * 0.1 }}
            className="mb-6 p-5 bg-primary/10 border border-primary/20 rounded-[2rem] flex items-center justify-between group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 animate-pulse">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary px-2 py-0.5 bg-primary/10 rounded-md">{notif.type}</span>
                  <span className="text-[9px] font-bold text-muted-foreground">{formatDate(notif.createdAt)}</span>
                </div>
                <p className="text-sm font-black tracking-tight">{notif.title}</p>
                <p className="text-[11px] font-medium text-muted-foreground/80">{notif.message}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <button 
                onClick={() => markAsRead(notif.id)}
                className="px-5 py-2.5 bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                Dismiss
              </button>
              {notif.type === 'match' && (
                <Link href={`/recommendations/${studentId}`}>
                  <button className="p-2.5 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          label="Total Opportunities" 
          value={analytics?.totalInternships ?? 0} 
          sub="12% increase this week" 
          color="text-primary" 
          icon={Target}
          delay={0.1}
        />
        <StatCard 
          label="Global Talent" 
          value={analytics?.totalStudents ?? 0} 
          sub="New members joined" 
          color="text-accent" 
          icon={Users}
          delay={0.2}
        />
        <StatCard 
          label="Match Precision" 
          value={`${analytics?.avgMatchScore?.toFixed(1) ?? 0}%`} 
          sub="Profile compatibility" 
          color="text-emerald-500" 
          icon={Zap}
          delay={0.3}
        />
        <StatCard 
          label="Applications Sent" 
          value={applications?.length ?? 0} 
          sub="Your active pipeline" 
          color="text-violet-500" 
          icon={Award}
          delay={0.4}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Domain Analytics */}
        <div className="lg:col-span-1 glass-card rounded-[2.5rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Domain Density
            </h3>
          </div>
          {domainStats && domainStats.length > 0 ? (
            <div className="flex flex-col h-full">
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={domainStats} 
                      dataKey="count" 
                      nameKey="domain" 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={60} 
                      outerRadius={90} 
                      paddingAngle={8}
                      stroke="none"
                    >
                      {domainStats.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} className="hover:opacity-80 transition-opacity outline-none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                      itemStyle={{ fontWeight: '900', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 space-y-3">
                {domainStats.slice(0, 5).map((stat, i) => (
                  <div key={stat.domain} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">{stat.domain}</span>
                    </div>
                    <span className="text-xs font-black">{stat.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
              <div className="w-12 h-12 bg-muted/50 rounded-2xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 opacity-20" />
              </div>
              <p className="text-xs font-bold">Awaiting Data Streams</p>
            </div>
          )}
        </div>

        {/* My Applications Section */}
        <div className="lg:col-span-2 glass-card rounded-[2.5rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-accent" />
              My Applications Matrix
            </h3>
            <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" /> Real-time Tracking
            </div>
          </div>
          
          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
            {appsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-muted/20 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : applications && applications.length > 0 ? (
              applications.map((app, i) => {
                const status = getStatusDisplay(app.status);
                const StatusIcon = status.icon;
                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-5 rounded-2xl bg-muted/10 border border-border/50 hover:border-primary/20 hover:bg-muted/20 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-primary font-black shadow-sm group-hover:scale-110 transition-transform">
                      {app.company.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-sm text-foreground truncate">{app.title}</div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        {app.company} &middot; {formatDate(app.createdAt)}
                      </div>
                    </div>
                    <div className={cn("px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-black text-[9px] tracking-wider", status.color)}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <div className="p-4 bg-muted/30 rounded-full mb-4">
                  <Briefcase className="w-8 h-8" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest">No Applications Yet</p>
                <Link href="/internships" className="text-[10px] font-black text-primary mt-4 hover:underline">
                  START APPLYING <ChevronRight className="w-3 h-3 inline" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Industry Postings Section */}
        <div className="glass-card rounded-[2.5rem] p-8 border-accent/20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-accent" />
              Industry Postings (Companies)
            </h3>
            <Link href="/internships" className="text-[10px] font-black text-accent hover:underline uppercase tracking-widest flex items-center gap-1">
              Explore All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {recommendations && recommendations.map((rec, i) => (
              <div key={rec.internship.id} className="p-4 rounded-2xl bg-muted/5 border border-border/50 hover:border-accent/30 transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black px-2 py-1 bg-accent/10 text-accent rounded-lg uppercase">{rec.internship.company}</span>
                  <span className="text-[10px] font-bold text-muted-foreground">{rec.internship.location}</span>
                </div>
                <div className="font-black text-sm mb-1">{rec.internship.title}</div>
                <div className="flex gap-2">
                  {(rec.internship.requiredSkills as string[] || []).slice(0, 2).map(s => (
                    <span key={s} className="text-[8px] font-bold px-2 py-0.5 bg-muted rounded-md text-muted-foreground uppercase">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personalized AI Matcher */}
        <div className="glass-card rounded-[2.5rem] p-8 border-primary/20 bg-primary/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-xs uppercase tracking-widest text-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              AI Skill Matcher (For You)
            </h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => refetchRecs()}
                className="p-2 hover:bg-primary/10 rounded-xl transition-all text-primary"
                title="Refresh Recommendations"
              >
                <Zap className="w-3.5 h-3.5" />
              </button>
              <div className="px-2 py-1 bg-primary/20 text-primary text-[8px] font-black rounded-lg animate-pulse">LIVE AI</div>
            </div>
          </div>
          <div className="space-y-4">
            {recommendations && recommendations.length > 0 ? (
              recommendations.filter(r => r.score > 10).slice(0, 5).map((rec, i) => (
                <motion.div
                  key={rec.internship.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-3xl bg-background border-2 border-primary/10 hover:border-primary shadow-xl shadow-primary/5 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn("text-xs font-black px-4 py-2 rounded-2xl", getScoreBg(rec.score))}>
                      {rec.score}% COMPATIBILITY
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black">
                      #{i + 1}
                    </div>
                  </div>
                  <h4 className="font-black text-lg mb-1 leading-tight">{rec.internship.title}</h4>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">{rec.internship.company} &middot; {rec.internship.domain}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-tighter">
                      <span className="text-muted-foreground">Skill Mesh</span>
                      <span className="text-primary">{rec.skillMatchScore}/50</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${(rec.skillMatchScore / 50) * 100}%` }} />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-xs font-bold text-muted-foreground">Complete your profile to unlock AI Matching</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Recent Activity Ecosystem */}
        {analytics?.recentActivity && analytics.recentActivity.length > 0 ? (
          <div className="glass-card rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent" />
                Ecosystem Activity
              </h3>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted">
              {analytics.recentActivity.slice(0, 5).map((item, i) => (
                <div key={i} className="flex items-start gap-4 relative z-10">
                  <div className={cn(
                    "w-3.5 h-3.5 rounded-full mt-1 shrink-0 border-4 border-background",
                    item.type === "student_registered" ? "bg-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  )} />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground/80 leading-tight mb-1">{item.description}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{formatDate(item.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "My Matches", href: `/recommendations/${studentId}`, color: "bg-primary shadow-primary/20", icon: Target },
            { label: "AI Mock Interviews", href: "/ai-assessments", color: "bg-indigo-600 shadow-indigo-600/20", icon: MessageSquare },
            { label: "Developer Rank", href: "/github-gamification", color: "bg-slate-900 shadow-slate-900/20", icon: Award },
            { label: "Skill Gap", href: `/skill-gap/${studentId}`, color: "bg-accent shadow-accent/20", icon: Zap },
            { label: "AI Feedback", href: "/feedback", color: "bg-emerald-500 shadow-emerald-500/20", icon: CheckCircle2 },
            { label: "Career Matrix", href: `/career-paths/${studentId}`, color: "bg-violet-600 shadow-violet-600/20", icon: Target },
          ].map((action, i) => (
            <Link key={action.href} href={action.href}>
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "w-full p-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] text-white flex flex-col items-center gap-4 transition-all shadow-xl group",
                  action.color
                )}
              >
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md group-hover:rotate-12 transition-transform">
                  <action.icon className="w-6 h-6" />
                </div>
                {action.label}
              </motion.button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
