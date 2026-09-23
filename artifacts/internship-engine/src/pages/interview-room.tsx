import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Video, Mic, ShieldAlert, Sparkles, Zap, Brain, CheckCircle2, User, ArrowRight, Loader2, Link } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InterviewRoomPage() {
  const [activeSession, setActiveSession] = useState(false);
  const [insight, setInsight] = useState<string>("You are maintaining great eye contact, but your hand gestures are slightly repetitive.");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  const [chatHistory, setChatHistory] = useState([
    { role: "ai", content: "Tell me about a time you had to resolve a high-stakes technical conflict." }
  ]);
  const [message, setMessage] = useState("");
  const [loadingReply, setLoadingReply] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    const newHistory = [...chatHistory, { role: "user", content: message }];
    setChatHistory(newHistory);
    setMessage("");
    setLoadingReply(true);

    try {
      const response = await fetch("/api/ai/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "interview-ghost", history: newHistory })
      });
      const data = await response.json();
      setChatHistory([...newHistory, { role: "ai", content: data.question }]);
    } catch (e) {
      setChatHistory([...newHistory, { role: "ai", content: "Can you elaborate on the architecture decisions you made there?" }]);
    } finally {
      setLoadingReply(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://internai.engine/room/7a9b2c");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const fetchFeedback = async () => {
    setLoadingInsight(true);
    try {
      const response = await fetch("/api/ai/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "interview-room", studentId: 1 })
      });
      const data = await response.json();
      setInsight(data.feedback || "Good posture. Speak slightly louder.");
    } catch (e) {
      setInsight("Try slowing down your speech for better articulation.");
    } finally {
      setLoadingInsight(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20">
              <Video className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">High-Stakes Simulation</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Interview <span className="text-indigo-600">Room</span></h1>
          <p className="text-muted-foreground font-medium">Neural AI interview simulation with real-time feedback on body language and EQ.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-card p-10 rounded-[3.5rem] relative overflow-hidden bg-slate-900 min-h-[600px] flex flex-col items-center justify-center border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />
            
            <AnimatePresence mode="wait">
               {!activeSession ? (
                 <motion.div 
                   key="start"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="relative z-10 text-center max-w-md mx-auto"
                 >
                    <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center mx-auto mb-8 backdrop-blur-xl">
                       <Mic className="w-10 h-10 text-white animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Enter Neural Simulation</h2>
                    <p className="text-sm text-white/60 font-medium mb-10 leading-relaxed italic">"Access a hyper-realistic interview environment with our specialized 'Ghost' AI recruiter."</p>
                    <div className="flex items-center justify-center gap-4 mx-auto mt-10">
                      <button 
                        onClick={() => setActiveSession(true)}
                        className="px-8 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3"
                      >
                        <Sparkles className="w-4 h-4" /> Start Simulation
                      </button>
                      <button 
                        onClick={handleCopyLink}
                        className="px-8 py-5 bg-white/10 text-white border border-white/20 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/20 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3"
                      >
                        {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Link className="w-4 h-4" />}
                        {copiedLink ? "Link Copied!" : "Invite Peer"}
                      </button>
                    </div>
                    <div className="flex items-center gap-6 mt-12 text-[9px] font-black text-white/30 uppercase tracking-widest justify-center">
                       <span className="flex items-center gap-2"><ShieldAlert className="w-3.5 h-3.5" /> High Fidelity</span>
                       <span className="flex items-center gap-2"><Brain className="w-3.5 h-3.5" /> Bio-Feedback Active</span>
                    </div>
                 </motion.div>
               ) : (
                 <motion.div 
                   key="active"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="relative z-10 w-full h-full flex flex-col"
                 >
                    <div className="flex-1 flex flex-col items-center justify-center">
                       <div className="w-full max-w-2xl aspect-video rounded-3xl bg-black border border-white/20 relative overflow-hidden shadow-2xl">
                          <div className="absolute inset-0 flex items-center justify-center">
                             <User className="w-24 h-24 text-white/10" />
                          </div>
                          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                             <span className="text-[9px] font-black text-white uppercase tracking-widest">Live Stream</span>
                          </div>
                          <div className="absolute bottom-4 right-4 flex items-center gap-4">
                             <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10"><Mic className="w-4 h-4 text-white" /></div>
                             <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10"><Video className="w-4 h-4 text-white" /></div>
                          </div>
                       </div>
                       <div className="mt-8 w-full px-8">
                          <div className="space-y-4 mb-4 max-h-[180px] overflow-y-auto pr-2">
                            {chatHistory.map((msg, i) => (
                               <div key={i} className={cn("flex flex-col", msg.role === "ai" ? "items-start" : "items-end")}>
                                 <span className="text-[10px] font-black uppercase text-white/40 mb-1">{msg.role === "ai" ? "AI Recruiter 'Ghost'" : "You"}</span>
                                 <p className={cn("text-sm font-medium p-3 rounded-2xl max-w-[85%]", msg.role === "ai" ? "bg-white/10 text-white italic" : "bg-indigo-600 text-white")}>
                                    {msg.content}
                                 </p>
                               </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-3">
                             <input 
                               type="text"
                               value={message}
                               onChange={(e) => setMessage(e.target.value)}
                               onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                               placeholder="Type your response..."
                               className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50"
                             />
                             <button 
                               onClick={sendMessage}
                               disabled={loadingReply || !message.trim()}
                               className="p-3 bg-indigo-600 text-white rounded-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                             >
                               {loadingReply ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageSquare className="w-5 h-5" />}
                             </button>
                          </div>
                       </div>
                    </div>
                    <div className="mt-auto grid grid-cols-3 gap-6 pt-12">
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                          <div className="text-xs font-black text-indigo-400">Neutral</div>
                          <div className="text-[8px] font-black uppercase text-white/40">Emotion</div>
                       </div>
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                          <div className="text-xs font-black text-emerald-400">Calm</div>
                          <div className="text-[8px] font-black uppercase text-white/40">Heart Rate</div>
                       </div>
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                          <div className="text-xs font-black text-amber-400">72%</div>
                          <div className="text-[8px] font-black uppercase text-white/40">Confidence</div>
                       </div>
                    </div>
                    <button 
                      onClick={async () => {
                        // Save session before ending
                        try {
                          await fetch("/api/interviews", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              studentId: 1,
                              overallScore: 72,
                              confidenceScore: 85,
                              technicalScore: 68,
                              strengths: ["Clean Code", "Communication"],
                              weaknesses: ["Repetitive Gestures"],
                              completedAt: new Date().toISOString()
                            })
                          });
                        } catch (e) {
                          console.error("Failed to save interview session", e);
                        }
                        setActiveSession(false);
                      }}
                      className="mt-8 w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl font-black uppercase tracking-widest text-[9px] border border-red-500/20 transition-all"
                    >
                      End Session
                    </button>
                 </motion.div>
               )}
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] bg-indigo-600 text-white relative overflow-hidden">
             <Zap className="absolute top-4 right-4 w-12 h-12 opacity-10" />
             <h3 className="font-black text-sm uppercase tracking-widest mb-6">Neural Insights</h3>
             <div className="space-y-4">
                <div className="p-5 bg-white/10 rounded-2xl border border-white/10">
                   <h4 className="text-[10px] font-black uppercase mb-1">Body Language & EQ</h4>
                   <p className="text-[11px] opacity-80 leading-relaxed italic">"{insight}"</p>
                </div>
                <button onClick={fetchFeedback} disabled={loadingInsight} className="w-full py-4 bg-white/20 hover:bg-white/30 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                  {loadingInsight ? "Analyzing Frame..." : "Get Live Analysis"}
                </button>
             </div>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border-indigo-600/10">
             <h3 className="font-black text-sm uppercase tracking-widest mb-6">Past Session</h3>
             <div className="flex items-center justify-between p-4 bg-muted rounded-2xl border border-border/50">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest">SDE-2 Mock</span>
                      <span className="text-[8px] text-muted-foreground font-bold">Score: 88/100</span>
                   </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
