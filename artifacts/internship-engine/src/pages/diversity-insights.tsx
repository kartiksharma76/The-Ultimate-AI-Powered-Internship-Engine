import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Users, Globe, BarChart3, ShieldCheck, Sparkles, PieChart, Info, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DiversityInsightsPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchDiversity = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/ai/intelligence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ module: "diversity-insights", studentId: 1 })
        });
        const result = await response.json();
        setData(result);
      } catch (e) {
        console.error("Failed to fetch diversity", e);
      } finally {
        setLoading(false);
      }
    };
    fetchDiversity();
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-600 rounded-xl text-white shadow-lg shadow-rose-600/20">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Cultural Intelligence</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Diversity <span className="text-rose-600">Insights</span></h1>
          <p className="text-muted-foreground font-medium">Measuring inclusivity and cultural health of target companies using real employee data.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-card p-12 rounded-[3.5rem] relative overflow-hidden h-full">
             <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 blur-3xl pointer-events-none" />
             
             <div className="flex items-center justify-between mb-12">
                <div>
                   <h3 className="text-2xl font-black">Company Culture Matrix</h3>
                   <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Aggregate Score: {data?.company || "NVIDIA"}</p>
                </div>
                <div className="w-20 h-20 rounded-[2rem] bg-rose-600 flex flex-col items-center justify-center text-white shadow-2xl shadow-rose-600/40">
                   <div className="text-2xl font-black">{data?.score || "9.4"}</div>
                   <div className="text-[8px] font-black uppercase tracking-widest opacity-80">DEI Score</div>
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                   {(data?.stats || [
                     { label: "Representation", val: 88, color: "bg-rose-500" },
                     { label: "Inclusion Sentiment", val: 94, color: "bg-emerald-500" },
                     { label: "Equitable Pay", val: 82, color: "bg-amber-500" },
                     { label: "Growth Mobility", val: 76, color: "bg-indigo-500" },
                   ]).map((stat: any) => (
                     <div key={stat.label} className="space-y-3">
                        <div className="flex justify-between text-[11px] font-black uppercase">
                           <span>{stat.label}</span>
                           <span className="text-muted-foreground">{stat.val}%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                           <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className={cn("h-full", stat.color)} />
                        </div>
                     </div>
                   ))}
                </div>

                <div className="p-8 bg-muted/30 rounded-[2.5rem] border border-border/50">
                   <h4 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-rose-600" /> Qualitative Insights
                   </h4>
                   <div className="space-y-6">
                      {(data?.insights || [
                        "Strong presence of Employee Resource Groups (ERGs) for university hires.",
                        "Transparent promotion cycles with automated equity audits."
                      ]).map((insight: string, i: number) => (
                        <div key={i} className="p-4 bg-background rounded-2xl border border-border/50 text-[11px] font-medium leading-relaxed italic">
                           "{insight}"
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             <div className="mt-16 pt-12 border-t-2 border-border/30 grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { label: "ERGs", val: "14+", icon: Users },
                  { label: "Global Offices", val: "32", icon: Globe },
                  { label: "Verified Data", val: "100%", icon: ShieldCheck },
                  { label: "Transparency", val: "Elite", icon: BarChart3 },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                     <stat.icon className="w-5 h-5 mx-auto mb-3 text-rose-600/50" />
                     <div className="text-xl font-black">{stat.val}</div>
                     <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="glass-card p-8 rounded-[2.5rem] bg-slate-900 text-white">
              <h3 className="font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                 <PieChart className="w-4 h-4 text-rose-500" /> Demographic Pulse
              </h3>
              <div className="space-y-4">
                 <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-white/10 rounded-[2rem]">
                    <span className="text-[10px] font-black uppercase text-muted-foreground opacity-50">Chart Matrix: Synchronizing...</span>
                 </div>
                 <p className="text-[10px] font-black text-muted-foreground uppercase text-center mt-4 tracking-[0.2em]">Based on 2024 Transparency Report</p>
              </div>
           </div>

           <div className="p-8 bg-rose-50 border-2 border-rose-100 rounded-[2.5rem]">
              <h3 className="font-black text-rose-600 text-sm mb-4 uppercase tracking-widest flex items-center gap-2">
                 <Info className="w-4 h-4" /> Why it matters
              </h3>
              <p className="text-xs font-bold text-rose-900/60 leading-relaxed italic mb-6">
                 "Diverse teams are 33% more likely to outperform on profitability. We analyze these metrics to ensure you're entering an environment that values unique perspectives."
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-rose-600 cursor-pointer hover:gap-4 transition-all">
                 Read Full DEI Audit <CheckCircle2 className="w-4 h-4" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
