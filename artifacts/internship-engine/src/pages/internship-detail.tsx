import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { useGetInternship } from "@workspace/api-client-react";
import { getDomainColor, formatDate, cn, formatCurrency, isIndianLocation } from "@/lib/utils";
import { useActiveStudent } from "@/components/Layout";
import { ArrowLeft, MapPin, Calendar, Users, Zap, Award, Briefcase, IndianRupee, DollarSign, Sparkles, Clock, Globe } from "lucide-react";

export default function InternshipDetailPage() {
  const [, params] = useRoute("/internships/:id");
  const id = parseInt(params?.id ?? "0");
  const studentId = useActiveStudent();
  const { data: internship, isLoading } = useGetInternship(id, { query: { enabled: !!id, queryKey: ["internship", id] } });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-muted rounded-[2rem] w-2/3" />
          <div className="h-6 bg-muted rounded-xl w-1/3" />
          <div className="h-96 bg-muted rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 bg-muted/30 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-border/50">
          <Briefcase className="w-10 h-10 text-muted-foreground/30" />
        </div>
        <h2 className="text-3xl font-black mb-4">Opportunity Disconnected</h2>
        <p className="text-muted-foreground font-medium mb-10 italic">The selected internship stream is no longer available in the ecosystem.</p>
        <Link href="/internships">
          <button className="px-8 py-4 bg-primary text-white rounded-[1.25rem] font-black uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 transition-all">Back to Grid</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 relative">
      <div className="fixed inset-0 pointer-events-none opacity-[0.2] mesh-gradient -z-10" />
      
      <Link href="/internships">
        <button className="group mb-12 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all">
          <div className="p-2 rounded-xl bg-muted/30 border border-border/50 group-hover:-translate-x-1 transition-transform">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Return to Neural Grid
        </button>
      </Link>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="glass-card rounded-[3rem] p-10 md:p-14 mb-10 overflow-hidden relative group">
          <div className="absolute top-0 right-0 px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-bl-[2.5rem] shadow-2xl z-10">
            Open Opportunity
          </div>

          <div className="flex flex-col md:flex-row md:items-start gap-10 mb-12 relative z-10">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-[2rem] flex items-center justify-center shrink-0 shadow-2xl shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
              <span className="text-4xl font-black text-white">{internship.company[0]}</span>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 mb-3">
                <h1 className="text-4xl font-black tracking-tight leading-tight">{internship.title}</h1>
                <span className={cn("text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-current shadow-sm", getDomainColor(internship.domain))}>
                  {internship.domain}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  {internship.company}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  {internship.location}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: "Stipend", value: formatCurrency(internship.stipend, internship.location), icon: isIndianLocation(internship.location) ? IndianRupee : DollarSign, color: "text-emerald-500" },
              { label: "Duration", value: internship.duration, icon: Clock, color: "text-primary" },
              { label: "Deadline", value: formatDate(internship.applicationDeadline), icon: Calendar, color: "text-accent" },
              { label: "Applicants", value: `${internship.popularity} interested`, icon: Users, color: "text-violet-500" },
            ].map((stat, i) => (
              <div key={i} className="p-5 bg-muted/20 rounded-[2rem] border border-border/30 hover:bg-muted/40 transition-colors group/stat">
                <stat.icon className={cn("w-5 h-5 mb-3 group-hover/stat:scale-110 transition-transform", stat.color)} />
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</div>
                <div className="text-xs font-black">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="space-y-10 mb-12">
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-6 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Mission Parameters
              </h2>
              <p className="text-sm font-medium text-muted-foreground leading-[1.8] italic">{internship.description}</p>
            </div>

            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-6 flex items-center gap-2">
                <Award className="w-4 h-4 text-accent" />
                Required Competencies
              </h2>
              <div className="flex flex-wrap gap-3">
                {internship.requiredSkills.map(skill => (
                  <span key={skill} className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-5 py-2.5 rounded-2xl border border-primary/20 hover:bg-primary/20 transition-all cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 pt-10 border-t border-border/50">
            <Link href={`/internships?apply=${internship.id}`} className="flex-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-5 bg-foreground text-background rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:shadow-primary/40 transition-all flex items-center justify-center gap-3"
              >
                Initialize Application <ChevronRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link href={`/recommendations/${studentId}`} className="flex-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-5 border-2 border-primary/30 bg-primary/10 text-primary rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-primary/20 transition-all flex items-center justify-center gap-3"
              >
                <Sparkles className="w-4 h-4" /> Analyze Match Profile
              </motion.button>
            </Link>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-[3rem] p-10 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.1] mesh-gradient" />
          <h3 className="text-2xl font-black mb-4 tracking-tight">Accelerate Your Trajectory</h3>
          <p className="text-sm font-medium text-muted-foreground mb-10 max-w-xl mx-auto italic leading-relaxed">Our AI Synthesizer analyzes your technological DNA against thousands of parameters to predict your success in this role.</p>
          <Link href={`/recommendations/${studentId}`}>
            <button className="px-10 py-5 bg-primary text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-[0_20px_50px_rgba(124,58,237,0.3)] hover:scale-110 transition-all active:scale-95">
              Launch AI Analysis Engine
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ChevronRight(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
    </svg>
  );
}
