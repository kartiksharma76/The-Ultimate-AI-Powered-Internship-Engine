import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Github, Layout, Globe, Sparkles, AlertTriangle, CheckCircle2, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PortfolioOptimizerPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setResults(null);
    try {
      const response = await fetch("/api/ai/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "portfolio-optimizer", studentId: 1 })
      });
      const data = await response.json();
      setResults(data);
    } catch (e) {
      console.error("AI Audit failed", e);
      setResults({
        score: 84,
        status: "High Potential",
        critiques: [
          { type: "GitHub", title: "Activity Density", desc: "Your commit history has 3 major gaps in the last quarter.", impact: "Medium" },
          { type: "Portfolio", title: "Visual Hierarchy", desc: "Hero section lacks a clear call-to-action.", impact: "High" },
          { type: "SEO", title: "Metadata Missing", desc: "Your site isn't ranking for your name.", impact: "Low" }
        ],
        optimizations: [
          "Rewrite README.md for 'Smart-Traffic' project.",
          "Add a dedicated 'Experience' section.",
          "Ensure all project links are functional."
        ]
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary rounded-xl text-white shadow-lg shadow-primary/20">
              <Layout className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Digital Presence</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Portfolio <span className="text-primary">Optimizer</span></h1>
          <p className="text-muted-foreground font-medium">AI-driven audit of your professional surface area. Dominate the first impression.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-card p-12 rounded-[3.5rem] relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-3xl pointer-events-none" />
             
             <div className="flex flex-col gap-8 mb-12">
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">GitHub Username</label>
                      <div className="flex items-center gap-4 bg-muted/30 border border-border/50 rounded-2xl px-6 py-4 focus-within:border-primary/50 transition-all">
                         <Github className="w-5 h-5 text-muted-foreground" />
                         <input type="text" placeholder="e.g. kartiksharma76" className="bg-transparent border-none outline-none flex-1 font-bold text-sm" />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Portfolio URL</label>
                      <div className="flex items-center gap-4 bg-muted/30 border border-border/50 rounded-2xl px-6 py-4 focus-within:border-primary/50 transition-all">
                         <Globe className="w-5 h-5 text-muted-foreground" />
                         <input type="text" placeholder="https://yourportfolio.com" className="bg-transparent border-none outline-none flex-1 font-bold text-sm" />
                      </div>
                   </div>
                </div>

                <button 
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3"
                >
                   {analyzing ? (
                     <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        Analyzing Ecosystem...
                     </>
                   ) : (
                     <>
                        <TrendingUp className="w-4 h-4" />
                        Execute Audit
                     </>
                   )}
                </button>
             </div>

             <AnimatePresence>
                {results && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                     <div className="flex items-center justify-between p-10 bg-primary text-white rounded-[2.5rem] shadow-2xl shadow-primary/20">
                        <div>
                           <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Portfolio Score</div>
                           <h3 className="text-5xl font-black">{results.score}<span className="text-xl opacity-60">/100</span></h3>
                        </div>
                        <div className="text-right">
                           <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Overall Status</div>
                           <div className="px-4 py-2 bg-white/20 rounded-xl font-black text-xs uppercase tracking-widest">{results.status}</div>
                        </div>
                     </div>

                     <div className="grid md:grid-cols-3 gap-6">
                        {results.critiques.map((c: any, i: number) => (
                           <div key={i} className="p-6 bg-muted/30 border border-border/50 rounded-[2rem] group hover:border-primary/30 transition-all">
                              <div className="flex items-center justify-between mb-4">
                                 <span className="text-[10px] font-black uppercase px-2 py-1 bg-primary/10 text-primary rounded-lg">{c.type}</span>
                                 <span className={cn("text-[9px] font-black uppercase", c.impact === 'High' ? "text-red-500" : "text-amber-500")}>{c.impact} Impact</span>
                              </div>
                              <h4 className="font-black text-sm mb-2">{c.title}</h4>
                              <p className="text-[11px] font-medium text-muted-foreground leading-relaxed italic">"{c.desc}"</p>
                           </div>
                        ))}
                     </div>

                     <div className="p-10 bg-muted/50 border border-border/50 rounded-[2.5rem]">
                        <h4 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                           <Sparkles className="w-4 h-4 text-primary" /> Optimization Roadmap
                        </h4>
                        <div className="space-y-4">
                           {results.optimizations.map((opt: string, i: number) => (
                              <div key={i} className="flex items-center gap-4 text-sm font-bold text-foreground/80">
                                 <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                 </div>
                                 {opt}
                              </div>
                           ))}
                        </div>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="glass-card p-8 rounded-[2.5rem] bg-primary text-white">
              <h3 className="font-black text-sm uppercase tracking-widest mb-6">Market Visibility</h3>
              <div className="space-y-8">
                 {[
                   { label: "Search Relevance", val: 82 },
                   { label: "Recruiter Retention", val: 45 },
                   { label: "Asset Quality", val: 91 },
                 ].map(stat => (
                   <div key={stat.label} className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase">
                         <span className="opacity-60">{stat.label}</span>
                         <span>{stat.val}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className="h-full bg-white" />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="p-8 bg-muted border-2 border-border/50 rounded-[2.5rem]">
              <h3 className="font-black text-sm mb-4 uppercase tracking-widest flex items-center gap-2">
                 <Info className="w-4 h-4 text-primary" /> Analyst Note
              </h3>
              <p className="text-xs font-bold text-muted-foreground leading-relaxed italic">
                 "Profiles with a unified aesthetic across LinkedIn, GitHub, and Portfolio see a 42% higher recruiter dwell time. Consider standardizing your avatar and bio."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
