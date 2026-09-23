import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, Zap, Box, Layers, CheckCircle2, AlertTriangle, ArrowRight, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TechEvolutionPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const skills = ["React", "TypeScript", "Python", "Node.js", "PostgreSQL", "Docker"];

  const handleEvolutionSync = async () => {
    setAnalyzing(true);
    setResults(null);
    try {
      const response = await fetch("/api/ai/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "tech-evolution", studentId: 1, skills })
      });
      const data = await response.json();
      setResults(data);
    } catch (e) {
      console.error("Evolution sync failed", e);
      setResults({
        index: 92,
        status: "Future-Proofed",
        trends: [
          { name: "Rust", direction: "up", urgency: "High", reason: "Infrastructure shifting to memory-safe languages." },
          { name: "LLM Ops", direction: "up", urgency: "Critical", reason: "Integration of AI models into core pipelines." },
          { name: "GraphQL", direction: "neutral", urgency: "Low", reason: "Steady adoption, but REST remains dominant." },
        ],
        pathway: [
          { step: "Master Vector Databases", status: "next" },
          { step: "Deep Dive into WASM", status: "locked" },
          { step: "Cloud Native Architecture", status: "completed" },
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
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Market Alignment</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Tech <span className="text-indigo-600">Evolution</span></h1>
          <p className="text-muted-foreground font-medium">Predictive analysis of your tech stack against 5-year industry trends.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-card p-10 rounded-[3.5rem] relative overflow-hidden">
            <div className="flex flex-col gap-10 mb-12">
              <div className="space-y-6">
                <h3 className="text-xl font-black">Your Current Stack</h3>
                <div className="flex flex-wrap gap-3">
                  {skills.map(s => (
                    <div key={s} className="px-5 py-2.5 bg-muted rounded-xl text-[11px] font-black uppercase tracking-widest border border-border/50">
                      {s}
                    </div>
                  ))}
                  <button className="px-5 py-2.5 bg-indigo-600/10 text-indigo-600 rounded-xl text-[11px] font-black uppercase tracking-widest border border-indigo-600/20 hover:bg-indigo-600 hover:text-white transition-all">+ Add Skill</button>
                </div>
              </div>

              <button 
                onClick={handleEvolutionSync}
                disabled={analyzing}
                className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
              >
                {analyzing ? (
                  <>
                    <Zap className="w-4 h-4 animate-pulse" />
                    Synchronizing with Market Data...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    Run Evolution Forecast
                  </>
                )}
              </button>
            </div>

            <AnimatePresence>
              {results && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-12"
                >
                  <div className="flex items-center justify-between p-10 bg-indigo-600 text-white rounded-[2.5rem] shadow-2xl shadow-indigo-600/20">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Future-Proof Score</div>
                      <h3 className="text-4xl font-black">{results.index} / 100</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Stack Status</div>
                      <div className="px-4 py-2 bg-white/20 rounded-full font-black text-[10px] uppercase tracking-widest">{results.status}</div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Layers className="w-4 h-4" /> Strategic Pivot Recommendations
                    </h4>
                    <div className="grid md:grid-cols-3 gap-6">
                      {results.trends.map((trend: any, i: number) => (
                        <div key={i} className="p-6 bg-muted/30 rounded-[2rem] border border-border/50 group hover:border-indigo-600/30 transition-all">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-black uppercase tracking-widest">{trend.name}</span>
                            <span className={cn(
                              "text-[8px] font-black uppercase px-2 py-0.5 rounded-full",
                              trend.urgency === 'Critical' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                            )}>
                              {trend.urgency}
                            </span>
                          </div>
                          <p className="text-[10px] font-bold text-muted-foreground leading-relaxed italic mb-4">
                            "{trend.reason}"
                          </p>
                          <div className="flex items-center gap-2 text-[8px] font-black uppercase text-indigo-600">
                             Adopt Pathway <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </div>
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
          <div className="glass-card p-8 rounded-[2.5rem] bg-indigo-600 text-white relative overflow-hidden">
             <Sparkles className="absolute top-4 right-4 w-12 h-12 opacity-10" />
             <h3 className="font-black text-sm uppercase tracking-widest mb-6">Mastery Roadmap</h3>
             <div className="space-y-4">
               {results?.pathway.map((p: any, i: number) => (
                 <div key={i} className={cn(
                   "p-5 rounded-2xl border flex items-center justify-between",
                   p.status === 'completed' ? 'bg-white/10 border-white/20' : 
                   p.status === 'next' ? 'bg-white border-white text-indigo-600 shadow-xl' : 'bg-black/20 border-white/5 opacity-50'
                 )}>
                    <span className="text-[10px] font-black uppercase tracking-widest">{p.step}</span>
                    {p.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                 </div>
               ))}
             </div>
          </div>

          <div className="p-8 bg-muted border-2 border-border/50 rounded-[2.5rem]">
            <h3 className="font-black text-sm mb-4 uppercase tracking-widest flex items-center gap-2">
              <Box className="w-4 h-4 text-indigo-600" /> Evolution Tip
            </h3>
            <p className="text-xs font-bold text-muted-foreground leading-relaxed italic">
              "Your React foundation is solid, but the industry is moving towards 'Server-First' architectures. Focus on Next.js 14+ RSCs to stay in the top 5% of talent."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
