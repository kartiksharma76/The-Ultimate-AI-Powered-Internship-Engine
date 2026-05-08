import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  useListInternships,
  useCreateInternship,
  useUpdateInternship,
  useDeleteInternship,
  useListStudents,
} from "@workspace/api-client-react";
import type { Internship } from "@workspace/api-client-react";
import { getDomainColor, formatDate, cn, formatCurrency, isIndianLocation } from "@/lib/utils";
import { Plus, Edit3, Trash2, X, Check, Search, Filter, ShieldCheck, Briefcase, MapPin, Calendar, IndianRupee, DollarSign, ExternalLink, Lock } from "lucide-react";

const DOMAINS = ["Web Development", "AI/ML", "Data Science", "Mobile Development", "Cloud/DevOps", "Cybersecurity", "Blockchain", "Game Development"];

interface FormValues {
  title: string;
  company: string;
  domain: string;
  location: string;
  description: string;
  duration: string;
  stipend: string;
  applicationDeadline: string;
  popularity: number;
  requiredSkillsRaw: string;
}

function InternshipForm({ existing, onDone }: { existing?: Internship; onDone: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      title: existing?.title ?? "",
      company: existing?.company ?? "",
      domain: existing?.domain ?? "Web Development",
      location: existing?.location ?? "",
      description: existing?.description ?? "",
      duration: existing?.duration ?? "3 months",
      stipend: existing?.stipend ?? "",
      applicationDeadline: existing?.applicationDeadline ?? "",
      popularity: existing?.popularity ?? 50,
      requiredSkillsRaw: existing?.requiredSkills.join(", ") ?? "",
    }
  });

  const { mutate: create, isPending: creating } = useCreateInternship();
  const { mutate: update, isPending: updating } = useUpdateInternship();
  const isPending = creating || updating;

  const { refetch } = useListInternships({}, { query: { queryKey: ["internships", {}] } });

  function onSubmit(data: FormValues) {
    const payload = {
      ...data,
      requiredSkills: data.requiredSkillsRaw.split(",").map(s => s.trim()).filter(Boolean),
      popularity: Number(data.popularity),
    };

    if (existing) {
      update({ id: existing.id, data: payload }, {
        onSuccess: () => { toast.success("Opportunity synchronized!"); refetch(); onDone(); },
        onError: () => toast.error("Synchronization failed")
      });
    } else {
      create({ data: payload }, {
        onSuccess: () => { toast.success("New stream initialized!"); refetch(); onDone(); },
        onError: () => toast.error("Stream initialization failed")
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Position Identifier *</label>
          <input {...register("title", { required: true })} className="w-full bg-muted/30 border-2 border-border/50 rounded-2xl px-5 py-3.5 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="e.g. Lead Neural Architect" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Corporate Entity *</label>
          <input {...register("company", { required: true })} className="w-full bg-muted/30 border-2 border-border/50 rounded-2xl px-5 py-3.5 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="e.g. NVIDIA" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Technological Domain *</label>
          <select {...register("domain")} className="w-full bg-muted/30 border-2 border-border/50 rounded-2xl px-5 py-3.5 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all appearance-none cursor-pointer">
            {DOMAINS.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Geographic Coordinates *</label>
          <input {...register("location", { required: true })} className="w-full bg-muted/30 border-2 border-border/50 rounded-2xl px-5 py-3.5 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="e.g. Remote / Silicon Valley" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Resource Allocation (Stipend) *</label>
          <input {...register("stipend", { required: true })} className="w-full bg-muted/30 border-2 border-border/50 rounded-2xl px-5 py-3.5 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="e.g. ₹25,000 / Month" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Temporal Duration *</label>
          <input {...register("duration", { required: true })} className="w-full bg-muted/30 border-2 border-border/50 rounded-2xl px-5 py-3.5 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="e.g. 6 Months" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Synchronization Deadline *</label>
          <input {...register("applicationDeadline", { required: true })} type="date" className="w-full bg-muted/30 border-2 border-border/50 rounded-2xl px-5 py-3.5 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Interest Magnitude (0-100)</label>
          <input {...register("popularity")} type="number" min={0} max={100} className="w-full bg-muted/30 border-2 border-border/50 rounded-2xl px-5 py-3.5 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Technological Requirements (CSV) *</label>
          <input {...register("requiredSkillsRaw", { required: true })} className="w-full bg-muted/30 border-2 border-border/50 rounded-2xl px-5 py-3.5 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="e.g. Python, CUDA, PyTorch, C++" />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mission Description *</label>
          <textarea {...register("description", { required: true })} rows={4} className="w-full bg-muted/30 border-2 border-border/50 rounded-2xl px-5 py-3.5 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none italic" placeholder="Outline the strategic objectives for this role..." />
        </div>
      </div>
      <div className="flex gap-4 justify-end pt-6">
        <button type="button" onClick={onDone} className="px-8 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl border-2 border-border hover:bg-muted transition-all">Cancel</button>
        <button type="submit" disabled={isPending} className="px-8 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl bg-foreground text-background hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-50">
          {isPending ? "Synchronizing..." : existing ? "Apply Changes" : "Initialize Stream"}
        </button>
      </div>
    </form>
  );
}

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { data: internships, isLoading, refetch } = useListInternships({}, { query: { queryKey: ["internships", {}] } });
  const { data: students } = useListStudents();
  const { mutate: deleteInternship } = useDeleteInternship();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"opportunities" | "candidates">("opportunities");
  const [rankedCandidates, setRankedCandidates] = useState<any[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  useEffect(() => {
    if (activeTab === "candidates") {
      setLoadingCandidates(true);
      fetch("http://localhost:8080/api/ranking/internship/1")
        .then(res => res.json())
        .then(data => {
          setRankedCandidates(data);
          setLoadingCandidates(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingCandidates(false);
        });
    }
  }, [activeTab]);

  useEffect(() => {
    const isAuthor = user?.email === "kartiksharma768976@gmail.com";
    if (!authLoading && user?.subscriptionStatus !== "recruiter" && !isAuthor) {
      toast.error("Access Denied: Recruiter Plan Required");
      setLocation("/pricing");
    }
  }, [user, authLoading, setLocation]);

  if (authLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  
  const isAuthor = user?.email === "kartiksharma768976@gmail.com";
  if (user?.subscriptionStatus !== "recruiter" && !isAuthor) return null;

  function handleDelete(id: number) {
    deleteInternship({ id }, {
      onSuccess: () => { 
        toast.success("Stream terminated"); 
        refetch().then(() => {
          // Force a small state update to trigger re-render if needed
          setConfirmDelete(null);
          window.location.reload(); // Ensuring full sync as per user request
        });
      },
      onError: () => toast.error("Termination failed")
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative">
      <div className="fixed inset-0 pointer-events-none opacity-[0.2] mesh-gradient -z-10" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Infrastructure Management</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Central <span className="text-gradient">Control</span></h1>
          <p className="text-muted-foreground font-medium italic">
            Synchronizing <span className="text-foreground font-black">{internships?.length ?? 0}</span> data streams & <span className="text-foreground font-black">{students?.length ?? 0}</span> candidate profiles
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex bg-muted/50 p-1.5 rounded-2xl border border-border/50">
            <button 
              onClick={() => setActiveTab("opportunities")}
              className={cn("px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === "opportunities" ? "bg-background shadow-md" : "text-muted-foreground hover:text-foreground")}
            >
              Opportunities
            </button>
            <button 
              onClick={() => setActiveTab("candidates")}
              className={cn("px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === "candidates" ? "bg-background shadow-md" : "text-muted-foreground hover:text-foreground")}
            >
              Candidates
            </button>
          </div>
          {activeTab === "opportunities" && (
            <button
              onClick={() => { setShowForm(true); setEditingId(null); }}
              className="px-8 py-4 bg-foreground text-background rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all flex items-center gap-3 shadow-2xl"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Initialize Stream
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl"
          >
            <motion.div className="glass-card w-full max-w-4xl p-10 md:p-14 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)] max-h-[90vh] overflow-y-auto custom-scrollbar relative">
              <button onClick={() => setShowForm(false)} className="absolute top-8 right-8 p-3 bg-muted hover:bg-muted/80 rounded-2xl transition-all">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-3xl font-black tracking-tight mb-10">Initialize New Opportunity Stream</h2>
              <InternshipForm onDone={() => setShowForm(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading || loadingCandidates ? (
        <div className="space-y-6">
          {[...Array(6)].map((_, i) => <div key={i} className="glass-card rounded-[2rem] p-8 animate-pulse h-24" />)}
        </div>
      ) : activeTab === "opportunities" ? (
        <div className="glass-card rounded-[3rem] overflow-hidden border-border/30">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/20 border-b border-border/50">
                  <th className="text-left px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Opportunity Matrix</th>
                  <th className="text-left px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground hidden md:table-cell">Geographic Target</th>
                  <th className="text-left px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground hidden lg:table-cell">Temporal Limit</th>
                  <th className="text-left px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Resource Value</th>
                  <th className="px-8 py-6" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {internships?.map((internship, i) => (
                  <motion.tr
                    key={internship.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group hover:bg-muted/10 transition-all duration-300"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center font-black text-primary text-xl border border-primary/20">
                          {internship.company[0]}
                        </div>
                        <div>
                          <div className="font-black text-lg tracking-tight group-hover:text-primary transition-colors">{internship.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold text-muted-foreground">{internship.company}</span>
                            <div className="w-1 h-1 rounded-full bg-muted" />
                            <span className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-current", getDomainColor(internship.domain))}>
                              {internship.domain}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 hidden md:table-cell">
                      <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {internship.location}
                      </div>
                    </td>
                    <td className="px-8 py-6 hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground italic">
                        <Calendar className="w-4 h-4" />
                        {formatDate(internship.applicationDeadline)}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-1.5 text-emerald-500 font-black tracking-tight">
                        {isIndianLocation(internship.location) ? <IndianRupee className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                        {formatCurrency(internship.stipend, internship.location)}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3 justify-end">
                        <button
                          onClick={() => setEditingId(internship.id)}
                          className="p-3 bg-muted hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm"
                          title="Edit Parameters"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        
                        <AnimatePresence>
                          {editingId === internship.id && (
                            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl">
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-card w-full max-w-4xl p-10 md:p-14 rounded-[3rem] shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar"
                              >
                                <button onClick={() => setEditingId(null)} className="absolute top-8 right-8 p-3 bg-muted hover:bg-muted/80 rounded-2xl transition-all">
                                  <X className="w-5 h-5" />
                                </button>
                                <h2 className="text-3xl font-black tracking-tight mb-10">Synchronize Stream Parameters</h2>
                                <InternshipForm existing={internship} onDone={() => { setEditingId(null); refetch(); }} />
                              </motion.div>
                            </div>
                          )}
                        </AnimatePresence>

                        {confirmDelete === internship.id ? (
                          <div className="flex items-center gap-2 bg-destructive/10 p-1.5 rounded-xl border border-destructive/20 animate-in zoom-in-95 duration-200">
                            <button onClick={() => handleDelete(internship.id)} className="p-2 bg-destructive text-white rounded-lg hover:scale-110 transition-transform">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => setConfirmDelete(null)} className="p-2 bg-muted text-muted-foreground rounded-lg hover:scale-110 transition-transform">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(internship.id)}
                            className="p-3 bg-muted hover:bg-destructive hover:text-white rounded-xl transition-all shadow-sm"
                            title="Terminate Stream"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
           <div className="flex justify-between items-center bg-indigo-600/10 p-8 rounded-[2.5rem] border border-indigo-600/20">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black">AI Talent Ranking</h3>
                  <p className="text-muted-foreground font-medium">Smart candidate filtering powered by Neural Analysis.</p>
                </div>
              </div>
              <button 
                onClick={() => {
                   toast.promise(
                    fetch("http://localhost:8080/api/ranking/auto-shortlist", { method: "POST" }),
                    {
                      loading: 'Triggering AI auto-shortlist...',
                      success: 'Top candidates moved to shortlisting stage!',
                      error: 'Auto-shortlist failed',
                    }
                  );
                }}
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-600/20"
              >
                Trigger Auto-Shortlist
              </button>
           </div>

           <div className="glass-card rounded-[3rem] overflow-hidden border-border/30">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/20 border-b border-border/50">
                    <th className="text-left px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Rank</th>
                    <th className="text-left px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Candidate Profile</th>
                    <th className="text-center px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">AI Match Score</th>
                    <th className="text-center px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">GitHub/Tech</th>
                    <th className="text-center px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fraud Risk</th>
                    <th className="px-8 py-6" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {rankedCandidates.map((entry, i) => (
                    <motion.tr 
                      key={entry.application.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group hover:bg-muted/10 transition-all"
                    >
                      <td className="px-8 py-6 font-black text-xl text-muted-foreground/30 tabular-nums">
                        {(i + 1).toString().padStart(2, '0')}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full border-2 border-indigo-600/20 p-0.5">
                            {entry.student.avatarUrl ? (
                              <img src={entry.student.avatarUrl} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <div className="w-full h-full rounded-full bg-muted flex items-center justify-center font-bold text-xs">
                                {entry.student.name[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-black group-hover:text-indigo-600 transition-colors">{entry.student.name}</div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{entry.application.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className={cn(
                          "inline-block px-4 py-1.5 rounded-full font-black text-sm",
                          entry.finalScore > 80 ? "bg-emerald-500/10 text-emerald-600" : 
                          entry.finalScore > 60 ? "bg-amber-500/10 text-amber-600" : "bg-red-500/10 text-red-600"
                        )}>
                          {entry.finalScore?.toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex flex-col gap-1 items-center">
                          <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Score: {entry.githubScores?.codingActivityScore || 0}</div>
                          <div className="flex gap-1">
                            {entry.githubScores?.topLanguages?.slice(0, 3).map((lang: string) => (
                              <span key={lang} className="text-[8px] px-1.5 py-0.5 bg-muted rounded border">{lang}</span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                          entry.fraudRisk === "High" ? "bg-red-500/10 text-red-600 border-red-500/20" : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        )}>
                          {entry.fraudRisk === "High" ? <AlertTriangle className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                          {entry.fraudRisk}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-3 bg-muted hover:bg-foreground hover:text-background rounded-xl transition-all shadow-sm">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
           </div>
        </div>
      )}
    </div>
  );
}
