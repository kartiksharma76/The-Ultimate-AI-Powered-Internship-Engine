import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Users, MessageSquare, Briefcase, Zap, Globe, Sparkles, UserPlus, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReferralNetworkPage() {
  const [requesting, setRequesting] = useState<number | null>(null);

  const alumni = [
    { id: 1, name: "Arjun Mehta", role: "Software Engineer @ Google", company: "Google", school: "IIT Delhi", availability: "High" },
    { id: 2, name: "Sarah Connor", role: "Product Manager @ Amazon", company: "Amazon", school: "Stanford", availability: "Low" },
    { id: 3, name: "Kevin Zhang", role: "SDE-2 @ Microsoft", company: "Microsoft", school: "CMU", availability: "Medium" },
    { id: 4, name: "Priya Sharma", role: "Frontend Lead @ Uber", company: "Uber", school: "BITS Pilani", availability: "High" },
  ];

  const handleRequest = (id: number) => {
    setRequesting(id);
    setTimeout(() => {
      setRequesting(null);
    }, 2000);
  };

  const handleDraftMessage = async () => {
    try {
      const response = await fetch("/api/ai/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "referral-network", studentId: 1 })
      });
      const data = await response.json();
      alert(data.message || "Message drafted!");
    } catch (e) {
      alert("Error drafting message.");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20">
              <Network className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Alumni Intelligence</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Referral <span className="text-indigo-600">Network</span></h1>
          <p className="text-muted-foreground font-medium">Connect with verified alumni and industry insiders for high-priority referral opportunities.</p>
        </div>
        <div className="flex gap-4">
           <div className="p-4 bg-muted/50 rounded-2xl border text-center px-8">
              <div className="text-2xl font-black">12</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Available Referrals</div>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="grid md:grid-cols-2 gap-6">
            {alumni.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 rounded-[2.5rem] hover:border-indigo-600/30 transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-muted overflow-hidden border-2 border-border/50 group-hover:border-indigo-600/30 transition-colors">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${a.name}`} alt={a.name} />
                  </div>
                  <div className={cn(
                    "px-3 py-1 text-[9px] font-black rounded-full uppercase tracking-widest",
                    a.availability === 'High' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  )}>
                    {a.availability} Availability
                  </div>
                </div>
                <h3 className="text-lg font-black mb-1">{a.name}</h3>
                <p className="text-xs font-bold text-muted-foreground mb-4">{a.role}</p>
                
                <div className="p-4 bg-muted/30 rounded-2xl mb-6 border border-border/50">
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">
                      <Users className="w-3 h-3" /> Shared School
                   </div>
                   <div className="text-xs font-bold">{a.school}</div>
                </div>

                <button 
                  onClick={() => handleRequest(a.id)}
                  disabled={requesting === a.id}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  {requesting === a.id ? (
                    <>
                      <Zap className="w-4 h-4 animate-pulse" />
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Request Referral
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] bg-indigo-600 text-white relative overflow-hidden">
             <Sparkles className="absolute top-4 right-4 w-12 h-12 opacity-10" />
             <h3 className="font-black text-sm uppercase tracking-widest mb-6">Outreach Agent</h3>
             <div className="p-5 bg-white/10 rounded-2xl border border-white/10 mb-6 font-medium text-xs leading-relaxed italic">
               "I've identified that Arjun Mehta is actively referring for Backend roles. I can auto-generate a high-conversion message based on your GitHub history."
             </div>
             <button onClick={handleDraftMessage} className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all hover:scale-[1.02]">Draft AI Message</button>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border-indigo-600/10">
            <h3 className="font-black text-sm uppercase tracking-widest mb-6 text-muted-foreground">Referral Impact</h3>
            <div className="space-y-4">
               <div className="flex flex-col gap-2">
                 <div className="flex justify-between text-[10px] font-black uppercase">
                    <span>Interview Rate (Referral)</span>
                    <span className="text-emerald-500">82%</span>
                 </div>
                 <div className="w-full h-1.5 bg-muted rounded-full">
                    <div className="h-full bg-emerald-500 w-[82%]" />
                 </div>
               </div>
               <div className="flex flex-col gap-2">
                 <div className="flex justify-between text-[10px] font-black uppercase">
                    <span>Interview Rate (Direct)</span>
                    <span className="text-amber-500">12%</span>
                 </div>
                 <div className="w-full h-1.5 bg-muted rounded-full">
                    <div className="h-full bg-amber-500 w-[12%]" />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
