import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Component, Code2, Sparkles, Zap, GitBranch, ShieldCheck, Box, Terminal, Play, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CodeArchitectPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [results, setResults] = useState<any>(null);
  const [analysisLog, setAnalysisLog] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const handleAnalyze = async () => {
    if (!repoUrl) return;
    setAnalyzing(true);
    setAnalysisLog([]);
    setResults(null);
    setProgress(0);

    const steps = [
      "Connecting to GitHub API...",
      "Cloning repository metadata...",
      "Parsing Abstract Syntax Tree (AST)...",
      "Running Security Heuristics...",
      "Analyzing Design Patterns...",
      "Calculating Cyclomatic Complexity...",
      "Generating Architectural Graph..."
    ];

    // Progress animation parallel to fetch
    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + 15, 95));
      setAnalysisLog(prev => {
         if (prev.length < steps.length) {
            return [...prev, steps[prev.length]];
         }
         return prev;
      });
    }, 600);

    try {
      const response = await fetch("/api/ai/analyze-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl })
      });
      const data = await response.json();
      
      clearInterval(progressInterval);
      setProgress(100);
      setAnalysisLog(steps);

      if (response.ok) {
         setResults(data);
         toast.success("Repository analyzed successfully!");
      } else {
         toast.error(data.error || "Failed to analyze repo.");
      }
    } catch (error) {
      clearInterval(progressInterval);
      toast.error("Network error analyzing repository.");
    }

    setAnalyzing(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20">
              <Component className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Engineering Intelligence</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Code <span className="text-indigo-600">Architect</span></h1>
          <p className="text-muted-foreground font-medium">Deep structural analysis of your GitHub repositories with architectural mentoring.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-card p-10 rounded-[3rem] relative overflow-hidden">
            <div className="flex flex-col gap-6 mb-12">
              <div className="flex items-center gap-4 p-6 bg-muted/30 rounded-3xl border border-border/50">
                <GitBranch className="w-6 h-6 text-indigo-600" />
                <input 
                  type="text" 
                  placeholder="Paste GitHub Repository URL (e.g., https://github.com/user/repo)" 
                  className="bg-transparent border-none outline-none flex-1 font-bold text-sm"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                />
                <button 
                  onClick={handleAnalyze}
                  disabled={analyzing || !repoUrl}
                  className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all disabled:opacity-50"
                >
                  {analyzing ? "Analyzing Structure..." : "Analyze Architecture"}
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-2xl border flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Security Audit</span>
                </div>
                <div className="p-4 bg-muted/50 rounded-2xl border flex items-center gap-3">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Perf Analysis</span>
                </div>
                <div className="p-4 bg-muted/50 rounded-2xl border flex items-center gap-3">
                  <Box className="w-5 h-5 text-indigo-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Design Patterns</span>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {analyzing ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-[400px] flex flex-col items-center justify-center text-center"
                >
                  <div className="w-16 h-16 relative mb-6">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full"
                    />
                    <div className="absolute inset-2 bg-indigo-600/5 rounded-full flex items-center justify-center">
                      <Terminal className="w-6 h-6 text-indigo-600 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-1 text-left max-w-xs w-full bg-slate-900 p-4 rounded-xl border border-white/10 font-mono text-[10px]">
                    {analysisLog.map((log, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        key={i} 
                        className="flex items-center gap-2 text-green-400"
                      >
                        <span className="opacity-50">[{i+1}]</span> {log}
                        <CheckCircle2 className="w-2.5 h-2.5 ml-auto" />
                      </motion.div>
                    ))}
                    <div className="w-full h-1 bg-white/10 mt-4 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }} 
                        className="h-full bg-indigo-500" 
                       />
                    </div>
                  </div>
                </motion.div>
              ) : results ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="p-6 bg-indigo-500 text-white rounded-3xl text-center shadow-xl shadow-indigo-600/20">
                      <div className="text-4xl font-black mb-1">{results.score}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Arch Score</div>
                    </div>
                    <div className="p-6 bg-muted/50 rounded-3xl text-center border">
                      <div className="text-2xl font-black mb-1">{results.complexity}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Complexity</div>
                    </div>
                    <div className="p-6 bg-muted/50 rounded-3xl text-center border">
                      <div className="text-2xl font-black mb-1">{results.security}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Security</div>
                    </div>
                    <div className="p-6 bg-muted/50 rounded-3xl text-center border">
                      <div className="text-2xl font-black mb-1">{results.maintainability}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Health</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Play className="w-3 h-3 rotate-90" /> Architectural Critical Issues
                    </h4>
                    {results.issues.map((issue: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-background border border-border/50 rounded-[2rem] hover:border-indigo-600/30 transition-all shadow-sm">
                        <div className="flex items-center gap-6">
                          <div className={cn("w-2 h-2 rounded-full", issue.impact === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-amber-500')}/>
                          <div>
                            <p className="text-sm font-bold text-foreground">{issue.label}</p>
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{issue.type}</span>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-muted rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Fix Advice</button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center text-center opacity-40">
                  <Box className="w-16 h-16 mb-4" />
                  <p className="text-sm font-bold uppercase tracking-widest">Connect a repository to begin structural audit</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] bg-indigo-600 text-white relative overflow-hidden">
             <Sparkles className="absolute top-4 right-4 w-12 h-12 opacity-10" />
            <h3 className="font-black text-sm uppercase tracking-widest mb-6">Neural Optimization</h3>
            <div className="p-6 bg-white/10 rounded-2xl border border-white/10 mb-6">
              <h4 className="text-xs font-black mb-2 uppercase">Design Pattern Detected</h4>
              <p className="text-[11px] font-medium opacity-80 leading-relaxed italic">
                "We detected heavy use of Singleton Pattern. While effective, consider Dependency Injection to improve testability by 65%."
              </p>
            </div>
            <button className="w-full py-4 bg-white/20 hover:bg-white/30 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all">Generate UML Diagram</button>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border-indigo-600/10">
            <h3 className="font-black text-sm uppercase tracking-widest mb-6">Global Benchmarks</h3>
            <div className="space-y-4">
              {[
                { label: "Code Coverage", val: 82, target: 90 },
                { label: "Technical Debt", val: 14, target: 10 },
                { label: "Sync Performance", val: 94, target: 95 },
              ].map(stat => (
                <div key={stat.label} className="flex flex-col gap-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span className="text-muted-foreground">{stat.label}</span>
                    <span>{stat.val}%</span>
                  </div>
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className="h-full bg-indigo-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
