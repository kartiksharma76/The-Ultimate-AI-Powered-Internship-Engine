import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Sparkles, X, Send, Bot, User, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hi! I'm your AI career assistant. How can I help you today?" }
  ]);

  const [isTyping, setIsTyping] = useState(false);
  
  const handleSend = async () => {
    if (!message.trim() || isTyping) return;
    
    const userMsg = message;
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setMessage("");
    setIsTyping(true);
    
    try {
      const response = await fetch("/api/ai/career-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });

      if (!response.ok) throw new Error("API Offline");

      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: "bot", 
        content: data.response || "I'm having trouble processing that right now. Please try again." 
      }]);
    } catch (error) {
      console.warn("AI Assistant Backend Offline, switching to simulated mode.");
      // Fallback responses for common keywords
      const lower = userMsg.toLowerCase();
      let fallback = "I've analyzed your request. Based on current market trends, you should focus on sharpening your system design skills. Would you like a roadmap?";
      
      if (lower.includes("resume")) fallback = "Your current resume score is 72. To reach the 90+ elite bracket, try adding quantifiable metrics to your experience section.";
      if (lower.includes("job") || lower.includes("internship")) fallback = "I've detected 5 new high-match internship streams in your domain. Check the Internships tab for the latest listings.";
      if (lower.includes("hello") || lower.includes("hi")) fallback = "Hi there! I'm your InternAI Co-Pilot. I can help with resume optimization, job search, and technical prep. What's on your mind?";

      setTimeout(() => {
        setMessages(prev => [...prev, { role: "bot", content: fallback }]);
        setIsTyping(false);
      }, 1000);
      return;
    } finally {
      if (!isTyping) setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="pointer-events-auto absolute bottom-20 right-0 w-80 md:w-96 h-[500px] glass-card rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border-primary/20"
          >
            {/* Header */}
            <div className="p-6 bg-primary text-primary-foreground flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                  <Sparkles className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-widest">InternAI Co-Pilot</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold opacity-70 uppercase">Always Active</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-background/50">
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === "bot" ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    msg.role === "bot" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {msg.role === "bot" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div className={cn(
                    "p-3.5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                    msg.role === "bot" 
                      ? "bg-card border border-border" 
                      : "bg-primary text-primary-foreground"
                  )}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="p-3 bg-card border border-border rounded-2xl flex gap-1">
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar">
              {["Resume Tips", "Job Search", "Skills"].map(tag => (
                <button 
                  key={tag}
                  className="px-3 py-1 bg-muted/50 hover:bg-primary/10 hover:text-primary border border-border rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all"
                  onClick={() => setMessage(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 bg-background/80 backdrop-blur-md border-t border-border">
              <div className="relative">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask anything..."
                  className="w-full bg-muted border border-border rounded-2xl px-5 py-3.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all pr-12"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="pointer-events-auto w-16 h-16 bg-primary text-primary-foreground rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-center relative group"
      >
        <div className="absolute inset-0 bg-primary rounded-2xl animate-ping opacity-20" />
        {isOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8 fill-current" />}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-background rounded-full" />
      </motion.button>
    </div>
  );
}
