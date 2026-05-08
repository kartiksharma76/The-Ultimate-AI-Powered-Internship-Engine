import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { useGetSkillGap, useGetStudent, useListStudents } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import { BrainCircuit, Target, Zap, AlertCircle, BookOpen, GraduationCap, ChevronRight, LayoutDashboard, Sparkles, Activity } from "lucide-react";

const PRIORITY_CONFIG = {
  high: { 
    label: "Critical Matrix", 
    color: "bg-red-500/10 text-red-500 border-red-500/20", 
    dot: "bg-red-500",
    gradient: "from-red-500/20 to-transparent"
  },
  medium: { 
    label: "Strategic Development", 
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20", 
    dot: "bg-amber-500",
    gradient: "from-amber-500/20 to-transparent"
  },
  low: { 
    label: "Optimization Path", 
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20", 
    dot: "bg-blue-500",
    gradient: "from-blue-500/20 to-transparent"
  },
};

export default function SkillGapPage() {
  const [, params] = useRoute("/skill-gap/:studentId");
  const studentId = parseInt(params?.studentId ?? "1");

  const { data: student } = useGetStudent(studentId, { query: { enabled: !!studentId, queryKey: ["student", studentId] } });
  const { data: skillGap, isLoading } = useGetSkillGap(studentId, {
    query: { enabled: !!studentId, queryKey: ["skillgap", studentId] }
  });
  const { data: students } = useListStudents();

  const highPriority = skillGap?.skillGaps.filter(g => g.priority === "high") ?? [];
  const medPriority = skillGap?.skillGaps.filter(g => g.priority === "medium") ?? [];
  const lowPriority = skillGap?.skillGaps.filter(g => g.priority === "low") ?? [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative">
      <div className="fixed inset-0 pointer-events-none opacity-[0.2] mesh-gradient -z-10" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Neural Diagnostics</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Skill Gap <span className="text-gradient">Analysis</span></h1>
          {student && (
            <p className="text-muted-foreground font-medium italic">
              Computational deficiency metrics for <span className="text-foreground font-black">{student.name}</span>
            </p>
          )}
        </div>
        
        {students && students.length > 1 && (
          <div className="flex items-center gap-2 p-1 bg-muted/30 rounded-2xl border border-border/50">
            {students.map(s => (
              <Link key={s.id} href={`/skill-gap/${s.id}`}>
                <button className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  s.id === studentId 
                    ? "bg-foreground text-background shadow-lg" 
                    : "text-muted-foreground hover:text-foreground"
                )}>
                  {s.name.split(" ")[0]}
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => <div key={i} className="glass-card rounded-[2.5rem] p-10 animate-pulse h-48" />)}
        </div>
      ) : skillGap ? (
        <>
          {/* Diagnostic Metrics Overview */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { label: "Active Nodes", value: skillGap.currentSkills.length, icon: BrainCircuit, color: "text-primary", sub: (skillGap.currentSkills.slice(0, 2).join(", ") || "None") + "..." },
              { label: "Latency Gaps", value: skillGap.skillGaps.length, icon: AlertCircle, color: HighPriorityColor(highPriority.length), sub: `${highPriority.length} Critical` },
              { label: "Vector Targets", value: skillGap.targetRoles.length, icon: Target, color: "text-accent", sub: skillGap.targetRoles.join(", ") }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-[2.5rem] p-8 hover:bg-muted/20 transition-all border-border/30 group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="p-4 bg-muted/50 rounded-2xl group-hover:scale-110 transition-transform">
                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                  <div className="text-4xl font-black tracking-tight">{stat.value}</div>
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{stat.label}</div>
                <div className="text-xs font-bold text-foreground/70 truncate">{stat.sub}</div>
              </motion.div>
            ))}
          </div>

          {/* AI Tactical Recommendations */}
          {skillGap.recommendations.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="glass-card rounded-[2.5rem] p-10 mb-12 border-primary/20 bg-primary/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                <Sparkles className="w-24 h-24 text-primary" />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-8 flex items-center gap-3">
                <Sparkles className="w-5 h-5" /> AI Synthesis Engine
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {skillGap.recommendations.map((rec, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="flex items-start gap-4 p-5 bg-background/40 rounded-[1.5rem] border border-border/30 hover:border-primary/30 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm font-bold text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors italic">"{rec}"</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Priority Matrix */}
          <div className="space-y-12">
            {[
              { priority: "high", gaps: highPriority },
              { priority: "medium", gaps: medPriority },
              { priority: "low", gaps: lowPriority },
            ].filter(g => g.gaps.length > 0).map(({ priority, gaps }, pi) => {
              const cfg = PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG];
              return (
                <motion.div
                  key={priority}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (pi * 0.15) }}
                >
                  <div className="flex items-center gap-4 mb-8 ml-4">
                    <div className={cn("px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm flex items-center gap-2", cfg.color)}>
                      <div className={cn("w-2 h-2 rounded-full", cfg.dot)} />
                      {cfg.label}
                    </div>
                    <div className="h-[2px] flex-1 bg-border/30 rounded-full" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{gaps.length} Deficiencies</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {gaps.map((gap, i) => (
                      <motion.div
                        key={gap.skill}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="glass-card rounded-[2rem] p-8 border-border/30 hover:border-foreground/20 transition-all group/card relative overflow-hidden"
                      >
                        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-[0.03] transition-opacity group-hover/card:opacity-[0.06]", cfg.gradient)} />
                        <div className="flex items-center justify-between mb-6 relative z-10">
                          <h3 className="text-xl font-black tracking-tight group-hover/card:text-primary transition-colors">{gap.skill}</h3>
                          <GraduationCap className="w-5 h-5 text-muted-foreground/30 group-hover/card:text-primary transition-colors" />
                        </div>
                        
                        <div className="relative z-10">
                          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                            <BookOpen className="w-3.5 h-3.5" /> Acquisition Nodes
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {gap.resources.map(resource => (
                              <span key={resource} className="text-[10px] font-black uppercase tracking-widest bg-muted/40 text-foreground/70 px-4 py-2 rounded-xl border border-border/50 hover:bg-muted hover:text-foreground transition-all cursor-pointer">
                                {resource}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {skillGap.skillGaps.length === 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-24 glass-card rounded-[3rem] border-emerald-500/20 bg-emerald-500/5">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] mx-auto flex items-center justify-center mb-8 border border-emerald-500/30">
                <Zap className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-3xl font-black mb-4">Neural Integrity Optimized</h3>
              <p className="text-muted-foreground max-w-md mx-auto font-medium italic leading-relaxed">No technological deficiencies detected. Your current competency matrix aligns perfectly with target vectors.</p>
            </motion.div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 bg-muted/30 rounded-[2.5rem] flex items-center justify-center mb-8 border border-border/50">
            <LayoutDashboard className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <h3 className="text-3xl font-black mb-4">Diagnostics Offline</h3>
          <p className="text-muted-foreground max-w-md font-medium italic mb-10 leading-relaxed">The skill gap synthesizer requires a synchronized profile to initialize diagnostic sequences.</p>
          <Link href="/profile">
            <button className="px-10 py-5 bg-primary text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all">Initialize Sequence</button>
          </Link>
        </div>
      )}
    </div>
  );
}

function HighPriorityColor(count: number) {
  if (count > 5) return "text-red-500";
  if (count > 2) return "text-amber-500";
  return "text-emerald-500";
}
