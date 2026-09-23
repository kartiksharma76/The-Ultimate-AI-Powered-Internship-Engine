import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Search, Sparkles, Heart, Zap, ShieldAlert, CheckCircle2, TrendingUp, Info, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CompanyDeepDivePage() {
  const [query, setQuery] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleDeepDive = async () => {
    setAnalyzing(true);
    setResults(null);
    try {
      const response = await fetch("/api/ai/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "company-deep-dive", studentId: 1, query })
      });
      const data = await response.json();
      setResults(data);
    } catch (e) {
      console.error("Failed to analyze company", e);
      setResults({
        name: query || "Stripe",
        logo: `https://logo.clearbit.com/${(query || "stripe").toLowerCase().replace(/\\s+/g, "")}.com`,
        culture: 94,
        wlb: 72,
        growth: 98,
        sentiment: "Highly Positive",
        insights: [
          { type: "positive", text: "Exceptional engineering culture with high autonomy." },
          { type: "warning", text: "High workload during quarterly shipping sprints." },
        ],
        hiddenTruths: [
          "Internal mobility is easier after 14 months of tenure."
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
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Corporate Intelligence</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Company <span className="text-indigo-600">Deep-Dive</span></h1>
          <p className="text-muted-foreground font-medium">AI-driven culture analysis and "hidden truth" reports on tech entities.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-card p-10 rounded-[3.5rem] relative overflow-hidden">
            <div className="flex items-center gap-4 p-6 bg-muted/30 rounded-3xl border-2 border-border/50 mb-12 focus-within:border-indigo-600 transition-all">
              <Search className="w-6 h-6 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Enter company name (e.g. Google, Stripe, NVIDIA)" 
                className="bg-transparent border-none outline-none flex-1 font-bold text-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                onClick={handleDeepDive}
                disabled={analyzing || !query}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all disabled:opacity-50 shadow-xl"
              >
                {analyzing ? "Analyzing Data..." : "Deep Dive"}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {analyzing ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-[400px] flex flex-col items-center justify-center text-center"
                >
                  <div className="w-20 h-20 relative mb-8">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full"
                    />
                    <Sparkles className="absolute inset-6 w-8 h-8 text-indigo-600 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-widest">Neural Scrape in Progress</h3>
                  <p className="text-sm text-muted-foreground font-medium mt-2">Aggregating insider sentiment, glassdoor trends, and LinkedIn mobility stats.</p>
                </motion.div>
              ) : results ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-12"
                >
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b pb-12 border-border/50">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-[2rem] bg-white border-2 border-border/50 p-4 shadow-xl">
                        <img src={results.logo} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h3 className="text-4xl font-black">{results.name}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">{results.sentiment}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      {[
                        { label: "Culture", val: results.culture, color: "bg-indigo-600" },
                        { label: "WLB", val: results.wlb, color: "bg-amber-500" },
                        { label: "Growth", val: results.growth, color: "bg-emerald-500" },
                      ].map(stat => (
                        <div key={stat.label} className="text-center">
                          <div className="text-2xl font-black text-indigo-600">{stat.val}</div>
                          <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Strategic Insights
                      </h4>
                      <div className="space-y-4">
                        {results.insights.map((insight: any, i: number) => (
                          <div key={i} className="flex items-start gap-4 p-5 bg-muted/30 rounded-2xl border border-border/50">
                            {insight.type === 'positive' ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> : <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />}
                            <p className="text-[11px] font-bold leading-relaxed">{insight.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Hidden Truths
                      </h4>
                      <div className="space-y-4">
                        {results.hiddenTruths.map((truth: string, i: number) => (
                          <div key={i} className="p-5 bg-slate-900 text-white rounded-2xl border border-white/10 text-[11px] font-bold italic">
                            "{truth}"
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center text-center opacity-30">
                  <Building2 className="w-20 h-20 mb-6" />
                  <p className="text-sm font-black uppercase tracking-widest">Select a company to reveal internal intelligence</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] bg-indigo-600 text-white relative overflow-hidden">
             <Heart className="absolute top-4 right-4 w-12 h-12 opacity-10" />
             <h3 className="font-black text-sm uppercase tracking-widest mb-6 italic">Insider Pulse</h3>
             <div className="p-6 bg-white/10 rounded-3xl border border-white/10 mb-8">
               <p className="text-[11px] font-bold leading-relaxed opacity-90">
                 "A high number of engineers from this company are recently migrating to Crypto startups. This usually indicates a plateau in project innovation."
               </p>
             </div>
             <button className="w-full py-4 bg-white/20 hover:bg-white/30 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Talk to an Insider</button>
          </div>

          <div className="p-8 bg-muted border-2 border-border/50 rounded-[2.5rem]">
            <h3 className="font-black text-sm mb-4 uppercase tracking-widest flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-600" /> Interview Advice
            </h3>
            <p className="text-xs font-bold text-muted-foreground leading-relaxed italic">
              "When interviewing here, always prepare a 'failed project' story. They value post-mortem analysis more than flawless execution."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
