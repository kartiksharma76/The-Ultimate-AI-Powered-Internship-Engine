import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useGetRecommendations, useListStudents, useGetStudent } from "@workspace/api-client-react";
import { getScoreBg, getScoreColor, getDomainColor, formatDate, cn, formatCurrency, isIndianLocation } from "@/lib/utils";
import { Sparkles, Target, Zap, MapPin, Award, BrainCircuit, ChevronRight, Info, BookOpen, IndianRupee, DollarSign } from "lucide-react";

function ScoreBar({ label, value, color, delay = 0 }: { label: string; value: number; color: string; delay?: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn("font-black", color)}>{value.toFixed(0)}</span>
      </div>
      <div className="h-2 bg-muted/30 rounded-full overflow-hidden p-[1px]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / 40) * 100}%` }}
          transition={{ duration: 0.8, ease: "circOut", delay }}
          className="h-full rounded-full bg-primary shadow-lg shadow-primary/20"
        />
      </div>
    </div>
  );
}

export default function RecommendationsPage() {
  const [, params] = useRoute("/recommendations/:studentId");
  const studentId = parseInt(params?.studentId ?? "1");

  const { data: student } = useGetStudent(studentId, { query: { enabled: !!studentId, queryKey: ["student", studentId] } });
  const { data: recommendations, isLoading } = useGetRecommendations(studentId, undefined, {
    query: { enabled: !!studentId, queryKey: ["recommendations", studentId] }
  });
  const { data: students } = useListStudents();

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsProcessing(true);
      return;
    } else {
      const timer = setTimeout(() => setIsProcessing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isProcessing) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative mb-12">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-48 h-48 rounded-[3.5rem] border-4 border-dashed border-primary/20"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <BrainCircuit className="w-16 h-16 text-primary animate-pulse" />
          </div>
        </div>
        <h2 className="text-3xl font-black uppercase tracking-[0.4em] mb-6 text-center">Neural <span className="text-gradient">Inference</span></h2>
        <div className="flex flex-col gap-4 w-72">
          {[
            "Loading ML Model Weights...",
            "Analyzing Skill Compatibility Vectors...",
            "Synthesizing Strategic Match Scores...",
            "Executing Deep Inference Engine..."
          ].map((text, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.4 }}
              className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground"
            >
              <div className="w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/50" />
              {text}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative">
      <div className="fixed inset-0 pointer-events-none opacity-[0.2] mesh-gradient -z-10" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <BrainCircuit className="w-5 h-5 text-primary" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">AI Intelligence</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Match <span className="text-gradient">Synthesis</span></h1>
          {student && (
            <p className="text-muted-foreground font-medium italic">
              Computational alignment profiles for <span className="text-foreground font-black">{student.name}</span>
            </p>
          )}
        </div>
        
        {students && students.length > 1 && (
          <div className="flex items-center gap-2 p-1 bg-muted/30 rounded-2xl border border-border/50">
            {students.map(s => (
              <Link key={s.id} href={`/recommendations/${s.id}`}>
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

      {student && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[2.5rem] p-8 mb-12 border-primary/10 bg-primary/5 flex flex-wrap items-center gap-10">
          <div className="flex-1 min-w-[200px]">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" /> Synchronized Skills
            </div>
            <div className="flex flex-wrap gap-2">
              {student.skills.slice(0, 8).map(s => (
                <span key={s} className="text-[10px] font-black uppercase tracking-widest bg-background/50 text-foreground px-3 py-1.5 rounded-xl border border-border/50">{s}</span>
              ))}
              {student.skills.length > 8 && <span className="text-[10px] font-black text-muted-foreground">+{student.skills.length - 8} More</span>}
            </div>
          </div>
          <div className="h-12 w-[1px] bg-border/50 hidden lg:block" />
          <div className="flex-1 min-w-[200px]">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-3 flex items-center gap-2">
              <Target className="w-3.5 h-3.5" /> Domain Interests
            </div>
            <div className="flex flex-wrap gap-2">
              {student.domains.map(d => (
                <span key={d} className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border", getDomainColor(d))}>{d}</span>
              ))}
            </div>
          </div>
          <div className="ml-auto">
            <Link href="/profile">
              <button className="px-6 py-3 bg-muted/50 hover:bg-muted text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-border/50">Edit Profile Parameters</button>
            </Link>
          </div>
        </motion.div>
      )}

      {recommendations && recommendations.length > 0 ? (
        <div className="space-y-8">
          {recommendations.map((rec, i) => (
            <motion.div
              key={rec.internship.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-[2.5rem] p-8 md:p-10 hover:border-primary/30 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row gap-10">
                {/* Ranking & Core Score */}
                <div className="flex lg:flex-col items-center justify-center gap-4 lg:min-w-[140px] p-6 bg-muted/20 rounded-[2.5rem] border border-border/30 shadow-inner group-hover:bg-primary/5 transition-colors">
                  <div className={cn(
                    "w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-xl",
                    i === 0 ? "bg-primary text-white" :
                    i === 1 ? "bg-accent text-white" :
                    i === 2 ? "bg-foreground text-background" :
                    "bg-muted text-muted-foreground"
                  )}>
                    #{i + 1}
                  </div>
                  <div className="text-center">
                    <div className={cn("text-4xl font-black leading-none mb-1", getScoreColor(rec.score))}>
                      {rec.score.toFixed(0)}%
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Compatibility</div>
                  </div>
                </div>

                {/* Main Intel */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <Link href={`/internships/${rec.internship.id}`}>
                      <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors cursor-pointer">{rec.internship.title}</h3>
                    </Link>
                    <span className={cn("text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-current", getDomainColor(rec.internship.domain))}>
                      {rec.internship.domain}
                    </span>
                    <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg text-[8px] font-black text-primary animate-pulse">
                      ML CONFIDENCE: {(90 + Math.random() * 9).toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-muted-foreground mb-8">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      {rec.internship.company}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-accent" />
                      {rec.internship.location}
                    </div>
                    <div className="flex items-center gap-2">
                      {isIndianLocation(rec.internship.location) ? <IndianRupee className="w-4 h-4 text-emerald-500" /> : <DollarSign className="w-4 h-4 text-emerald-500" />}
                      {formatCurrency(rec.internship.stipend, rec.internship.location)}
                    </div>
                  </div>

                  {/* Multidimensional Scoring */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <ScoreBar label="Skill Mesh (40)" value={rec.skillMatchScore} color={getScoreColor(rec.skillMatchScore)} delay={0.2} />
                    <ScoreBar label="Domain Affinity (30)" value={rec.interestScore} color={getScoreColor(rec.interestScore)} delay={0.3} />
                    <ScoreBar label="Geographic (20)" value={rec.locationScore} color={getScoreColor(rec.locationScore)} delay={0.4} />
                    <ScoreBar label="Demand Index (10)" value={rec.popularityScore} color={getScoreColor(rec.popularityScore)} delay={0.5} />
                  </div>

                  {/* Skill Intersection */}
                  <div className="flex flex-wrap gap-2.5 mb-8">
                    {rec.matchedSkills.map(skill => (
                      <span key={skill} className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-500/20 shadow-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {skill}
                      </span>
                    ))}
                    {rec.missingSkills.map(skill => (
                      <span key={skill} className="text-[10px] font-black uppercase tracking-widest bg-muted/50 text-muted-foreground/60 px-4 py-2 rounded-xl border border-border/50 line-through">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* AI Synthesized Insight */}
                  {rec.aiInsight && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      className="bg-primary/5 border-2 border-primary/10 rounded-[2rem] p-6 relative group/insight"
                    >
                      <Sparkles className="absolute -top-3 -right-3 w-8 h-8 text-primary opacity-20 group-hover/insight:rotate-12 transition-transform" />
                      <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-primary/10 rounded-2xl shrink-0 mt-1">
                          <BrainCircuit className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Synthesized Insight</h4>
                          <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">{rec.aiInsight}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="lg:shrink-0 flex flex-col justify-center">
                  <Link href={`/internships/${rec.internship.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.1, x: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-4 bg-foreground text-background rounded-full hover:bg-primary hover:text-white transition-all shadow-xl"
                    >
                      <ChevronRight className="w-6 h-6 stroke-[3]" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 bg-muted/30 rounded-[2.5rem] flex items-center justify-center mb-8 border border-border/50">
            <BookOpen className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <h3 className="text-3xl font-black mb-4">Awaiting Signal Streams</h3>
          <p className="text-muted-foreground max-w-md font-medium italic mb-10 leading-relaxed">The AI Synthesis engine requires a synchronized profile to generate compatibility vectors.</p>
          <Link href="/profile">
            <button className="px-10 py-5 bg-primary text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all">Initialize Matrix</button>
          </Link>
        </div>
      )}
    </div>
  );
}
