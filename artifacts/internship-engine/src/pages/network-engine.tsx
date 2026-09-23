import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Sparkles, UserPlus, Users, MessageSquare, Target, Zap, Globe, Mail, Linkedin, Send } from "lucide-react";
import { cn } from "@/lib/utils";

import { toast } from "sonner";

export default function NetworkEnginePage() {
  const [activeTab, setActiveTab] = useState<"stakeholders" | "messages">("stakeholders");
  const [selectedStakeholder, setSelectedStakeholder] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState("");

  const stakeholders = [
    { id: 1, name: "Jeffery Chen", role: "Engineering Manager @ Meta", connection: "2nd", common: 12, match: 98, interest: "System Architecture" },
    { id: 2, name: "Sarah Williams", role: "Sr. Recruiter @ Stripe", connection: "3rd", common: 4, match: 85, interest: "Fintech Scaling" },
    { id: 3, name: "Michael Ross", role: "CTO @ Fintech Startup", connection: "2nd", common: 8, match: 92, interest: "Backend Performance" },
    { id: 4, name: "Elena Petrova", role: "Principal Architect @ Google", connection: "3rd", common: 22, match: 78, interest: "Cloud Infrastructure" },
  ];

  const handleGenerate = async (s: any) => {
    setSelectedStakeholder(s);
    setGenerating(true);
    setGeneratedMessage("");
    setActiveTab("messages");
    
    try {
      const response = await fetch("/api/ai/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "network-engine", studentId: 1, stakeholder: s })
      });
      const data = await response.json();
      setGeneratedMessage(data.message || `Hi ${s.name}, I've been following your work at ${s.role.split('@')[1]?.trim() || s.company}. Would love to connect!`);
    } catch (e) {
      console.error("Failed to generate message", e);
      setGeneratedMessage(`Hi ${s.name}, I've been following your work. Your recent insights on ${s.interest} really resonated with my project. Would love to connect and learn more!`);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedMessage) {
      toast.error("No message to copy!");
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(generatedMessage);
        toast.success("Copied to clipboard!", {
          description: "You can now paste this message on LinkedIn.",
          icon: <Linkedin className="w-4 h-4 text-indigo-600" />,
        });
      } else {
        // Fallback for non-secure contexts or older browsers
        const textArea = document.createElement("textarea");
        textArea.value = generatedMessage;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful) {
          toast.success("Copied to clipboard (fallback)!");
        } else {
          throw new Error("execCommand failed");
        }
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error("Failed to copy. Please select and copy manually.");
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
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Strategic Outreach</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Network <span className="text-indigo-600">Engine</span></h1>
          <p className="text-muted-foreground font-medium">Automated stakeholder mapping and personalized outreach generation.</p>
        </div>
        <div className="flex bg-muted/50 p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab("stakeholders")}
            className={cn("px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all", activeTab === "stakeholders" ? "bg-background shadow-md" : "text-muted-foreground hover:text-foreground")}
          >
            Stakeholders
          </button>
          <button 
            onClick={() => setActiveTab("messages")}
            className={cn("px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all", activeTab === "messages" ? "bg-background shadow-md" : "text-muted-foreground hover:text-foreground")}
          >
            AI Messages
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {activeTab === "stakeholders" ? (
            <div className="grid md:grid-cols-2 gap-6">
              {stakeholders.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-8 rounded-[2.5rem] hover:border-indigo-600/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-muted overflow-hidden border-2 border-border/50 group-hover:border-indigo-600/30 transition-colors">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`} alt={s.name} />
                    </div>
                    <div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-widest">
                      {s.match}% Match
                    </div>
                  </div>
                  <h3 className="text-lg font-black mb-1">{s.name}</h3>
                  <p className="text-xs font-bold text-muted-foreground mb-6">{s.role}</p>
                  
                  <div className="flex items-center gap-6 mb-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5" /> {s.common} Mutuals
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5" /> {s.connection} Connection
                    </div>
                  </div>

                  <button 
                    onClick={() => handleGenerate(s)}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <Linkedin className="w-4 h-4" /> Generate Connect Message
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-10 rounded-[3rem] h-full flex flex-col min-h-[500px]">
              <AnimatePresence mode="wait">
                {generating ? (
                  <motion.div 
                    key="generating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 animate-spin">
                      <Sparkles className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-black">Analyzing Background...</h3>
                    <p className="text-sm text-muted-foreground mt-2">Crafting a high-conversion outreach message.</p>
                  </motion.div>
                ) : selectedStakeholder ? (
                  <motion.div 
                    key="message"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 flex flex-col"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden border">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStakeholder.name}`} alt="" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm">{selectedStakeholder.name}</h4>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{selectedStakeholder.role}</p>
                      </div>
                    </div>
                    
                    <div className="p-8 bg-muted/30 rounded-[2rem] border-2 border-indigo-600/10 font-medium text-sm leading-relaxed mb-8 relative">
                      <div className="absolute -top-3 left-8 px-3 py-1 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-full">AI Generated</div>
                      "{generatedMessage}"
                    </div>

                    <div className="mt-auto flex gap-4">
                      <button 
                        onClick={handleCopy}
                        className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
                      >
                        <Linkedin className="w-4 h-4" /> Copy for LinkedIn
                      </button>
                      <button 
                        onClick={() => handleGenerate(selectedStakeholder)}
                        className="p-4 bg-muted rounded-2xl hover:bg-muted/80 transition-all group"
                        title="Regenerate Message"
                      >
                        <Zap className="w-4 h-4 group-hover:text-indigo-600 transition-colors" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                    <MessageSquare className="w-16 h-16 text-indigo-100 mb-6" />
                    <h3 className="text-xl font-black mb-2">Message Generator</h3>
                    <p className="text-sm text-muted-foreground font-medium mb-8 italic">"Select a stakeholder from the list to generate a high-conversion networking message."</p>
                    <div className="w-full space-y-4">
                      <div className="p-4 bg-muted/30 rounded-2xl border text-left flex items-center justify-between">
                        <span className="text-xs font-bold">Cold Reachout</span>
                        <span className="text-[9px] font-black uppercase text-indigo-600">88% Success</span>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-2xl border text-left flex items-center justify-between">
                        <span className="text-xs font-bold">Coffee Chat Request</span>
                        <span className="text-[9px] font-black uppercase text-indigo-600">94% Success</span>
                      </div>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] bg-indigo-600 text-white relative overflow-hidden">
            <h3 className="font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> AI Outreach Agent
            </h3>
            <p className="text-xs font-bold leading-relaxed opacity-80 mb-8 italic">
              {selectedStakeholder ? (
                `"I've identified that ${selectedStakeholder.name.split(' ')[0]} values ${selectedStakeholder.interest}. I've tailored the outreach to highlight your relevant expertise."`
              ) : (
                `"I'm ready to analyze stakeholder backgrounds and craft personalized messages to boost your response rate."`
              )}
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-[10px] font-black uppercase">
                <span>Outreach Limit</span>
                <span>12 / 20</span>
              </div>
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-[60%]" />
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border-indigo-600/10">
            <h3 className="font-black text-sm uppercase tracking-widest mb-6">Network Health</h3>
            <div className="space-y-6">
              {[
                { label: "FAANG Density", val: 45 },
                { label: "Response Rate", val: 32 },
                { label: "Active Referrals", val: 2 },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col gap-2">
                   <div className="flex justify-between items-end">
                     <span className="text-[10px] font-black uppercase text-muted-foreground">{stat.label}</span>
                     <span className="text-sm font-black">{stat.val}{typeof stat.val === 'number' && i < 2 ? '%' : ''}</span>
                   </div>
                   <div className="w-full h-1 bg-muted rounded-full">
                     <div className="h-full bg-indigo-600" style={{ width: i < 2 ? `${stat.val}%` : '40%' }} />
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
