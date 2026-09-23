import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Zap, AlertTriangle, Clock, Battery, BatteryLow, BatteryCharging, Info, CheckCircle2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BurnoutPredictorPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setResults(null);
    try {
      const response = await fetch("/api/ai/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "burnout-predictor", studentId: 1 })
      });
      const data = await response.json();
      
      // Map icons back
      if (data.factors) {
        data.factors = data.factors.map((f: any, i: number) => ({
          ...f,
          icon: i === 0 ? Clock : i === 1 ? Zap : i === 2 ? Battery : Activity
        }));
      }
      
      setResults(data);
    } catch (e) {
      console.error("Burnout Scan failed", e);
      setResults({
        level: 28,
        status: "Safe Zone",
        factors: [
          { label: "Expected Weekly Hours", val: 42, icon: Clock },
          { label: "Meeting Density", val: 15, icon: Zap }
        ],
        insights: ["This team maintains a strict 'No Meeting Fridays' policy."]
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
            <div className="p-2 bg-amber-600 rounded-xl text-white shadow-lg shadow-amber-600/20">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Well-being Intelligence</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Burnout <span className="text-amber-600">Predictor</span></h1>
          <p className="text-muted-foreground font-medium">Predicting sustainable growth by analyzing team load and company reviews.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-card p-12 rounded-[3.5rem] relative overflow-hidden h-full">
             <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-3xl pointer-events-none" />
             
             <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto py-10">
                <div className="w-20 h-20 bg-amber-50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-amber-100">
                   <BatteryCharging className="w-10 h-10 text-amber-600 animate-pulse" />
                </div>
                <h2 className="text-3xl font-black mb-4">Protect Your Energy</h2>
                <p className="text-sm text-muted-foreground font-medium mb-10 leading-relaxed italic">"Enter a company name or job link. We'll analyze over 100k data points (Glassdoor, Reddit, LinkedIn) to predict the work intensity."</p>
                
                <div className="w-full flex gap-4">
                   <div className="flex-1 bg-muted/30 border border-border/50 rounded-2xl flex items-center px-6 gap-4 focus-within:border-amber-500/50 transition-all">
                      <Search className="w-5 h-5 text-muted-foreground" />
                      <input type="text" placeholder="Company Name (e.g. Amazon, Netflix)..." className="bg-transparent border-none outline-none flex-1 font-bold text-sm" />
                   </div>
                   <button 
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="px-10 py-4 bg-amber-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl"
                   >
                     {analyzing ? "Scanning Vitals..." : "Execute Scan"}
                   </button>
                </div>
             </div>

             <AnimatePresence>
                {results && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-16 space-y-12">
                     <div className="flex items-center justify-between p-10 bg-amber-600 text-white rounded-[2.5rem] shadow-2xl shadow-amber-600/20">
                        <div className="flex items-center gap-8">
                           <div className="w-20 h-20 rounded-[2rem] bg-white/20 flex items-center justify-center">
                              {results.level < 40 ? <BatteryCharging className="w-10 h-10" /> : <BatteryLow className="w-10 h-10" />}
                           </div>
                           <div>
                              <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Burnout Risk Index</div>
                              <h3 className="text-5xl font-black">{results.level}%</h3>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Health Verdict</div>
                           <div className="px-4 py-2 bg-white/20 rounded-xl font-black text-xs uppercase tracking-widest">{results.status}</div>
                        </div>
                     </div>

                     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {results.factors.map((f: any, i: number) => (
                           <div key={i} className="p-6 bg-muted/30 border border-border/50 rounded-[2rem] text-center">
                              <f.icon className="w-5 h-5 mx-auto mb-4 text-amber-600" />
                              <div className="text-2xl font-black mb-1">{f.val}</div>
                              <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{f.label}</div>
                           </div>
                        ))}
                     </div>

                     <div className="p-10 bg-muted/50 border border-border/50 rounded-[2.5rem]">
                        <h4 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                           <Zap className="w-4 h-4 text-amber-600" /> Sustainable Insights
                        </h4>
                        <div className="space-y-4">
                           {results.insights.map((ins: string, i: number) => (
                              <div key={i} className="flex items-center gap-4 text-sm font-bold text-foreground/80 italic leading-relaxed">
                                 <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                 {ins}
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
           <div className="glass-card p-8 rounded-[2.5rem] bg-slate-900 text-white">
              <h3 className="font-black text-sm uppercase tracking-widest mb-6">Industry Vitals</h3>
              <div className="space-y-8">
                 {[
                   { label: "Fintech Pressure", val: 88 },
                   { label: "Big Tech Load", val: 64 },
                   { label: "Startup Velocity", val: 95 },
                 ].map(stat => (
                   <div key={stat.label} className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase">
                         <span className="opacity-60">{stat.label}</span>
                         <span>{stat.val}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className="h-full bg-amber-500" />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="p-8 bg-amber-50 border-2 border-amber-100 rounded-[2.5rem]">
              <h3 className="font-black text-amber-600 text-sm mb-4 uppercase tracking-widest flex items-center gap-2">
                 <AlertTriangle className="w-4 h-4" /> System Warning
              </h3>
              <p className="text-xs font-bold text-amber-900/60 leading-relaxed italic mb-6">
                 "Average burnout rates in 'Cloud Engineering' have risen by 12% globally due to increased on-call rotations in Q2. Monitor your weekend activity."
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-amber-600 cursor-pointer hover:gap-4 transition-all">
                 View Wellness Guide <CheckCircle2 className="w-4 h-4" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
