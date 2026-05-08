import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Send, Sparkles, BrainCircuit, ShieldCheck, 
  Search, MessageSquare, ArrowLeft, UploadCloud, CheckCircle2,
  AlertCircle, ChevronRight, Download, History, Target
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useActiveStudent } from "@/components/Layout";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

export default function ResumeAnalyzerPage() {
  const { user } = useAuth();
  const studentId = useActiveStudent();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Hello! I am your dedicated AI Resume Analyzer. Upload your resume, and I'll help you dissect every detail, find gaps, and optimize it for your target roles.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasResume, setHasResume] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Check if student already has a resume
  useEffect(() => {
    const checkResume = async () => {
      if (!studentId) return;
      try {
        const res = await fetch(`/api/students/${studentId}`);
        const data = await res.json();
        if (data.resumeText) {
          setHasResume(true);
        }
      } catch (e) {
        console.error("Failed to check resume status", e);
      }
    };
    checkResume();
  }, [studentId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    if (studentId) {
      formData.append("studentId", studentId.toString());
    }
    formData.append("resume", file);

    try {
      const res = await fetch("/api/ai/extract-skills", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) {
        setResumeData(data);
        setHasResume(true);
        toast.success("Resume scanned successfully!");
        if (data._debug) {
          toast.info(`Debug: textLength=${data._debug.textLength}, DB Status=${data._debug.dbSaveStatus}, DB Error=${data._debug.dbErrorMsg}`);
        }
        setMessages(prev => [...prev, {
          role: "ai",
          content: `Resume scanned! I've detected ${data.skills?.length || 0} skills and calculated an initial ATS score of ${data.score}%. What would you like to know about your resume?`,
          timestamp: new Date()
        }]);
      } else {
        toast.error(data?.error || "Failed to scan resume.");
      }
    } catch (error) {
      toast.error("An error occurred during upload. Ensure your file is a valid PDF or Word document.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage, timestamp: new Date() }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/resume-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, studentId }),
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: "ai", 
        content: data.response || "I'm sorry, I couldn't analyze that. Please try again.",
        timestamp: new Date()
      }]);
    } catch (error) {
      toast.error("Failed to connect to AI.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 h-[calc(100vh-120px)] flex flex-col gap-6">
      <div className="fixed inset-0 pointer-events-none opacity-[0.2] mesh-gradient -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/ai-assistant">
            <button className="p-2 hover:bg-muted rounded-xl transition-all">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-5 h-5 text-primary" />
              <h1 className="text-2xl font-black tracking-tight">Resume <span className="text-gradient">Intelligence</span></h1>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Dedicated Neural Analysis Engine</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={cn(
            "px-4 py-2 rounded-xl flex items-center gap-2 border transition-all",
            hasResume ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-amber-500/10 border-amber-500/20 text-amber-500"
          )}>
            {hasResume ? <ShieldCheck className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span className="text-[10px] font-black uppercase tracking-widest">{hasResume ? "Resume Active" : "No Resume"}</span>
          </div>
          
          <label className="cursor-pointer group">
            <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} disabled={isUploading} />
            <div className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl">
              {isUploading ? <BrainCircuit className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              {hasResume ? "Update Resume" : "Upload Resume"}
            </div>
          </label>
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-4 gap-6 overflow-hidden">
        {/* Sidebar: Stats & Insights */}
        <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          <div className="glass-card p-6 rounded-[2rem] border-primary/20 bg-primary/5">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
              <Target className="w-4 h-4" />
              ATS Score
            </h3>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-black italic">{hasResume ? (resumeData?.score || "?") : "--"}</span>
              <span className="text-muted-foreground font-black text-sm mb-1">/ 100</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: hasResume ? `${resumeData?.score || 0}%` : 0 }}
                className="h-full bg-primary" 
              />
            </div>
          </div>

          <div className="glass-card p-6 rounded-[2rem]">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Strengths
            </h3>
            <div className="space-y-3">
              {hasResume ? (resumeData?.skills ? resumeData.skills.slice(0,3).map((s: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-foreground/80">
                  <div className="w-1 h-1 rounded-full bg-emerald-500" />
                  {s}
                </div>
              )) : (
                <p className="text-[10px] text-muted-foreground italic">Ask chat for strengths</p>
              )) : (
                <p className="text-[10px] text-muted-foreground italic">Upload resume to see strengths</p>
              )}
            </div>
          </div>

          <div className="glass-card p-6 rounded-[2rem] border-amber-500/20">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-4 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Potential Gaps
            </h3>
            <div className="space-y-3">
              {hasResume ? (resumeData?.analysis ? (
                <div className="flex items-start gap-2 text-[11px] font-bold text-foreground/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                  <p className="line-clamp-3">{resumeData.analysis}</p>
                </div>
              ) : (
                <p className="text-[10px] text-muted-foreground italic">Ask chat for gaps & analysis</p>
              )) : (
                <p className="text-[10px] text-muted-foreground italic">Upload resume to see gaps</p>
              )}
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3 glass-card rounded-[2.5rem] flex flex-col overflow-hidden border-primary/10">
          {/* Messages area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "p-5 rounded-[1.75rem] text-sm leading-relaxed shadow-sm",
                    msg.role === "user" 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-muted/50 text-foreground rounded-tl-none border border-border/50"
                  )}>
                    {msg.content}
                  </div>
                  <span className="text-[9px] font-bold text-muted-foreground mt-2 uppercase tracking-widest">
                    {msg.role === "user" ? "You" : "Neural Analyzer"} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 text-muted-foreground">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest italic">Analyzing Resume...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input area */}
          <div className="p-6 bg-muted/20 border-t border-border/50">
            <div className="relative group">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={hasResume ? "Ask anything about your resume..." : "Please upload your resume first..."}
                disabled={!hasResume || isLoading}
                className="w-full bg-background border-2 border-border/50 rounded-2xl pl-6 pr-16 py-4 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading || !hasResume}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-4 px-2">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                  <Sparkles className="w-3 h-3" />
                  Optimize Wording
                </button>
                <button className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                  <Search className="w-3 h-3" />
                  Find Skill Gaps
                </button>
              </div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Powered by NVIDIA Llama-3.1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
