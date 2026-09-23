import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Sparkles, BookOpen, CheckCircle2, Zap, Play, ArrowRight, ShieldCheck, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LearningPathsPage() {
  const [activePath, setActivePath] = useState<number | null>(null);
  const [insight, setInsight] = useState<string>("Based on current job openings at Microsoft, completing the 'Cloud Native DevOps' path will increase your profile match by 42%.");
  const [loadingInsight, setLoadingInsight] = useState(false);

  const fetchInsight = async () => {
    setLoadingInsight(true);
    try {
      const response = await fetch("/api/ai/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "learning-paths", studentId: 1 })
      });
      const data = await response.json();
      if (data.path && data.path.length > 0) {
        setInsight(`AI suggests focusing on: ${data.path[0].step} to stay competitive.`);
      }
    } catch (e) {
      setInsight("Mastering System Design will unlock Staff Engineer roles for you.");
    } finally {
      setLoadingInsight(false);
    }
  };

  const paths = [
    { id: 1, title: "Full-Stack Architect", icon: Zap, duration: "12 Weeks", modules: 24, difficulty: "Expert", progress: 65 },
    { id: 2, title: "AI/ML Systems Engineer", icon: Sparkles, duration: "16 Weeks", modules: 32, difficulty: "Elite", progress: 20 },
    { id: 3, title: "Cloud Native DevOps", icon: ShieldCheck, duration: "8 Weeks", modules: 18, difficulty: "Pro", progress: 0 },
    { id: 4, title: "Backend Systems Design", icon: BookOpen, duration: "10 Weeks", modules: 20, difficulty: "Expert", progress: 90 },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20">
              <Map className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Skill Intelligence</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Mastery <span className="text-indigo-600">Paths</span></h1>
          <p className="text-muted-foreground font-medium">Interactive, industry-aligned learning roadmaps designed for role-specific mastery.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="grid md:grid-cols-2 gap-6">
            {paths.map((path, i) => {
              const Icon = path.icon;
              return (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-10 rounded-[3.5rem] hover:border-indigo-600/30 transition-all group flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-8">
                     <div className="w-16 h-16 bg-muted rounded-[1.5rem] flex items-center justify-center group-hover:bg-indigo-600/10 transition-colors">
                        <Icon className="w-8 h-8 text-indigo-600" />
                     </div>
                     <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-widest">{path.difficulty}</span>
                  </div>
                  <h3 className="text-2xl font-black mb-4 group-hover:text-indigo-600 transition-colors">{path.title}</h3>
                  <div className="flex items-center gap-6 mb-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                     <span>{path.duration}</span>
                     <span>{path.modules} Modules</span>
                  </div>
                  <div className="mt-auto space-y-4">
                     <div className="flex justify-between text-[10px] font-black uppercase">
                        <span>Pathway Progress</span>
                        <span>{path.progress}%</span>
                     </div>
                     <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${path.progress}%` }} className="h-full bg-indigo-600" />
                     </div>
                     <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all flex items-center justify-center gap-2 mt-4">
                        <Play className="w-4 h-4" /> {path.progress > 0 ? 'Resume Learning' : 'Start Mastery'}
                     </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] bg-indigo-600 text-white relative overflow-hidden">
             <Star className="absolute top-4 right-4 w-12 h-12 opacity-10" />
             <h3 className="font-black text-sm uppercase tracking-widest mb-6">AI Career Compass</h3>
             <div className="p-6 bg-white/10 rounded-2xl border border-white/10 mb-8 font-medium text-xs leading-relaxed italic">
               "{insight}"
             </div>
             <button onClick={fetchInsight} disabled={loadingInsight} className="w-full py-4 bg-white/20 hover:bg-white/30 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
               {loadingInsight ? "Analyzing Market..." : "Identify Skill Gaps"}
             </button>
          </div>

          <div className="p-8 bg-muted border-2 border-border/50 rounded-[2.5rem] text-center">
             <CheckCircle2 className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
             <h3 className="text-sm font-black uppercase tracking-widest mb-2">Certified Mastery</h3>
             <p className="text-[10px] text-muted-foreground font-medium px-4 leading-relaxed italic">"Earn industry-verified certifications upon completion of high-stakes mastery modules."</p>
          </div>
        </div>
      </div>
    </div>
  );
}
