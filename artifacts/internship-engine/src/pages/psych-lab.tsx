import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Activity, ShieldCheck, Heart, UserCheck, Play, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function PsychLabPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [analysisLog, setAnalysisLog] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const handleStartAnalysis = async () => {
    setAnalyzing(true);
    setAnalysisLog([]);
    setResults(null);
    setProgress(0);

    const steps = [
      "Aggregating platform activity data...",
      "Analyzing linguistic patterns in chat history...",
      "Extracting EQ metrics from interview transcripts...",
      "Decoding cognitive stress responses...",
      "Mapping behavioral traits to industry benchmarks...",
      "Finalizing Neural Personality Profile..."
    ];

    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + 15, 95));
      setAnalysisLog(prev => {
         if (prev.length < steps.length) {
            return [...prev, steps[prev.length]];
         }
         return prev;
      });
    }, 800);

    try {
      const response = await fetch("/api/ai/psych-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      const data = await response.json();
      
      clearInterval(progressInterval);
      setProgress(100);
      setAnalysisLog(steps);

      if (response.ok) {
         setResults(data);
         toast.success("Behavioral Profile generated successfully!");
      } else {
         toast.error(data.error || "Failed to generate profile.");
      }
    } catch (error) {
      clearInterval(progressInterval);
      toast.error("Network error analyzing profile.");
    }

    setAnalyzing(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20">
              <Brain className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Behavioral Intelligence</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Psychology <span className="text-indigo-600">Lab</span></h1>
          <p className="text-muted-foreground font-medium">AI analysis of personality, EQ, and culture-fit for elite tech roles.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-card p-10 rounded-[3rem] relative overflow-hidden h-full min-h-[600px] flex flex-col">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {!analyzing && !results ? (
                <motion.div 
                  key="start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto"
                >
                  <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
                    <Activity className="w-10 h-10 text-indigo-600 animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-black mb-4">Initialize Behavioral Map</h2>
                  <p className="text-sm text-muted-foreground font-medium mb-8">This analysis will take 45 seconds to process your historical platform data, interview transcripts, and activity patterns.</p>
                  <button 
                    onClick={handleStartAnalysis}
                    className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3"
                  >
                    <Play className="w-4 h-4" /> Begin AI Profiling
                  </button>
                  <div className="flex items-center gap-6 mt-12 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> HIPAA Compliant</span>
                    <span className="flex items-center gap-2"><UserCheck className="w-4 h-4" /> Anonymous Data</span>
                  </div>
                </motion.div>
              ) : analyzing ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col items-center justify-center"
                >
                  <div className="relative w-24 h-24 mb-8">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full"
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-4 bg-indigo-600/10 rounded-full flex items-center justify-center"
                    >
                      <Brain className="w-8 h-8 text-indigo-600" />
                    </motion.div>
                  </div>
                  <div className="space-y-1 text-left max-w-xs w-full bg-[#0a0a0a] p-6 rounded-2xl border border-indigo-500/20 font-mono text-[10px] shadow-2xl">
                    <div className="text-[8px] text-indigo-400 font-black uppercase mb-3 tracking-widest flex items-center gap-2">
                      <Activity className="w-3 h-3" /> Neural Telemetry
                    </div>
                    {analysisLog.map((log, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        key={i} 
                        className="flex items-center gap-2 text-indigo-300"
                      >
                        <span className="opacity-30">[{i+1}]</span> {log}
                        <CheckCircle2 className="w-2.5 h-2.5 ml-auto text-indigo-500" />
                      </motion.div>
                    ))}
                    <div className="w-full h-1 bg-indigo-600/20 mt-4 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-indigo-600" 
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-12 py-8"
                >
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b pb-12 border-border/50">
                    <div className="text-center md:text-left">
                      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 mb-2">Neural Identity</div>
                      <h3 className="text-4xl font-black tracking-tighter">{results.personality}</h3>
                      <p className="text-sm font-bold text-muted-foreground mt-2 italic">Optimal Role: Architect & Strategic Lead</p>
                    </div>
                    <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-600 flex flex-col items-center justify-center text-white shadow-2xl shadow-indigo-600/40">
                      <div className="text-4xl font-black">{results.eq}</div>
                      <div className="text-[9px] font-black uppercase tracking-widest opacity-80">EQ Score</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {results.traits.map((trait: any, i: number) => (
                      <div key={i} className="p-6 bg-muted/30 rounded-[2rem] border border-border/50 hover:border-indigo-600/30 transition-all group">
                         <div className="flex justify-between items-center mb-4">
                           <span className="text-xs font-black uppercase tracking-widest">{trait.name}</span>
                           <span className="text-sm font-black text-indigo-600">{trait.val}%</span>
                         </div>
                         <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-4">
                           <motion.div initial={{ width: 0 }} animate={{ width: `${trait.val}%` }} className="h-full bg-indigo-600" />
                         </div>
                         <p className="text-[11px] font-medium text-muted-foreground leading-relaxed italic">"{trait.desc}"</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] bg-slate-900 text-white">
            <h3 className="font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2 text-indigo-400">
              <Sparkles className="w-4 h-4" /> Culture-Fit Index
            </h3>
            <div className="space-y-6">
              {results?.cultureFit.map((fit: any, i: number) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between text-[11px] font-black uppercase">
                    <span>{fit.company}</span>
                    <span className="text-indigo-400">{fit.score}% Match</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${fit.score}%` }} className="h-full bg-indigo-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-indigo-50 border-2 border-indigo-200 rounded-[2.5rem]">
            <h3 className="font-black text-indigo-600 text-sm mb-4 uppercase tracking-widest">Development Advice</h3>
            <p className="text-xs font-bold text-indigo-900/60 leading-relaxed mb-6">
              "{results?.advice || "Initialize analysis to get personalized career development advice based on your psychological profile."}"
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-600 cursor-pointer hover:gap-4 transition-all">
              View Detailed Lab Report <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
