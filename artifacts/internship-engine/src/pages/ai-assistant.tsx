import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Send, 
  FileUp, 
  Bot, 
  User, 
  Zap, 
  BrainCircuit, 
  ChevronRight, 
  MessageSquare,
  ClipboardList,
  Target,
  CheckCircle2
} from "lucide-react";
import { useGetStudent } from "@workspace/api-client-react";
import { useActiveStudent } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function AIAssistantPage() {
  const studentId = useActiveStudent();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI Career Assistant. How can I help you today? You can ask me things like 'What career suits me?' or 'How can I improve my profile?'",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [detailedAnalysis, setDetailedAnalysis] = useState<string | null>(null);
  const [emailInputs, setEmailInputs] = useState({ company: "", role: "", tone: "formal" });
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { data: profileStudent } = useGetStudent(studentId);

  useEffect(() => {
    if (profileStudent && messages.length === 1) {
      setMessages([{
        id: "1",
        text: `Hello ${profileStudent.name}! I've analyzed your profile with skills like ${profileStudent.skills?.slice(0, 3).join(", ")}. How can I assist your career growth today?`,
        sender: "ai",
        timestamp: new Date()
      }]);
    }
  }, [profileStudent]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/ai/career-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputValue, studentId })
      });

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: "ai",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const getPlanLevel = (status: string = "free") => {
    // Author always has level 3 (Premium) access
    if (user?.email === "kartiksharma768976@gmail.com") return 3;
    const levels: Record<string, number> = { "free": 0, "starter": 1, "pro": 2, "premium": 3, "recruiter": 3 };
    return levels[status] || 0;
  };

  const handleModuleClick = (moduleName: string, requiredLevel: number = 0) => {
    const currentLevel = getPlanLevel((user as any)?.subscriptionStatus);
    
    if (currentLevel < requiredLevel) {
      if (confirm(`This feature requires a higher plan. Would you like to upgrade?`)) {
        setLocation("/pricing");
      }
      return;
    }

    const promptMap: Record<string, string> = {
      "Email Assistant": "Help me write a professional recruiter email for a software intern role.",
      "Interview Coach": "I want to start a mock interview for a position that matches my skills and profile.",
      "Resume Enhancer": "Analyze my resume and suggest 3 keywords to improve it.",
      "Market Predictor": "What are the current hiring trends for React and Node.js developers in India?",
      "Roadmap Gen": "Create a 4-week learning roadmap for me to become a professional developer based on my current skills.",
      "Profile Audit": "Audit my profile and tell me my hiring attractiveness score."
    };

    const prompt = promptMap[moduleName] || `Initialize ${moduleName} module.`;
    setInputValue(prompt);
    // Automatically send the message after a tiny delay
    setTimeout(() => {
      const btn = document.getElementById("send-btn");
      btn?.click();
    }, 100);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLElement>) => {
    let file: File | undefined;
    
    if ("files" in e.target && e.target.files) {
      file = e.target.files[0];
    } else if ("dataTransfer" in e && e.dataTransfer.files) {
      file = e.dataTransfer.files[0];
    }

    if (!file) return;

    setSelectedFileName(file.name);
    setIsExtracting(true);
    setIsDragging(false);
    setAnalysisError(null);
    
    const formData = new FormData();
    if (studentId) {
      formData.append("studentId", studentId.toString());
    }
    formData.append("resume", file);

    try {
      console.log("Starting Analysis for:", file.name);
      const response = await fetch("/api/ai/extract-skills", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Analysis Result:", data);
      
      if (data.error) throw new Error(data.error);

      setExtractedSkills(data.skills || []);
      setAtsScore(data.score || 0);
      setDetailedAnalysis(data.analysis || null);
    } catch (error) {
      console.error("Analysis Error:", error);
      setAnalysisError(error instanceof Error ? error.message : "Failed to analyze resume");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleGenerateEmail = async () => {
    if (!emailInputs.company || !emailInputs.role) {
      alert("Please enter both Company and Role.");
      return;
    }

    setIsGeneratingEmail(true);
    try {
      const response = await fetch("/api/ai/career-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: `Generate a ${emailInputs.tone} recruiter email for the role of ${emailInputs.role} at ${emailInputs.company}.`,
          studentId 
        })
      });

      const data = await response.json();
      setGeneratedEmail(data.response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingEmail(false);
    }
    return;
  };

  const handleSyncSkills = async () => {
    if (!studentId || extractedSkills.length === 0) return;

    try {
      // Get current student data first to preserve other fields
      const getRes = await fetch(`http://localhost:8080/api/students/${studentId}`);
      const currentStudent = await getRes.json();
      
      const updatedSkills = Array.from(new Set([...(currentStudent.skills || []), ...extractedSkills]));

      const response = await fetch(`http://localhost:8080/api/students/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          skills: updatedSkills 
        })
      });

      if (response.ok) {
        toast.success("Skills synchronized with your professional profile!");
      } else {
        throw new Error("Failed to sync skills");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to sync skills to profile.");
    }
    return;
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    handleFileUpload(e);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative min-h-[calc(100vh-100px)] flex flex-col">
      <div className="fixed inset-0 pointer-events-none opacity-[0.2] mesh-gradient -z-10" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Advanced Intelligence</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">AI Career <span className="text-gradient">Hub</span></h1>
          <p className="text-muted-foreground font-medium italic">
            Unlock your potential with neural-driven career guidance and resume insights.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 flex-1">
        {/* Left Column: Resume Extract & Skills */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-[2.5rem] p-8 border-primary/10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <FileUp className="w-24 h-24 text-primary" />
            </div>
            
            <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground flex items-center justify-between mb-6">
              <span className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-primary" />
                Resume Analyzer
              </span>
              {atsScore !== null && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20"
                >
                  <Zap className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-black text-primary">ATS: {atsScore}%</span>
                </motion.div>
              )}
            </h3>

            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative border-2 border-dashed rounded-[2rem] p-8 text-center transition-all cursor-pointer bg-primary/5 group/upload",
                isDragging ? "border-primary bg-primary/10 scale-[1.02]" : "border-primary/20 hover:border-primary/40"
              )}
            >
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              />
              <div className="flex flex-col items-center gap-4">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-transform",
                  isDragging ? "bg-primary text-white scale-110" : "bg-primary/10 text-primary group-hover/upload:scale-110"
                )}>
                  {isExtracting ? (
                    <Zap className="w-8 h-8 animate-pulse" />
                  ) : (
                    <FileUp className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-widest mb-1">
                    {isDragging ? "Drop it now!" : selectedFileName ? `Selected: ${selectedFileName}` : "Drop Resume Here"}
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground">
                    {isExtracting ? "AI is scanning your profile..." : analysisError ? "Analysis failed. Try again." : "PDF, DOCX up to 100MB"}
                  </p>
                </div>
              </div>
            </div>

            {analysisError && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-bold text-red-600 text-center"
              >
                Error: {analysisError}
              </motion.div>
            )}

            {atsScore !== null && !isExtracting && !analysisError && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-primary/5 rounded-[2rem] border border-primary/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-16 h-16 -rotate-90">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-primary/10" />
                      <motion.circle 
                        cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" 
                        strokeDasharray={176}
                        initial={{ strokeDashoffset: 176 }}
                        animate={{ strokeDashoffset: 176 - (176 * atsScore) / 100 }}
                        className="text-primary" 
                      />
                    </svg>
                    <span className="absolute text-xs font-black">{atsScore}%</span>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">ATS Compatibility Score</h4>
                    <p className="text-[10px] font-bold text-muted-foreground italic">
                      {atsScore > 85 ? "Excellent! Your resume is highly optimized." : atsScore > 70 ? "Good job! Try adding more keywords." : "Optimization required for better visibility."}
                    </p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-primary/10 rounded-xl shrink-0">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
              </motion.div>
            )}

            {detailedAnalysis && !isExtracting && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-5 bg-muted/30 rounded-2xl border border-border/50"
              >
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" /> AI Observations
                </h4>
                <p className="text-[11px] font-bold leading-relaxed text-muted-foreground">
                  {detailedAnalysis}
                </p>
              </motion.div>
            )}

            {extractedSkills.length > 0 && !isExtracting && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-8 pt-8 border-t border-border/50"
              >
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
                  <Target className="w-3.5 h-3.5" /> Extracted Intelligence
                </h4>
                <div className="flex flex-wrap gap-2">
                  {extractedSkills.map((skill, i) => (
                    <motion.span 
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-xl border border-emerald-500/20"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
                <button 
                  onClick={handleSyncSkills}
                  className="w-full mt-6 py-3 bg-foreground text-background rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  Sync to Profile
                </button>
              </motion.div>
            )}
            {/* Advanced Analysis Link */}
            <Link href="/resume-analyzer">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 py-4 bg-primary/10 border border-primary/20 text-primary rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all shadow-xl"
              >
                <MessageSquare className="w-4 h-4" />
                Launch Resume Intelligence Chat
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-[2.5rem] p-8 border-accent/10 bg-accent/5 relative overflow-hidden"
          >
            <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-6">
              <Target className="w-4 h-4 text-accent" />
              Career Blueprint
            </h3>
            
            <div className="space-y-4">
              {[
                { role: "Data Analyst", match: 94, color: "text-emerald-500" },
                { role: "Full Stack Dev", match: 88, color: "text-primary" },
                { role: "Product Manager", match: 72, color: "text-accent" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-background/50 rounded-2xl border border-border/50">
                  <span className="text-xs font-black uppercase tracking-widest">{item.role}</span>
                  <span className={cn("text-xs font-black", item.color)}>{item.match}%</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Current Profile Intelligence */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card rounded-[2.5rem] p-8 border-emerald-500/10 bg-emerald-500/5"
          >
            <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-6">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Active Profile Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {profileStudent?.skills && profileStudent.skills.length > 0 ? (
                profileStudent.skills.map(skill => (
                  <span key={skill} className="text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-500/10">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-[10px] font-bold text-muted-foreground italic">No skills synced yet.</p>
              )}
            </div>
            <p className="mt-4 text-[9px] font-bold text-muted-foreground/60 leading-relaxed uppercase tracking-widest">
              AI uses these parameters for all recommendations and roadmap generation.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-[2.5rem] p-8 border-primary/10"
          >
            <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-6">
              <BrainCircuit className="w-4 h-4 text-primary" />
              AI Skill Path
            </h3>
            <p className="text-[10px] font-bold text-muted-foreground mb-4 italic">Recommended to boost your match score:</p>
            <div className="flex flex-wrap gap-2">
              {["PowerBI", "TensorFlow", "GraphQL", "Azure"].map(skill => (
                <span key={skill} className="text-[9px] font-black uppercase tracking-widest bg-primary/5 text-primary/70 px-3 py-1.5 rounded-lg border border-primary/10">
                  + {skill}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column: AI Chat Assistant & Advanced Modules */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col glass-card rounded-[2.5rem] border-primary/10 overflow-hidden relative h-[600px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(124,58,237,0.05),transparent)] pointer-events-none" />
            
            <div className="p-6 border-b border-border/50 bg-background/50 backdrop-blur-md flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-tight">Career Oracle</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Neural Engine</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar z-10">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn(
                      "flex gap-4 max-w-[85%]",
                      msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border",
                      msg.sender === "ai" ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted border-border text-muted-foreground"
                    )}>
                      {msg.sender === "ai" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                    <div className={cn(
                      "p-5 rounded-[1.5rem] text-sm font-medium shadow-sm",
                      msg.sender === "ai" 
                        ? "bg-background border border-border/50 text-foreground rounded-tl-none leading-relaxed" 
                        : "bg-foreground text-background rounded-tr-none"
                    )}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="p-5 bg-background border border-border/50 rounded-[1.5rem] rounded-tl-none">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.div 
                          key={i}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                          className="w-1.5 h-1.5 rounded-full bg-primary"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-6 border-t border-border/50 bg-background/50 backdrop-blur-md z-10">
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask your career question..."
                  className="flex-1 bg-muted/50 border border-border/50 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button 
                  id="send-btn"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="p-4 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Neural Modules */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Email Assistant", desc: "Craft professional recruiter emails using AI.", icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10", level: 2 },
              { title: "Interview Coach", desc: "Predict questions & practice mock interviews.", icon: BrainCircuit, color: "text-primary", bg: "bg-primary/10", level: 2 },
              { title: "Resume Enhancer", desc: "AI-driven keyword & bullet point optimization.", icon: Zap, color: "text-emerald-500", bg: "bg-emerald-500/10", level: 1 },
              { title: "Market Predictor", desc: "Real-time demand trends for your tech stack.", icon: Target, color: "text-accent", bg: "bg-accent/10", level: 3 },
              { title: "Roadmap Gen", desc: "Customized week-by-week learning plans.", icon: ClipboardList, color: "text-orange-500", bg: "bg-orange-500/10", level: 3 },
              { title: "Profile Audit", desc: "Deep-dive health check of your hiring appeal.", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10", level: 3 }
            ].map((mod, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => handleModuleClick(mod.title, mod.level)}
                className={cn(
                  "glass-card p-6 rounded-[2rem] border-border/50 hover:border-primary/30 transition-all cursor-pointer group relative",
                  getPlanLevel((user as any)?.subscriptionStatus) < mod.level ? "opacity-75" : ""
                )}
              >
                {getPlanLevel((user as any)?.subscriptionStatus) < mod.level && (
                  <div className="absolute top-4 right-4 p-1.5 bg-background/80 rounded-lg backdrop-blur-sm border border-border/50 z-20">
                    <Lock className="w-3 h-3 text-muted-foreground" />
                  </div>
                )}
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors", mod.bg)}>
                  <mod.icon className={cn("w-6 h-6", mod.color)} />
                </div>
                <h4 className="text-sm font-black uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">{mod.title}</h4>
                <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">{mod.desc}</p>
                <div className="mt-4 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Initialize Module <ChevronRight className="w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* New Feature: AI Email Generator Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-[2.5rem] p-8 border-primary/10 bg-primary/5 mt-8 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] -rotate-12">
              <MessageSquare className="w-64 h-64 text-primary" />
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">AI Email <span className="text-gradient">Studio</span></h2>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Premium Cold Email Generator</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 relative z-10">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Company</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Google, Microsoft"
                    className="w-full bg-background/50 border border-border/50 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
                    value={emailInputs.company}
                    onChange={(e) => setEmailInputs(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Desired Role</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Software Engineer Intern"
                    className="w-full bg-background/50 border border-border/50 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
                    value={emailInputs.role}
                    onChange={(e) => setEmailInputs(prev => ({ ...prev, role: e.target.value }))}
                  />
                </div>
                <div className="flex gap-4">
                  {["formal", "creative", "direct"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setEmailInputs(prev => ({ ...prev, tone: t }))}
                      className={cn(
                        "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                        emailInputs.tone === t ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-background/50 border-border/50 text-muted-foreground"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={handleGenerateEmail}
                  disabled={isGeneratingEmail}
                  className="w-full py-5 bg-foreground text-background rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-foreground/10 flex items-center justify-center gap-3"
                >
                  {isGeneratingEmail ? (
                    <>
                      <Zap className="w-5 h-5 animate-spin" />
                      Crafting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Draft
                    </>
                  )}
                </button>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-primary/5 rounded-[2rem] -rotate-1 group-hover:rotate-0 transition-transform" />
                <div className="relative h-full min-h-[300px] bg-background/80 backdrop-blur-sm border border-primary/20 rounded-[2rem] p-8 font-serif italic text-sm leading-relaxed text-muted-foreground">
                  {generatedEmail ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {generatedEmail.split('\n').map((line, i) => <p key={i} className="mb-4">{line}</p>)}
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(generatedEmail);
                          alert("Email copied to clipboard!");
                        }}
                        className="absolute bottom-6 right-6 p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-lg"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                      <Bot className="w-12 h-12 text-primary/20" />
                      <p className="font-sans font-bold text-xs uppercase tracking-widest text-primary/30">Your draft will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
