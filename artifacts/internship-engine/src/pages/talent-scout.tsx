import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, Mail, Building2, Zap, Target, Star, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const scouts = [
  { company: "Google", recruiter: "Alex Rivera", role: "University Relations", active: true },
  { company: "Meta", recruiter: "Sarah Jenkins", role: "SDE Recruiting", active: true },
  { company: "NVIDIA", recruiter: "Michael Chen", role: "AI Talent Lead", active: false },
  { company: "Stripe", recruiter: "Elena Rossi", role: "Product Hiring", active: true },
];

export default function TalentScoutPage() {
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    setSearching(true);
    setResults([]);
    try {
      const response = await fetch("/api/ai/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "talent-scout", studentId: 1 })
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setResults(data);
      } else {
        setResults(scouts); // Fallback
      }
    } catch (e) {
      console.error("AI Search failed", e);
      setResults(scouts);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary rounded-xl text-white shadow-lg shadow-primary/20">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Networking Intelligence</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">AI Talent <span className="text-primary">Scout</span></h1>
          <p className="text-muted-foreground font-medium">Bypass the ATS. Connect directly with the humans behind the hiring.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-card p-10 rounded-[3rem] min-h-[500px]">
            <div className="flex gap-4 mb-10">
              <div className="flex-1 bg-muted/30 border border-border/50 rounded-2xl flex items-center px-6 gap-4">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input type="text" placeholder="Search by company or role..." className="bg-transparent border-none outline-none flex-1 font-bold text-sm" />
              </div>
              <button 
                onClick={handleSearch}
                className="px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl"
              >
                Execute Scan
              </button>
            </div>

            {searching ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Zap className="w-10 h-10 text-primary animate-pulse" />
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Scanning LinkedIn & Internal Databases...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {results.map((scout, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 bg-muted/20 border border-border/50 rounded-[2.5rem] group hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-background rounded-2xl border flex items-center justify-center font-black text-primary group-hover:scale-110 transition-transform">
                        {scout.company[0]}
                      </div>
                      <div>
                        <h4 className="font-black text-sm">{scout.recruiter}</h4>
                        <p className="text-[10px] font-bold text-muted-foreground">{scout.role} @ {scout.company}</p>
                      </div>
                      {scout.active && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button className="flex-1 py-3 bg-foreground text-background rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Request Intro</button>
                      <button className="w-12 h-11 bg-muted border border-border/50 rounded-xl flex items-center justify-center hover:bg-primary/10 transition-all">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/30">
                <Building2 className="w-20 h-20 mb-4" />
                <p className="text-xs font-black uppercase tracking-widest italic">Awaiting Search Query</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] bg-slate-900 text-white">
            <h3 className="font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" /> Outreach Efficacy
            </h3>
            <div className="space-y-6">
              {[
                { label: "Direct Reply Rate", val: 34 },
                { label: "Warm Leads", val: 12 },
                { label: "Search Ranking", val: 88 },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span className="text-muted-foreground/60">{stat.label}</span>
                    <span>{stat.val}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className="h-full bg-primary" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-primary/5 border border-primary/20 rounded-[2.5rem]">
             <h3 className="font-black text-sm mb-4 uppercase tracking-widest flex items-center gap-2">
               <Star className="w-4 h-4 text-primary" /> Elite Strategy
             </h3>
             <p className="text-[11px] font-medium text-muted-foreground leading-relaxed italic mb-6">
               "Recruiters at Meta respond 3x more often to messages that mention specific open-source contributions in their React ecosystem."
             </p>
             <button className="flex items-center gap-2 text-[10px] font-black uppercase text-primary hover:gap-4 transition-all">
               Get Custom Template <ChevronRight className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
