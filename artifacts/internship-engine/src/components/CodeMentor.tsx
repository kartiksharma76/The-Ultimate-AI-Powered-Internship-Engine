import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Sparkles, Layout, Shield, Cpu, ChevronRight, CheckCircle2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const insights = [
  { id: 1, type: 'structure', title: 'Modular Decoupling', desc: 'Abstract this logic into a dedicated custom hook to reduce component complexity by 40%.', icon: Layout, color: 'text-blue-500' },
  { id: 2, type: 'security', title: 'Injection Guard', desc: 'Sanitize these inputs before processing to mitigate XSS vulnerabilities in the data layer.', icon: Shield, color: 'text-emerald-500' },
  { id: 3, type: 'perf', title: 'Computation Memo', desc: 'Wrap this transformation in useMemo to prevent unnecessary re-renders during state updates.', icon: Cpu, color: 'text-amber-500' },
];

export default function CodeMentor() {
  const [code, setCode] = useState(`function processData(data) {
  let result = [];
  for(let i=0; i<data.length; i++) {
    if(data[i].active) {
      result.push(data[i]);
    }
  }
  return result;
}`);

  const [analyzing, setAnalyzing] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setShowInsights(true);
    }, 2000);
  };

  return (
    <div className="glass-card rounded-[2.5rem] p-8 h-full flex flex-col relative overflow-hidden group border-primary/20">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <Code2 className="w-32 h-32 text-primary" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-primary" />
              Architect's Lens
            </h3>
            <h2 className="text-2xl font-black tracking-tight">AI Code <span className="text-primary">Architect</span></h2>
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Enterprise Mode</span>
          </div>
        </div>

        <div className="flex-1 min-h-[250px] relative">
          <div className="absolute inset-0 bg-slate-950 rounded-[2rem] border border-white/5 p-6 overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
              <span className="text-[10px] font-mono text-white/30 ml-2 uppercase tracking-widest">analyzer.js</span>
            </div>
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-blue-400 font-mono text-sm leading-relaxed resize-none custom-scrollbar"
              spellCheck={false}
            />
          </div>
          
          <AnimatePresence>
            {analyzing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-[2rem] flex flex-col items-center justify-center gap-4 z-20"
              >
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <div className="text-xs font-black uppercase tracking-[0.3em] text-primary animate-pulse">Deep Structural Analysis...</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8">
          {!showInsights ? (
            <button 
              onClick={handleAnalyze}
              className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Analyze Architecture <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {insights.map((insight, i) => (
                <motion.div 
                  key={insight.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-muted/30 rounded-2xl border border-border/50 group/item hover:border-primary/30 transition-all"
                >
                  <div className={cn("p-2 bg-background rounded-lg border border-border shadow-sm group-hover/item:border-primary/50 transition-colors", insight.color)}>
                    <insight.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-tight mb-1">{insight.title}</div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">{insight.desc}</p>
                  </div>
                </motion.div>
              ))}
              <button 
                onClick={() => setShowInsights(false)}
                className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                Reset Analysis
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
