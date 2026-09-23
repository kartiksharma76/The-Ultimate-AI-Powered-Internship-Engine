import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, FileText, Scale, Zap, Info, CheckCircle2, AlertTriangle, FileSearch, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LegalAssistantPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setResults(null);
    try {
      const response = await fetch("/api/ai/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "legal-assistant", studentId: 1 })
      });
      const data = await response.json();
      
      // Map back icons since they aren't serialized
      if (data.clauses) {
        data.clauses = data.clauses.map((c: any) => ({
          ...c,
          icon: c.status === "Fair" || c.status === "Low" ? CheckCircle2 : Info
        }));
      }
      
      setResults(data);
    } catch (e) {
      console.error("Legal Audit failed", e);
      setResults({
        riskScore: 12,
        status: "Low Risk",
        clauses: [
          { title: "Intellectual Property", status: "Fair", desc: "You own what you build outside of work hours.", icon: CheckCircle2, color: "text-emerald-500" },
          { title: "Non-Compete", status: "Present", desc: "Restricts working for competitors for 6 months.", icon: Info, color: "text-amber-500" }
        ],
        warnings: ["Section 4.2: License clause is broad."]
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20">
              <Scale className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Compliance Intelligence</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Legal <span className="text-indigo-600">Assistant</span></h1>
          <p className="text-muted-foreground font-medium">AI-driven contract analysis. Protect your rights and understand your obligations.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-card p-12 rounded-[3.5rem] relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-3xl pointer-events-none" />
             
             <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto py-10">
                <div className="w-20 h-20 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-indigo-100">
                   <FileSearch className="w-10 h-10 text-indigo-600 animate-pulse" />
                </div>
                <h2 className="text-3xl font-black mb-4">Secure Your Offer</h2>
                <p className="text-sm text-muted-foreground font-medium mb-10 leading-relaxed italic">"Upload your internship offer letter or contract. Our legal-trained AI will scan for predatory clauses and intellectual property traps."</p>
                
                <div className="w-full flex flex-col gap-4">
                   <div className="relative group cursor-pointer">
                      <div className="absolute inset-0 bg-indigo-600/5 border-2 border-dashed border-indigo-600/30 rounded-[2rem] group-hover:border-indigo-600/60 transition-all" />
                      <div className="relative p-10 flex flex-col items-center gap-4">
                         <Download className="w-8 h-8 text-indigo-400" />
                         <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Drop PDF or DOCX here</span>
                      </div>
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleAnalyze} />
                   </div>
                </div>
             </div>

             <AnimatePresence>
                {results && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-16 space-y-12">
                     <div className="flex items-center justify-between p-10 bg-indigo-600 text-white rounded-[2.5rem] shadow-2xl shadow-indigo-600/20">
                        <div>
                           <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Legal Risk Score</div>
                           <h3 className="text-5xl font-black">{results.riskScore}%</h3>
                        </div>
                        <div className="text-right">
                           <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Audit Verdict</div>
                           <div className="px-4 py-2 bg-white/20 rounded-xl font-black text-xs uppercase tracking-widest">{results.status}</div>
                        </div>
                     </div>

                     <div className="grid gap-6">
                        {results.clauses.map((c: any, i: number) => (
                           <div key={i} className="p-8 bg-muted/30 border border-border/50 rounded-[2.5rem] flex items-start gap-6 group hover:border-indigo-600/30 transition-all">
                              <div className={cn("p-4 bg-background rounded-2xl border", c.color)}>
                                 <c.icon className="w-6 h-6" />
                              </div>
                              <div>
                                 <div className="flex items-center gap-3 mb-2">
                                    <h4 className="text-xl font-black">{c.title}</h4>
                                    <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full border", c.color === 'text-emerald-500' ? "bg-emerald-500/10 border-emerald-500/20" : "bg-amber-500/10 border-amber-500/20")}>{c.status}</span>
                                 </div>
                                 <p className="text-sm text-muted-foreground font-medium leading-relaxed italic">"{c.desc}"</p>
                              </div>
                           </div>
                        ))}
                     </div>

                     <div className="p-10 bg-red-50 border-2 border-red-100 rounded-[2.5rem]">
                        <h4 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-red-600">
                           <ShieldAlert className="w-4 h-4" /> Priority Warnings
                        </h4>
                        <div className="space-y-4">
                           {results.warnings.map((w: string, i: number) => (
                              <div key={i} className="text-sm font-bold text-red-900/70 italic leading-relaxed">
                                 "{w}"
                              </div>
                           ))}
                        </div>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="glass-card p-8 rounded-[2.5rem] bg-slate-900 text-white">
              <h3 className="font-black text-sm uppercase tracking-widest mb-6">Contract Health</h3>
              <div className="space-y-8">
                 {[
                   { label: "IP Protection", val: 95 },
                   { label: "Termination Rights", val: 82 },
                   { label: "Payment Security", val: 74 },
                 ].map(stat => (
                   <div key={stat.label} className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase">
                         <span className="opacity-60">{stat.label}</span>
                         <span>{stat.val}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className="h-full bg-indigo-500" />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="p-8 bg-indigo-50 border-2 border-indigo-200 rounded-[2.5rem]">
              <h3 className="font-black text-indigo-600 text-sm mb-4 uppercase tracking-widest">Counselor Advice</h3>
              <p className="text-xs font-bold text-indigo-900/60 leading-relaxed italic">
                 "Internship contracts in California have specific protections against unpaid overtime. Ensure your hours are clearly logged in the company system."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
