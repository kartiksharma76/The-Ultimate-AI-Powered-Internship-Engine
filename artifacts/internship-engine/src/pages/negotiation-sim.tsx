import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, MessageSquare, Zap, Target, ArrowRight, User, Bot, Sparkles, Trophy, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NegotiationSimPage() {
  const [sessionActive, setSessionActive] = useState(false);
  const [messages, setMessages] = useState<{sender: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [feedback, setFeedback] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const startSession = () => {
    setSessionActive(true);
    setTurnCount(0);
    setMessages([
      { sender: 'ai', text: "Hello! I'm Sarah, the HR manager at a Tier-1 Tech firm. We're excited to extend an offer. Currently, we're looking at a base salary of $120,000. How does that sound to you?" }
    ]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;
    const newHistory = [...messages, { sender: 'user' as const, text: userText }];
    setMessages(newHistory);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/ai/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "negotiation-sim", studentId: 1, history: newHistory })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.message || "I understand. Let me review that with the team." }]);
    } catch (e) {
      console.error("Failed to generate response", e);
      setMessages(prev => [...prev, { sender: 'ai', text: "That's a fair point. We're open to discussing performance bonuses to bridge the gap." }]);
    } finally {
      setIsTyping(false);
      setTurnCount(t => t + 1);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">High-Stakes Simulation</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Negotiation <span className="text-indigo-600">Sim</span></h1>
          <p className="text-muted-foreground font-medium">Practice high-stakes salary negotiations with AI agents trained on market data.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 h-[700px]">
        {/* Negotiation Console */}
        <div className="lg:col-span-8 flex flex-col glass-card rounded-[3rem] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl pointer-events-none" />
          
          <div className="p-6 border-b border-border/50 bg-muted/20 flex justify-between items-center relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-600/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-black">Sarah (AI HR Manager)</h3>
                <span className="text-[9px] font-black uppercase text-muted-foreground">Scenario: Tier-1 Tech Firm Offer</span>
              </div>
            </div>
            {sessionActive && (
              <button onClick={() => setSessionActive(false)} className="px-4 py-2 bg-red-500/10 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">End Session</button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 relative z-10">
            {!sessionActive ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                <div className="w-20 h-20 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mb-8">
                  <Trophy className="w-10 h-10 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-black mb-4">Master the Ask.</h2>
                <p className="text-sm text-muted-foreground font-medium mb-8">On average, users who practice with this sim secure <span className="text-indigo-600 font-black">15-20% higher</span> base salaries.</p>
                <button onClick={startSession} className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3">
                  Start Negotiation Lab
                </button>
              </div>
            ) : (
              <>
                {messages.map((m, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn("flex gap-4 max-w-[80%]", m.sender === 'user' ? "ml-auto flex-row-reverse" : "")}
                  >
                    <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", m.sender === 'user' ? "bg-indigo-600" : "bg-muted border")}>
                      {m.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-indigo-600" />}
                    </div>
                    <div className={cn("p-5 rounded-[2rem]", m.sender === 'user' ? "bg-indigo-600 text-white rounded-tr-none" : "bg-muted/50 border border-border/50 rounded-tl-none")}>
                      <p className="text-sm font-medium leading-relaxed">{m.text}</p>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex gap-4 max-w-[80%]">
                    <div className="w-8 h-8 rounded-xl bg-muted border flex items-center justify-center">
                      <Bot className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="p-4 bg-muted/30 rounded-[2rem] rounded-tl-none flex gap-1">
                      <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </>
            )}
          </div>

          {sessionActive && (
            <div className="p-6 bg-background border-t border-border/50 relative z-10">
              <div className="flex gap-4 p-2 bg-muted/30 rounded-[2.5rem] border border-border/50 focus-within:border-indigo-600/50 transition-all">
                <input 
                  type="text" 
                  placeholder="Type your counter-offer or question..." 
                  className="bg-transparent border-none outline-none flex-1 px-6 font-bold text-sm"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-600/20"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Real-time Insights */}
        <div className="lg:col-span-4 space-y-6 overflow-y-auto pr-2">
          <div className="glass-card p-8 rounded-[2.5rem] bg-indigo-600 text-white">
            <h3 className="font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white" /> AI Negotiation Coach
            </h3>
            <div className="space-y-6">
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                <h4 className="text-[10px] font-black uppercase mb-1">Current Sentiment</h4>
                <div className="text-lg font-black italic">"Neutral-Professional"</div>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                <h4 className="text-[10px] font-black uppercase mb-1">Coach Tip</h4>
                <p className="text-[11px] font-medium leading-relaxed opacity-80">
                  {(() => {
                    const userTurn = messages.filter(m => m.sender === 'user').length;
                    const tips = [
                      "Start by acknowledging the excitement of the offer before pivoting to the compensation discussion.",
                      "Highlight your specific technical contributions and how they justify a higher percentile placement.",
                      "If the base salary is firm, try pivoting to sign-on bonuses, relocation assistance, or stock options.",
                      "Mention market research or competing offers (if any) to create a stronger leverage point.",
                      "Focus on long-term value. Ask about performance review cycles and growth trajectories.",
                      "You've done well. If the final offer is close, consider the overall culture and project impact."
                    ];
                    return tips[Math.min(userTurn, tips.length - 1)];
                  })()}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border-indigo-600/10">
            <h3 className="font-black text-sm uppercase tracking-widest mb-6">Market Benchmarks</h3>
            <div className="space-y-4">
              {[
                { label: "Median Base", val: "$125k" },
                { label: "75th Percentile", val: "$148k" },
                { label: "Equity (4yr)", val: "$200k" },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-muted/30 rounded-xl">
                  <span className="text-[10px] font-black uppercase text-muted-foreground">{stat.label}</span>
                  <span className="text-xs font-black">{stat.val}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-start gap-3 p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-[10px] font-black text-amber-900/60 leading-relaxed uppercase tracking-wider">
                System Alert: Inflation-adjusted salary for this role has increased by 4% in the last 6 months.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Send(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  )
}
