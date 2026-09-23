import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, DollarSign, ArrowRight, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const SKILLS = [
  { id: 'k8s', name: 'Kubernetes', multiplier: 1.25, color: 'bg-blue-500' },
  { id: 'pytorch', name: 'PyTorch/AI', multiplier: 1.40, color: 'bg-orange-500' },
  { id: 'aws', name: 'AWS Expert', multiplier: 1.15, color: 'bg-yellow-500' },
  { id: 'rust', name: 'Rust Lang', multiplier: 1.35, color: 'bg-red-500' },
];

export default function CareerMultiplier() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const baseStipend = 25000;
  
  const currentMultiplier = selectedSkills.reduce((acc, skillId) => {
    const skill = SKILLS.find(s => s.id === skillId);
    return acc * (skill?.multiplier || 1);
  }, 1);

  const predictedStipend = baseStipend * currentMultiplier;
  const growth = predictedStipend - baseStipend;

  const toggleSkill = (id: string) => {
    setSelectedSkills(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="glass-card rounded-[2.5rem] p-8 h-full flex flex-col relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-primary" />
              Financial Projection
            </h3>
            <h2 className="text-2xl font-black tracking-tight">AI Career <span className="text-primary">Multiplier</span></h2>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
        </div>

        <p className="text-sm text-muted-foreground font-medium mb-8 leading-relaxed">
          Select skills to see how they impact your predicted internship stipend based on <span className="text-foreground font-bold underline decoration-primary/30">real-time global hiring data</span>.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {SKILLS.map(skill => {
            const isActive = selectedSkills.includes(skill.id);
            return (
              <button
                key={skill.id}
                onClick={() => toggleSkill(skill.id)}
                className={cn(
                  "p-4 rounded-2xl border text-left transition-all duration-300 relative group overflow-hidden",
                  isActive 
                    ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "bg-muted/30 border-border hover:border-primary/50 text-foreground"
                )}
              >
                <div className="relative z-10">
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">+{Math.round((skill.multiplier - 1) * 100)}% ROI</div>
                  <div className="text-sm font-black">{skill.name}</div>
                </div>
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="skill-bg"
                      className="absolute inset-0 bg-primary z-0"
                    />
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>

        <div className="mt-auto bg-muted/50 rounded-3xl p-6 border border-border/50">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Predicted Stipend</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tighter">₹{Math.round(predictedStipend).toLocaleString()}</span>
                <span className="text-xs font-bold text-muted-foreground">/mo</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Growth</div>
              <div className="text-xl font-black text-emerald-500">+₹{Math.round(growth).toLocaleString()}</div>
            </div>
          </div>
          
          <div className="mt-6 w-full h-2 bg-background rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "20%" }}
              animate={{ width: `${Math.min(100, (currentMultiplier - 1) * 200 + 20)}%` }}
              className="h-full bg-primary"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`} alt="user" />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-background bg-primary flex items-center justify-center text-[8px] font-black text-white">
              +1.2k
            </div>
          </div>
          <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:gap-3 transition-all">
            Get Roadmap <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
