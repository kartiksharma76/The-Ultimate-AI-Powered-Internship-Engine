import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Network, Sparkles, Zap, Target, Activity, Share2, Download, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SkillGraphPage() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [skills, setSkills] = useState<any[]>([
    { name: "Frontend", level: 90, sub: ["React", "TypeScript", "Tailwind"], color: "bg-primary" },
    { name: "Backend", level: 75, sub: ["Node.js", "Go", "PostgreSQL"], color: "bg-indigo-600" },
    { name: "AI / ML", level: 60, sub: ["PyTorch", "Llama 3.1", "Scikit-learn"], color: "bg-violet-600" },
    { name: "DevOps", level: 45, sub: ["Docker", "Kubernetes", "AWS"], color: "bg-emerald-500" },
    { name: "Soft Skills", level: 85, sub: ["Negotiation", "Leadership"], color: "bg-amber-500" },
  ]);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const response = await fetch("/api/ai/intelligence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ module: "skill-graph", studentId: 1 })
        });
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setSkills(data.map((s: any, i: number) => ({
            ...s,
            color: i === 0 ? "bg-primary" : i === 1 ? "bg-indigo-600" : i === 2 ? "bg-violet-600" : "bg-emerald-500"
          })));
        }
      } catch (e) {
        console.error("Skill Graph AI failed", e);
      }
    };
    fetchGraph();
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20">
              <Network className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Neural Mapping</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Skill <span className="text-indigo-600">Graph 3D</span></h1>
          <p className="text-muted-foreground font-medium">Interactive visualization of your technical and cognitive ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="p-3 bg-muted/50 rounded-xl hover:bg-muted transition-all border border-border/50"><Share2 className="w-4 h-4 text-muted-foreground" /></button>
           <button className="p-3 bg-muted/50 rounded-xl hover:bg-muted transition-all border border-border/50"><Download className="w-4 h-4 text-muted-foreground" /></button>
           <button className="px-6 py-3 bg-foreground text-background rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
             <Maximize2 className="w-3.5 h-3.5" /> Full Screen
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 h-[650px]">
        <div className="lg:col-span-9">
          <div className="glass-card rounded-[3.5rem] bg-[#050505] border-indigo-600/20 h-full relative overflow-hidden group">
            {/* 3D Mock Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.15),_transparent_70%)]" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>

            {/* Neural Web Simulation */}
            <div className="absolute inset-0 flex items-center justify-center p-20">
               <div className="relative w-full h-full">
                  {skills.map((s, i) => {
                    const angle = (i / skills.length) * (2 * Math.PI);
                    const x = 50 + Math.cos(angle) * 35;
                    const y = 50 + Math.sin(angle) * 35;
                    
                    return (
                      <motion.div
                        key={s.name}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1, type: "spring" }}
                        onMouseEnter={() => setActiveNode(s.name)}
                        onMouseLeave={() => setActiveNode(null)}
                        style={{ left: `${x}%`, top: `${y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group/node cursor-pointer z-20"
                      >
                         <div className={cn("w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center relative transition-all duration-500", s.color, activeNode === s.name ? "scale-125 shadow-[0_0_50px_rgba(99,102,241,0.5)]" : "scale-100")}>
                            <Zap className="w-8 h-8 text-white" />
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap bg-black/40 px-3 py-1 rounded-full border border-white/10">{s.name}</div>
                         </div>

                         {/* Sub-node Connectors */}
                         {activeNode === s.name && (
                           <div className="absolute inset-0">
                              {(s.sub || []).map((sub: any, idx: number) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                  animate={{ 
                                    opacity: 1, 
                                    scale: 1, 
                                    x: Math.cos((idx / (s.sub?.length || 1)) * 2 * Math.PI) * 80,
                                    y: Math.sin((idx / (s.sub?.length || 1)) * 2 * Math.PI) * 80
                                  }}
                                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center text-[8px] font-bold text-white text-center p-2"
                                >
                                  {sub}
                                </motion.div>
                              ))}
                           </div>
                         )}
                      </motion.div>
                    );
                  })}
                  
                  {/* Central Core */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full border border-white/10 flex items-center justify-center animate-pulse">
                     <div className="w-16 h-16 bg-indigo-600/40 rounded-full blur-xl animate-pulse" />
                     <Sparkles className="w-12 h-12 text-indigo-400 relative z-10" />
                  </div>

                  {/* Connecting Lines (Mock) */}
                  <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                    <circle cx="50%" cy="50%" r="35%" fill="none" stroke="white" strokeWidth="1" strokeDasharray="5 5" />
                  </svg>
               </div>
            </div>

            {/* HUD Overlays */}
            <div className="absolute top-8 left-8 text-white z-30">
               <div className="text-[10px] font-black uppercase tracking-[0.5em] opacity-50 mb-2">System Status</div>
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xl font-black">Neural Link Active</span>
               </div>
            </div>

            <div className="absolute bottom-8 right-8 z-30 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-4 text-white">
               <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Node Properties</div>
               <div className="flex items-center gap-10">
                  <div>
                    <div className="text-2xl font-black">{activeNode ? (skills.find(s => s.name === activeNode)?.level || 0) : "92"}%</div>
                    <div className="text-[9px] font-black uppercase opacity-60">Compatibility</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black">{activeNode ? "Tier 1" : "Global"}</div>
                    <div className="text-[9px] font-black uppercase opacity-60">Market Rank</div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
           <div className="glass-card p-8 rounded-[2.5rem] border-indigo-600/20">
              <h3 className="font-black text-sm uppercase tracking-widest mb-6">Growth Pulse</h3>
              <div className="space-y-8">
                 {skills.map(s => (
                   <div key={s.name} className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase">
                         <span className="text-muted-foreground">{s.name}</span>
                         <span>{s.level}%</span>
                      </div>
                      <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                         <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${s.level}%` }}
                          className={cn("h-full", s.color)}
                         />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white">
              <h3 className="font-black text-sm uppercase tracking-widest mb-4">AI Optimizer</h3>
              <p className="text-[11px] font-medium leading-relaxed opacity-80 mb-6 italic">
                "Increasing your 'DevOps' node density by just 15% will unlock L4-equivalent roles at AWS and Azure."
              </p>
              <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Execute Learning Path</button>
           </div>
        </div>
      </div>
    </div>
  );
}
