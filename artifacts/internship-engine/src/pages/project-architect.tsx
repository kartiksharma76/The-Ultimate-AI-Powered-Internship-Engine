import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Component, Sparkles, Code2, Layers, Cpu, Rocket, ChevronRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const projects = [
  {
    title: "Real-time Traffic Orchestrator",
    tech: ["Go", "Kafka", "WebSockets"],
    difficulty: "Advanced",
    impact: "High",
    description: "A distributed system to manage live traffic data with sub-10ms latency."
  },
  {
    title: "Neural Vision Edge",
    tech: ["Python", "TensorFlow Lite", "Raspberry Pi"],
    difficulty: "Intermediate",
    impact: "High",
    description: "On-device object detection for edge computing in industrial settings."
  },
  {
    title: "DeFi Liquidity Engine",
    tech: ["Solidity", "Ethers.js", "React"],
    difficulty: "Advanced",
    impact: "Elite",
    description: "A secure automated market maker (AMM) with multi-token support."
  }
];

export default function ProjectArchitectPage() {
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleGenerate = async () => {
    setGenerating(true);
    setResults([]);
    try {
      const response = await fetch("/api/ai/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "project-architect", studentId: 1 })
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setResults(data);
      } else {
        setResults(projects); // Fallback
      }
    } catch (e) {
      console.error("AI Generation failed", e);
      setResults(projects);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-violet-600 rounded-xl text-white shadow-lg shadow-violet-600/20">
              <Component className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Portfolio Engineering</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Project <span className="text-violet-600">Architect</span></h1>
          <p className="text-muted-foreground font-medium">Build what matters. AI-generated project roadmaps that fill your skill gaps.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-card p-12 rounded-[3.5rem] relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 blur-3xl pointer-events-none" />
             
             <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto py-10">
               <div className="w-20 h-20 bg-violet-50 rounded-[2.5rem] flex items-center justify-center mb-8">
                 <Cpu className="w-10 h-10 text-violet-600 animate-pulse" />
               </div>
               <h2 className="text-3xl font-black mb-4">Analyze Your Gaps</h2>
               <p className="text-sm text-muted-foreground font-medium mb-10 leading-relaxed italic">"We'll cross-reference your current skills with Tier-1 requirements to find exactly which project will boost your resume the most."</p>
               <button 
                onClick={handleGenerate}
                disabled={generating}
                className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3"
               >
                 {generating ? "Synthesizing Architecture..." : "Generate Roadmaps"}
                 <Sparkles className="w-4 h-4" />
               </button>
             </div>

             <AnimatePresence>
               {results.length > 0 && (
                 <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-16 space-y-8"
                 >
                   <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground border-b pb-4">Architectural Blueprints</h3>
                   <div className="grid gap-6">
                     {results.map((project, i) => (
                       <div key={i} className="p-8 bg-muted/30 border border-border/50 rounded-[2.5rem] hover:border-violet-600/30 transition-all group">
                         <div className="flex flex-col md:flex-row justify-between gap-6">
                           <div className="flex-1">
                             <div className="flex items-center gap-3 mb-4">
                               <span className="px-3 py-1 bg-violet-600/10 text-violet-600 text-[9px] font-black uppercase rounded-lg border border-violet-600/20">{project.difficulty}</span>
                               <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase rounded-lg border border-emerald-500/20">{project.impact} Impact</span>
                             </div>
                             <h4 className="text-2xl font-black mb-2 group-hover:text-violet-600 transition-colors">{project.title}</h4>
                             <p className="text-sm text-muted-foreground font-medium mb-6">{project.description}</p>
                             <div className="flex flex-wrap gap-2">
                               {project.tech.map(t => (
                                 <span key={t} className="text-[10px] font-bold px-3 py-1 bg-background rounded-lg border border-border/50">{t}</span>
                               ))}
                             </div>
                           </div>
                           <button className="h-14 md:h-auto px-8 bg-violet-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition-all">
                             Build <Rocket className="w-4 h-4" />
                           </button>
                         </div>
                       </div>
                     ))}
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="glass-card p-8 rounded-[2.5rem] bg-violet-600 text-white relative overflow-hidden">
             <div className="absolute -top-4 -right-4 opacity-10">
               <Layers className="w-32 h-32" />
             </div>
             <h3 className="font-black text-sm uppercase tracking-widest mb-6">Market Hot-Tech</h3>
             <div className="space-y-6">
                {[
                  { name: "Rust / WASM", trend: 92 },
                  { name: "MLOps", trend: 85 },
                  { name: "Solidity", trend: 64 },
                ].map(tech => (
                  <div key={tech.name} className="flex flex-col gap-2">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                      <span>{tech.name}</span>
                      <span>{tech.trend}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${tech.trend}%` }} className="h-full bg-white" />
                    </div>
                  </div>
                ))}
             </div>
           </div>

           <div className="p-8 bg-muted border-2 border-border/50 rounded-[2.5rem]">
             <h3 className="font-black text-sm mb-4 uppercase tracking-widest flex items-center gap-2">
               <CheckCircle2 className="w-4 h-4 text-violet-600" /> Success Metrics
             </h3>
             <ul className="space-y-4">
               {[
                 "Average Github Stars: +12",
                 "Interview Conversion: +24%",
                 "Technical Score: 9.2/10"
               ].map((m, i) => (
                 <li key={i} className="text-[11px] font-bold text-muted-foreground flex items-center gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-violet-600" /> {m}
                 </li>
               ))}
             </ul>
           </div>
        </div>
      </div>
    </div>
  );
}
