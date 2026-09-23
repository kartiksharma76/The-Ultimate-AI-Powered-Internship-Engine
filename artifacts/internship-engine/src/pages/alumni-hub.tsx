import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Users, Search, MessageSquare, Briefcase, Award, Star, Zap, ChevronRight, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

const alumni = [
  { name: "Sarah Chen", role: "SDE @ Google", company: "Google", city: "Mountain View", mentor: true },
  { name: "James Wilson", role: "AI Researcher @ NVIDIA", company: "NVIDIA", city: "Santa Clara", mentor: false },
  { name: "Priya Rao", role: "Product Manager @ Meta", company: "Meta", city: "New York", mentor: true },
  { name: "Lucas Müller", role: "Backend Lead @ Stripe", company: "Stripe", city: "Berlin", mentor: true },
];

export default function AlumniHubPage() {
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>(alumni);

  const handleSearch = async () => {
    setSearching(true);
    try {
      const response = await fetch("/api/ai/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "talent-scout", studentId: 1 }) // Reuse talent scout logic for alumni
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setResults(data.map((d: any) => ({
          name: d.recruiter,
          role: d.role,
          company: d.company,
          city: "Remote",
          mentor: true
        })));
      }
    } catch (e) {
      console.error("Alumni search failed", e);
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
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Global Network</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Alumni <span className="text-primary italic">Hub</span></h1>
          <p className="text-muted-foreground font-medium">Connect with former interns who are now leaders in the tech ecosystem.</p>
        </div>
        <div className="flex gap-4">
           <button className="px-8 py-3 bg-muted/50 border border-border/50 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-muted transition-all">List My Profile</button>
           <button className="px-8 py-3 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">Request Intro</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-card p-10 rounded-[3.5rem] min-h-[600px]">
            <div className="flex gap-4 mb-12">
              <div className="flex-1 bg-muted/30 border border-border/50 rounded-2xl flex items-center px-6 gap-4 focus-within:border-primary/50 transition-all">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input type="text" placeholder="Search by company, role, or city..." className="bg-transparent border-none outline-none flex-1 font-bold text-sm" />
              </div>
              <button 
                onClick={handleSearch}
                className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:scale-105 transition-all shadow-xl"
              >
                <Zap className="w-6 h-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {results.map((alumnus, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 bg-muted/20 border border-border/50 rounded-[3rem] group hover:border-primary/40 transition-all flex flex-col justify-between"
                >
                   <div className="flex items-center gap-5 mb-8">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-background border-2 border-primary/20 overflow-hidden group-hover:scale-110 transition-transform p-0.5">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${alumnus.name}`} alt={alumnus.name} />
                      </div>
                      <div>
                         <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-black text-base">{alumnus.name}</h4>
                            {alumnus.mentor && <Award className="w-4 h-4 text-amber-500 fill-current" />}
                         </div>
                         <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{alumnus.role}</p>
                      </div>
                   </div>

                   <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                         <Briefcase className="w-4 h-4 opacity-40" /> {alumnus.company}
                      </div>
                      <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                         <Globe className="w-4 h-4 opacity-40" /> {alumnus.city}
                      </div>
                   </div>

                   <div className="flex gap-3 pt-6 border-t border-border/30">
                      <button className="flex-1 py-3 bg-foreground text-background rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Message</button>
                      <button className="w-12 h-11 bg-muted/50 border border-border/50 rounded-xl flex items-center justify-center hover:bg-primary/10 transition-all">
                        <Share2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                   </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="glass-card p-10 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden">
              <h3 className="font-black text-sm uppercase tracking-widest mb-10">Network Density</h3>
              <div className="grid grid-cols-2 gap-8">
                 {[
                   { label: "MAANG+", val: "4.2k" },
                   { label: "Unicorns", val: "1.8k" },
                   { label: "Venture+", val: "950" },
                   { label: "Mentors", val: "320" },
                 ].map((stat, i) => (
                   <div key={i} className="text-center group cursor-default">
                      <div className="text-3xl font-black mb-1 group-hover:scale-110 transition-transform">{stat.val}</div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{stat.label}</div>
                   </div>
                 ))}
              </div>
              <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-2xl">
                 <div className="flex items-center gap-3 mb-3">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Global Ranking</span>
                 </div>
                 <p className="text-xs font-bold opacity-60 leading-relaxed italic">"Our alumni network has secured over $140M in aggregate salary value in 2024 alone."</p>
              </div>
           </div>

           <div className="p-10 bg-primary/5 border border-primary/20 rounded-[3rem]">
              <div className="flex items-center gap-3 mb-6">
                 <MessageSquare className="w-6 h-6 text-primary" />
                 <h3 className="font-black text-sm uppercase tracking-widest">Recent Activity</h3>
              </div>
              <div className="space-y-6">
                 {[
                   "Sarah Chen shared 'Interview Guide for Google L3'",
                   "Lucas Müller endorsed 14 students for Stripe",
                   "Priya Rao is hosting a PM AMA this Friday"
                 ].map((act, i) => (
                   <div key={i} className="flex gap-4 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                      <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">{act}</p>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-4 bg-primary/10 text-primary border border-primary/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Join The Circle</button>
           </div>
        </div>
      </div>
    </div>
  );
}
