import { useState } from "react";
import { useRoute, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useGetCareerPaths, useGetStudent, useListStudents } from "@workspace/api-client-react";
import { getScoreBg, getScoreColor, cn } from "@/lib/utils";
import { Compass, Calendar, ChevronRight, CheckCircle2, Target, Zap, LayoutDashboard, Sparkles, BrainCircuit } from "lucide-react";

export default function CareerPathsPage() {
  const [, params] = useRoute("/career-paths/:studentId");
  const studentId = parseInt(params?.studentId ?? "1");

  const { data: student } = useGetStudent(studentId, { query: { enabled: !!studentId, queryKey: ["student", studentId] } });
  const { data: careerPaths, isLoading } = useGetCareerPaths(studentId, {
    query: { enabled: !!studentId, queryKey: ["career-paths", studentId] }
  });
  const { data: students } = useListStudents();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative">
      <div className="fixed inset-0 pointer-events-none opacity-[0.2] mesh-gradient -z-10" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Compass className="w-5 h-5 text-primary" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Strategic Guidance</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Career <span className="text-gradient">Trajectories</span></h1>
          {student && (
            <p className="text-muted-foreground font-medium italic">
              Computational roadmaps synthesized for <span className="text-foreground font-black">{student.name}</span>
            </p>
          )}
        </div>
        
        {students && students.length > 1 && (
          <div className="flex items-center gap-2 p-1 bg-muted/30 rounded-2xl border border-border/50">
            {students.map(s => (
              <Link key={s.id} href={`/career-paths/${s.id}`}>
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
        <div className="grid md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => <div key={i} className="glass-card rounded-[2.5rem] p-10 animate-pulse h-96" />)}
        </div>
      ) : careerPaths && careerPaths.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-8">
          {careerPaths.map((path, i) => (
            <motion.div
              key={path.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={cn(
                "glass-card rounded-[2.5rem] p-8 flex flex-col relative overflow-hidden group hover:border-primary/30 transition-all duration-500",
                i === 0 && "ring-2 ring-primary/20"
              )}
            >
              {i === 0 && (
                <div className="absolute top-0 right-0 px-6 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-bl-[1.5rem] shadow-xl">
                  Optimal Match
                </div>
              )}

              <div className="flex items-start justify-between gap-6 mb-8">
                <div>
                  <h2 className="font-black text-2xl tracking-tight mb-2 group-hover:text-primary transition-colors">{path.title}</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {path.timelineMonths} Months
                    </div>
                    <div className="h-1 w-1 rounded-full bg-muted" />
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <Target className="w-3.5 h-3.5 text-accent" />
                      {path.steps.length} Milestones
                    </div>
                  </div>
                </div>
                <div className={cn("text-2xl font-black px-5 py-3 rounded-[1.5rem] shadow-inner", getScoreBg(path.matchScore))}>
                  {path.matchScore}%
                </div>
              </div>

              <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-8">{path.description}</p>

              {/* Match Visualization */}
              <div className="mb-8 p-6 bg-muted/20 rounded-[2rem] border border-border/30">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                  <span className="text-muted-foreground">Competency Alignment</span>
                  <span className={cn(getScoreColor(path.matchScore))}>{path.matchScore}% Precise</span>
                </div>
                <div className="h-3 bg-muted/50 rounded-full overflow-hidden p-[2px]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${path.matchScore}%` }}
                    transition={{ duration: 1.2, delay: i * 0.2, ease: "circOut" }}
                    className={cn(
                      "h-full rounded-full shadow-lg",
                      path.matchScore >= 75 ? "bg-gradient-to-r from-emerald-500 to-teal-400" : 
                      path.matchScore >= 50 ? "bg-gradient-to-r from-amber-500 to-orange-400" : 
                      "bg-gradient-to-r from-primary"
                    )}
                  />
                </div>
              </div>

              {/* Skill Gaps */}
              <div className="mb-8">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 ml-1">Technological Requirements</div>
                <div className="flex flex-wrap gap-2">
                  {path.requiredSkills.map(skill => {
                    const has = student?.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase()));
                    return (
                      <span
                        key={skill}
                        className={cn(
                          "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border transition-all",
                          has
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 flex items-center gap-1.5"
                            : "bg-muted/30 border-muted text-muted-foreground/60 line-through"
                        )}
                      >
                        {has && <CheckCircle2 className="w-3 h-3" />}
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Step Roadmap */}
              <div className="flex-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 ml-1">Tactical Roadmap</div>
                <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted/50">
                  {path.steps.map((step, si) => (
                    <div key={si} className="flex items-start gap-4 relative z-10 group/step">
                      <div className="w-6 h-6 rounded-full bg-background border-2 border-primary text-primary flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 group-hover/step:bg-primary group-hover/step:text-white transition-colors">
                        {si + 1}
                      </div>
                      <p className="text-xs font-bold text-muted-foreground leading-relaxed group-hover/step:text-foreground transition-colors">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-border/50 grid grid-cols-2 gap-4">
                <Link href={`/skill-gap/${studentId}`} className="w-full">
                  <button className="w-full py-4 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest bg-muted/20 hover:bg-muted/40 transition-all flex items-center justify-center gap-2">
                    <Zap className="w-3.5 h-3.5" /> Skill Analysis
                  </button>
                </Link>
                <Link href={`/recommendations/${studentId}`} className="w-full">
                  <button className="w-full py-4 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest bg-foreground text-background hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5" /> Find Matches
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 bg-muted/30 rounded-[2.5rem] flex items-center justify-center mb-8 border border-border/50">
            <LayoutDashboard className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <h3 className="text-3xl font-black mb-4">No Data Streams Found</h3>
          <p className="text-muted-foreground max-w-md font-medium italic mb-10 leading-relaxed">Synchronize your profile parameters to initialize the career trajectory synthesizer.</p>
          <Link href="/profile">
            <button className="px-10 py-5 bg-primary text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all">Initialize Profile</button>
          </Link>
        </div>
      )}

      {/* Advanced AI Roadmap Synthesizer */}
      <AIRoadmapSynthesizer studentId={studentId} />
    </div>
  );
}

function AIRoadmapSynthesizer({ studentId }: { studentId: number }) {
  const [targetRole, setTargetRole] = useState("");
  const [roadmap, setRoadmap] = useState<any[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRoadmap = async () => {
    if (!targetRole.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch(`http://localhost:8080/api/ai/generate-roadmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, targetRole })
      });
      const data = await res.json();
      setRoadmap(data.roadmap);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-24 glass-card rounded-[3rem] p-12 border-primary/20 bg-primary/5 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-16 opacity-[0.03] -rotate-12">
        <Sparkles className="w-64 h-64 text-primary" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 relative z-10">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/30 text-white">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Neural Roadmap Gen</h4>
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6 leading-tight">Synthesize a <span className="text-gradient">Custom Career Plan</span></h2>
          <p className="text-muted-foreground font-medium italic mb-10 leading-relaxed text-sm">
            Enter your desired role and our AI will compute a week-by-week learning roadmap based on your current skill mesh.
          </p>
          
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="e.g. Senior Backend Engineer"
              className="w-full bg-background/50 border-2 border-primary/10 rounded-2xl px-6 py-5 text-sm font-black focus:border-primary transition-all outline-none"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />
            <button 
              onClick={generateRoadmap}
              disabled={isGenerating || !targetRole.trim()}
              className="w-full py-5 bg-foreground text-background rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  Computing Trajectory...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate 4-Week Plan
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {roadmap ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {roadmap.map((week, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-background rounded-[2rem] border border-primary/10 shadow-xl group hover:border-primary/40 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-lg">Week {week.week}</span>
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground/30 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <h4 className="font-black text-sm mb-4 leading-tight">{week.title}</h4>
                  <div className="space-y-3">
                    {week.tasks.map((task: string, ti: number) => (
                      <div key={ti} className="flex items-start gap-2 text-[10px] font-medium text-muted-foreground leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/30 mt-1.5 shrink-0" />
                        {task}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-full min-h-[300px] border-2 border-dashed border-primary/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 text-muted-foreground">
              <BrainCircuit className="w-12 h-12 mb-6 opacity-20" />
              <p className="text-xs font-black uppercase tracking-[0.2em]">Awaiting Simulation</p>
              <p className="text-[10px] mt-2 font-bold max-w-[200px]">Input your target role to generate a neural learning roadmap.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
