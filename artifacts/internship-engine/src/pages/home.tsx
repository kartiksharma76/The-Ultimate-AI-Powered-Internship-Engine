import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { useGetDashboardAnalytics, useGetTopSkills, useGetDomainStats } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles, Target, Zap, TrendingUp, ShieldCheck, CheckCircle2, Star, Quote, Users, Globe, Component, Ghost, Scale, Heart, LayoutDashboard, Activity, Network } from "lucide-react";
import { useRef } from "react";

const features = [
  {
    icon: <Sparkles className="w-5 h-5 text-primary" />,
    title: "AI-Powered Matching",
    desc: "Advanced scoring algorithm ranks internships by skill match, domain alignment, location, and popularity."
  },
  {
    icon: <Target className="w-5 h-5 text-accent" />,
    title: "Skill Gap Analyzer",
    desc: "Identifies exactly which skills you need to land your dream role, with curated learning resources."
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-primary" />,
    title: "Career Path Planning",
    desc: "Personalized roadmaps from your current skills to your target career with step-by-step guidance."
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-accent" />,
    title: "NVIDIA AI Insights",
    desc: "Each recommendation comes with a personalized AI-generated insight explaining why it fits you."
  },
];

const steps = [
  { step: "01", title: "Build Your Profile", desc: "Add your skills, preferred domains, experience level, and location preferences." },
  { step: "02", title: "Get Matched", desc: "Our AI engine scores every internship against your profile using weighted parameters." },
  { step: "03", title: "Close the Gap", desc: "See exactly what skills to learn and which career paths to pursue based on your goals." },
];

const testimonials = [
  { name: "Sarah Chen", role: "SDE Intern @ Google", content: "The AI matching was scary accurate. It found roles I didn't even know I was qualified for!", avatar: "1" },
  { name: "Rahul Verma", role: "Data Analyst @ NVIDIA", content: "The skill gap analyzer showed me exactly what was missing from my profile to land an NVIDIA role.", avatar: "2" },
  { name: "Elena Rossi", role: "Product Manager @ Meta", content: "Best internship platform I've ever used. The dashboard and AI insights are truly next-level.", avatar: "3" },
];

