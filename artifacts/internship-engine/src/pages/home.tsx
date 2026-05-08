import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGetDashboardAnalytics, useGetTopSkills, useGetDomainStats } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles, Target, Zap, TrendingUp, ShieldCheck } from "lucide-react";

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

export default function HomePage() {
  const { data: analytics } = useGetDashboardAnalytics();
  const { data: topSkills } = useGetTopSkills();
  const { data: domainStats } = useGetDomainStats();

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden mesh-gradient">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-[10px] uppercase tracking-[0.2em] font-black px-4 py-1.5 rounded-full mb-8 border border-primary/20 backdrop-blur-sm">
              <Zap className="w-3 h-3 fill-current" />
              Powered by NVIDIA AI
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1] text-foreground">
              Internships{" "}
              <span className="text-gradient">
                Reimagined
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
              An intelligent recommendation engine that matches you with high-impact opportunities based on your <span className="text-foreground font-bold underline decoration-primary/40 underline-offset-4">actual skills</span>, not just keywords.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link href="/profile">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center gap-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  Create Your Profile
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/internships">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-4 bg-card/50 backdrop-blur-md border border-border/50 text-foreground rounded-2xl font-bold text-lg hover:bg-muted transition-all shadow-xl"
                >
                  Browse Opportunities
                </motion.button>
              </Link>
            </div>

            {analytics && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-20 flex flex-wrap justify-center gap-12 md:gap-24"
              >
                {[
                  { val: analytics.totalInternships, label: "Positions" },
                  { val: analytics.totalStudents, label: "Users" },
                  { val: `${analytics.avgMatchScore.toFixed(0)}%`, label: "Match Accuracy" },
                ].map(stat => (
                  <div key={stat.label} className="text-center group">
                    <div className="text-4xl md:text-5xl font-black text-foreground group-hover:text-primary transition-colors">{stat.val}</div>
                    <div className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground mt-2">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">The Future of Career Discovery</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">From intelligent matching to deep skill analysis, we provide the tools to accelerate your professional growth.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-8 glass-card rounded-[2.5rem] hover:border-primary/50 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
                <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-5 h-5 text-primary/50" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-muted/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.02),transparent)]" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">How It Works</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative"
              >
                <div className="text-8xl font-black text-primary/5 absolute -top-12 -left-4 select-none">{step.step}</div>
                <div className="relative z-10 pt-4">
                  <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm">{i+1}</span>
                    {step.title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed font-medium">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Domain Stats Section */}
      {domainStats && domainStats.length > 0 && (
        <section className="py-24 border-y border-border/50 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-xs uppercase tracking-[0.3em] font-black text-center mb-12 text-muted-foreground">Trending Opportunities</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {domainStats.map(stat => (
                <motion.div 
                  key={stat.domain} 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 bg-card border border-border px-6 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-default"
                >
                  <span className="text-sm font-bold">{stat.domain}</span>
                  <span className="text-[10px] font-black bg-primary/10 text-primary px-2.5 py-1 rounded-full">{stat.count}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-16 rounded-[3rem] border-primary/20"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight leading-tight">Ready to Find Your <br/><span className="text-primary">Perfect Internship?</span></h2>
            <p className="text-xl text-muted-foreground mb-12 font-medium max-w-xl mx-auto italic">"Join thousands of students leveraging AI to secure their dream roles."</p>
            <Link href="/profile">
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 bg-foreground text-background rounded-2xl font-black text-xl shadow-2xl hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                Get Started Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