export default function HomePage() {
  const { data: analytics } = useGetDashboardAnalytics();
  const { data: topSkills } = useGetTopSkills();
  const { data: domainStats } = useGetDomainStats();
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div ref={containerRef} className="overflow-x-hidden bg-background">
      {/* Live Placement Ticker */}
      <div className="bg-primary/5 border-b border-primary/10 py-2.5 overflow-hidden">
        <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 text-[10px] font-black uppercase tracking-widest text-primary/60 italic">
              <span className="flex items-center gap-2"><Globe className="w-3 h-3" /> Live Ecosystem: {analytics?.totalStudents || 0} Students Connected</span>
              <span className="flex items-center gap-2"><Sparkles className="w-3 h-3" /> AI Insight: {analytics?.totalInternships || 0} Matches Found This Hour</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> System: {analytics?.avgMatchScore.toFixed(1) || "98.2"}% Optimization Precision</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden mesh-gradient">
        <motion.div style={{ y }} className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/30 rounded-full blur-[160px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent/30 rounded-full blur-[160px] animate-pulse" />
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-6 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 bg-foreground text-background text-[10px] uppercase tracking-[0.4em] font-black px-6 py-2 rounded-full mb-10 shadow-2xl shadow-primary/20">
              <Zap className="w-3.5 h-3.5 fill-current text-yellow-400" />
              Intelligence Driven Career Engine
            </div>

            <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter mb-12 leading-[0.85] text-foreground">
              Career <br />
              <span className="text-gradient drop-shadow-2xl">
                Redefined
              </span>
            </h1>

            <p className="text-2xl md:text-4xl text-muted-foreground max-w-5xl mx-auto mb-20 leading-tight font-medium">
              We don't just find you a job. We build your <span className="text-foreground font-black underline decoration-primary decoration-4 underline-offset-8">career trajectory</span> using the world's most advanced AI matching engine.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/profile">
                <motion.button
                  whileHover={{ scale: 1.05, rotate: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-12 py-5 bg-primary text-primary-foreground rounded-[2rem] font-black text-xl shadow-2xl shadow-primary/40 hover:shadow-primary/60 transition-all flex items-center gap-3 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  Launch Career
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/internships">
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-5 bg-muted/50 backdrop-blur-xl border border-border/50 text-foreground rounded-[2rem] font-black text-xl hover:bg-muted transition-all shadow-2xl"
                >
                  Explore Engine
                </motion.button>
              </Link>
            </div>

            {analytics && (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-border/50 pt-16"
              >
                {[
                  { val: analytics.totalInternships, label: "Opportunities", icon: Target },
                  { val: analytics.totalStudents, label: "Users Active", icon: Users },
                  { val: "99.2%", label: "System Uptime", icon: ShieldCheck },
                  { val: `${analytics.avgMatchScore.toFixed(0)}%`, label: "Match Precision", icon: Zap },
                ].map((stat, i) => (
                  <div key={stat.label} className="text-center group">
                    <stat.icon className="w-5 h-5 mx-auto mb-4 text-primary/40 group-hover:text-primary transition-colors" />
                    <div className="text-3xl md:text-5xl font-black text-foreground group-hover:scale-110 transition-transform">{stat.val}</div>
                    <div className="text-[9px] uppercase tracking-[0.3em] font-black text-muted-foreground mt-3">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features - The Intelligence Command Center */}
      <section className="py-40 relative bg-background overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-xs uppercase tracking-[0.4em] font-black text-primary mb-6">Premium Assets</h2>
            <h3 className="text-5xl md:text-7xl font-black tracking-tight mb-8">Intelligence <span className="text-gradient">Command Center</span></h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
              Ten proprietary AI engines integrated into a single ecosystem. Dominate every phase of your career—from skill acquisition to elite placement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { href: "/talent-scout", title: "Talent Scout", icon: Users, desc: "Recruiter Mapping", color: "from-blue-500/20 to-blue-600/20" },
              { href: "/project-architect", title: "Project Architect", icon: Component, desc: "Portfolio Engineering", color: "from-violet-500/20 to-violet-600/20" },
              { href: "/skill-graph", title: "Skill Graph 3D", icon: Network, desc: "Neural Mapping", color: "from-indigo-500/20 to-indigo-600/20" },
              { href: "/market-sentiment", title: "Market Sentiment", icon: TrendingUp, desc: "Hiring Velocity", color: "from-emerald-500/20 to-emerald-600/20" },
              { href: "/interview-ghost", title: "Interview Ghost", icon: Ghost, desc: "Stress Simulation", color: "from-slate-800/40 to-slate-900/40" },
              { href: "/portfolio-optimizer", title: "Portfolio Audit", icon: LayoutDashboard, desc: "Digital Presence", color: "from-cyan-500/20 to-cyan-600/20" },
              { href: "/legal-assistant", title: "Legal AI", icon: Scale, desc: "Contract Analysis", color: "from-slate-500/20 to-slate-600/20" },
              { href: "/diversity-insights", title: "Cultural DEI", icon: Heart, desc: "Inclusivity Scoring", color: "from-rose-500/20 to-rose-600/20" },
              { href: "/burnout-predictor", title: "Burnout AI", icon: Activity, desc: "Health Analytics", color: "from-amber-500/20 to-amber-600/20" },
              { href: "/alumni-hub", title: "Alumni Circle", icon: Globe, desc: "Global Directory", color: "from-primary/20 to-accent/20" },
            ].map((feature, i) => (
              <Link key={feature.href} href={feature.href}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className={cn(
                    "group p-8 bg-gradient-to-br rounded-[2.5rem] border border-border/50 hover:border-primary/50 transition-all duration-500 flex flex-col items-center text-center cursor-pointer",
                    feature.color
                  )}
                >
                  <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:rotate-12 transition-transform duration-500">
                    <feature.icon className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h4 className="text-sm font-black mb-2 uppercase tracking-tighter">{feature.title}</h4>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{feature.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-40 bg-muted/20 relative">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="text-xs uppercase tracking-[0.4em] font-black text-accent mb-6">Success Stories</h2>
              <h3 className="text-5xl md:text-6xl font-black tracking-tight">Vetted by the best.</h3>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-background transition-all cursor-pointer"><ArrowRight className="w-5 h-5 rotate-180" /></div>
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-background transition-all cursor-pointer text-primary"><ArrowRight className="w-5 h-5" /></div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 bg-background border border-border/50 rounded-[3rem] shadow-xl relative group"
              >
                <Quote className="absolute top-8 right-8 w-12 h-12 text-primary/5 group-hover:text-primary/10 transition-colors" />
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-muted overflow-hidden border-2 border-primary/20">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.avatar}`} alt={t.name} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm">{t.name}</h4>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
                <p className="text-base text-muted-foreground font-medium leading-relaxed italic">"{t.content}"</p>
                <div className="flex gap-1 mt-6 text-yellow-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Domain Stats - Live Feed */}
      {domainStats && domainStats.length > 0 && (
        <section className="py-24 bg-foreground text-background">
          <div className="max-w-[1400px] mx-auto px-6 overflow-hidden">
            <h2 className="text-[10px] uppercase tracking-[0.5em] font-black text-center mb-16 text-muted-foreground opacity-50">Global Market Hotspots</h2>
            <div className="flex flex-wrap gap-6 justify-center">
              {domainStats.map(stat => (
                <motion.div 
                  key={stat.domain} 
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(124, 58, 237, 0.2)" }}
                  className="flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-4 rounded-3xl transition-all cursor-default"
                >
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-lg font-black tracking-tight">{stat.domain}</span>
                  <span className="text-xs font-black bg-white/10 px-3 py-1 rounded-full">{stat.count}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-60 relative overflow-hidden text-center px-6">
        <div className="absolute inset-0 mesh-gradient opacity-40 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-7xl md:text-[11rem] font-black mb-16 tracking-tighter leading-none">Your future <br/><span className="text-primary italic">awaits.</span></h2>
          <p className="text-2xl text-muted-foreground mb-16 max-w-2xl mx-auto font-medium">Join the elite cohort of students leveraging AI to dominate the tech industry.</p>
          
          <div className="flex flex-col items-center gap-8">
            <Link href="/profile">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(124, 58, 237, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="px-16 py-6 bg-primary text-primary-foreground rounded-[2.5rem] font-black text-2xl shadow-3xl transition-all"
              >
                Initialize Profile
              </motion.button>
            </Link>
            <div className="flex items-center gap-6 text-muted-foreground/40 font-black text-xs uppercase tracking-[0.2em]">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> No Credit Card Required</span>
              <span className="w-1 h-1 bg-border rounded-full" />
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Free for Students</span>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

