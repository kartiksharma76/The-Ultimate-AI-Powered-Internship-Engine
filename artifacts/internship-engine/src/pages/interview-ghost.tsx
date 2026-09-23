import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Bot, User, Zap, Target, Activity, AlertTriangle, Play, CheckCircle2, ChevronRight, Ghost, Mic, MicOff, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function InterviewGhostPage() {
  const [active, setActive] = useState(false);
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const [pressure, setPressure] = useState(0);
  const [messages, setMessages] = useState<{sender: 'ghost' | 'user', text: string}[]>([]);
  const [input, setInput] = useState("");
  
  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [interim, setInterim] = useState("");
  const [isGhostSpeaking, setIsGhostSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscription(prev => prev + finalTranscript + " ");
        }
        setInterim(interimTranscript);
      };
      
      recognition.onerror = (e: any) => console.error("Speech Rec Error:", e);
      recognition.onend = () => {
         setIsListening(false);
         setInterim("");
      };
      recognitionRef.current = recognition;
    }
    
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = (text: string, onEnd?: () => void) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes("UK English Male") || v.name.includes("Google UK English")) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.pitch = 0.8; 
    utterance.rate = 0.95;
    
    utterance.onstart = () => setIsGhostSpeaking(true);
    utterance.onend = () => {
      setIsGhostSpeaking(false);
      if (onEnd) onEnd();
    };
    window.speechSynthesis.speak(utterance);
  };

  const submitAnswer = async (textToSubmit: string) => {
    if (!textToSubmit.trim() || isAnalyzing) return;
    
    setIsAnalyzing(true);
    const newMessages = [...messages, { sender: 'user', text: textToSubmit } as const];
    setMessages(newMessages);
    setInput("");
    setTranscription("");
    setInterim("");
    setPressure(p => Math.min(100, p + 10)); 
    
    setMessages(prev => [...prev, { sender: 'ghost', text: "Analyzing response..." }]);

    try {
      const response = await fetch("/api/ai/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          module: "interview-ghost", 
          studentId: 1,
          history: newMessages.map(m => `${m.sender}: ${m.text}`)
        })
      });
      const data = await response.json();
      
      const reply = data.question 
        ? `${data.feedback ? data.feedback + ' ' : ''}${data.question}` 
        : "I didn't quite catch that. Could you elaborate on your architectural design?";
      
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: 'ghost', text: reply };
        return updated;
      });

      if (mode === 'voice') {
        speak(reply);
      }
      
    } catch (e) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: 'ghost', text: "Network error. Try again." };
        return updated;
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startSession = async () => {
    setActive(true);
    setPressure(60);
    setIsAnalyzing(true);
    setMessages([{ sender: 'ghost', text: "Synthesizing high-pressure persona..." }]);
    
    try {
      const response = await fetch("/api/ai/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "interview-ghost", studentId: 1 })
      });
      const data = await response.json();
      const question = data.question || "Explain how you would design a globally distributed cache system.";
      
      setMessages([{ sender: 'ghost', text: question }]);
      
      if (mode === 'voice') {
        setTimeout(() => speak(question), 500);
      }
    } catch (e) {
      const fallback = "Explain how you would design a globally distributed cache system that maintains strict consistency while handling 1 million requests per second. You have 2 minutes.";
      setMessages([{ sender: 'ghost', text: fallback }]);
      if (mode === 'voice') speak(fallback);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current || isAnalyzing) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (transcription.trim()) {
        submitAnswer(transcription.trim());
      }
    } else {
      if (transcription.trim()) {
        // If mic auto-stopped but there's text, submit it
        submitAnswer(transcription.trim());
      } else {
        // Empty text, start listening
        setTranscription("");
        setInterim("");
        try { recognitionRef.current.start(); } catch(e) {}
        setIsListening(true);
      }
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-900 rounded-xl text-white shadow-lg shadow-slate-900/20">
              <Ghost className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">High-Pressure Simulation</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Interview <span className="text-slate-900 italic">"Ghost"</span></h1>
          <p className="text-muted-foreground font-medium">Face the industry's most demanding interviewers. AI avatars that mimic Google, Meta, and Netflix personas.</p>
        </div>
        
        {!active && (
          <div className="flex items-center bg-muted/50 p-1.5 rounded-2xl border">
            <button 
              onClick={() => setMode('text')}
              className={cn("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", mode === 'text' ? "bg-white text-black shadow-sm" : "text-muted-foreground hover:text-black")}
            >
              Text Mode
            </button>
            <button 
              onClick={() => setMode('voice')}
              className={cn("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2", mode === 'voice' ? "bg-indigo-600 text-white shadow-sm" : "text-muted-foreground hover:text-black")}
            >
              <Mic className="w-3 h-3" /> Voice Mode
            </button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-8 h-[750px]">
        <div className="lg:col-span-8 flex flex-col glass-card rounded-[3.5rem] bg-[#080808] border-white/10 overflow-hidden relative">
           <div className={cn("absolute top-0 right-0 w-[500px] h-[500px] blur-[120px] pointer-events-none transition-all duration-1000", mode === 'voice' ? "bg-indigo-600/10" : "bg-red-600/5")} />
           
           <div className="p-8 border-b border-white/10 flex justify-between items-center relative z-10">
              <div className="flex items-center gap-4">
                 <div className={cn("w-12 h-12 rounded-2xl border flex items-center justify-center", mode === 'voice' ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" : "bg-white/5 border-white/10 text-white animate-pulse")}>
                    {mode === 'voice' ? <Volume2 className={cn("w-6 h-6", isGhostSpeaking && "animate-pulse")} /> : <Ghost className="w-6 h-6" />}
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-white italic">"The Skeptic"</h3>
                    <div className="flex items-center gap-2">
                       <span className={cn("text-[9px] font-black uppercase tracking-widest", mode === 'voice' ? "text-indigo-400" : "text-red-500")}>Aggressive Persona</span>
                       <span className="w-1 h-1 bg-white/20 rounded-full" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Difficulty: Elite</span>
                    </div>
                 </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                 <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Stress Level</div>
                 <div className="w-40 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div animate={{ width: `${pressure}%` }} className={cn("h-full", mode === 'voice' ? "bg-indigo-500" : "bg-red-600")} />
                 </div>
              </div>
           </div>

           {!active ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto p-12 relative z-10">
                <div className={cn("w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-8 border", mode === 'voice' ? "bg-indigo-500/10 border-indigo-500/30" : "bg-white/5 border-white/10")}>
                   {mode === 'voice' ? <Mic className="w-12 h-12 text-indigo-400" /> : <Zap className="w-12 h-12 text-white" />}
                </div>
                <h2 className="text-3xl font-black text-white mb-4">{mode === 'voice' ? "Voice AI Activated." : "Zero Room for Error."}</h2>
                <p className="text-sm text-muted-foreground font-medium mb-10 leading-relaxed italic">
                  {mode === 'voice' 
                    ? "\"Experience a real-time, voice-to-voice system design interview. The AI will speak to you, and you must respond verbally.\""
                    : "\"The Ghost mode simulates the 'silent' stressors of Tier-1 interviews—interruptions, skeptical follow-ups, and strict time limits.\""}
                </p>
                <button 
                 onClick={startSession}
                 className={cn("px-12 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all", mode === 'voice' ? "bg-indigo-600 text-white shadow-[0_0_50px_rgba(79,70,229,0.3)]" : "bg-white text-black shadow-[0_0_50px_rgba(255,255,255,0.1)]")}
                >
                  Initiate Protocol
                </button>
             </div>
           ) : mode === 'voice' ? (
             <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-12">
                <div className="relative mb-16">
                  {/* Glowing Orb */}
                  <motion.div 
                    animate={{ 
                      scale: isGhostSpeaking ? [1, 1.2, 1] : isAnalyzing ? [1, 1.05, 1] : isListening ? [1, 1.1, 1] : 1,
                      opacity: isGhostSpeaking ? [0.5, 0.8, 0.5] : isAnalyzing ? [0.4, 0.6, 0.4] : isListening ? [0.3, 0.6, 0.3] : 0.2
                    }}
                    transition={{ duration: isGhostSpeaking ? 1 : isAnalyzing ? 0.8 : 2, repeat: Infinity }}
                    className={cn("absolute inset-0 rounded-full blur-3xl", isListening ? "bg-emerald-500" : isAnalyzing ? "bg-amber-500" : "bg-indigo-600")}
                  />
                  <button 
                    onClick={toggleRecording}
                    disabled={isGhostSpeaking || isAnalyzing}
                    className={cn(
                      "w-40 h-40 rounded-full relative z-10 flex flex-col items-center justify-center gap-2 border-2 transition-all",
                      (isGhostSpeaking || isAnalyzing) ? "border-indigo-500/50 bg-indigo-500/10 cursor-not-allowed" 
                      : isListening ? "border-emerald-500 bg-emerald-500/20 hover:bg-emerald-500/30" 
                      : transcription.trim() ? "border-indigo-400 bg-indigo-500/20 hover:bg-indigo-500/30"
                      : "border-white/20 bg-white/5 hover:border-white/40"
                    )}
                  >
                    {isAnalyzing ? (
                      <Zap className="w-12 h-12 text-amber-400 animate-pulse" />
                    ) : isGhostSpeaking ? (
                      <Volume2 className="w-12 h-12 text-indigo-400 animate-pulse" />
                    ) : isListening ? (
                      <Mic className="w-12 h-12 text-emerald-400" />
                    ) : transcription.trim() ? (
                      <Zap className="w-12 h-12 text-indigo-400" />
                    ) : (
                      <MicOff className="w-12 h-12 text-muted-foreground" />
                    )}
                    <span className="text-[10px] font-black uppercase tracking-widest text-white mt-2">
                      {isAnalyzing ? "Processing" : isGhostSpeaking ? "AI Speaking" : isListening ? "Tap to Stop" : transcription.trim() ? "Tap to Submit" : "Tap to Answer"}
                    </span>
                  </button>
                </div>
                
                <div className="w-full max-w-xl text-center min-h-[100px] flex items-center justify-center">
                  <p className="text-xl font-medium leading-relaxed text-white italic">
                    {isAnalyzing
                      ? "Analyzing architectural decisions..."
                      : isGhostSpeaking 
                      ? "..." 
                      : (transcription || interim)
                        ? `"${transcription}${interim}"` 
                        : isListening 
                          ? "Listening..." 
                          : "Waiting for your response..."}
                  </p>
                </div>
             </div>
           ) : (
             <div className="flex-1 overflow-y-auto p-12 space-y-8 relative z-10 custom-scrollbar">
                {messages.map((m, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: m.sender === 'ghost' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn("flex gap-6 max-w-[85%]", m.sender === 'user' ? "ml-auto flex-row-reverse" : "")}
                  >
                     <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border", m.sender === 'user' ? "bg-white text-black border-white" : "bg-black text-white border-white/20")}>
                        {m.sender === 'user' ? <User className="w-5 h-5" /> : <Ghost className="w-5 h-5" />}
                     </div>
                     <div className={cn("p-8 rounded-[2.5rem]", m.sender === 'user' ? "bg-white text-black rounded-tr-none" : "bg-white/5 border border-white/10 text-white rounded-tl-none")}>
                        <p className="text-base font-bold leading-relaxed italic">"{m.text}"</p>
                     </div>
                  </motion.div>
                ))}
             </div>
           )}

           {active && mode === 'text' && (
              <div className="p-8 bg-black/40 border-t border-white/10 relative z-10">
                 <div className="flex gap-4 p-2 bg-white/5 rounded-[2.5rem] border border-white/10 focus-within:border-white transition-all">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && submitAnswer(input)}
                      placeholder="Explain your architectural decisions..." 
                      className="bg-transparent border-none outline-none flex-1 px-8 font-black text-white text-sm" 
                    />
                    <button 
                      onClick={() => submitAnswer(input)}
                      className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                    >
                       <Zap className="w-6 h-6" />
                    </button>
                 </div>
              </div>
           )}
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="glass-card p-10 rounded-[3rem] border-white/10 bg-[#0a0a0a] text-white">
              <h3 className="font-black text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-8">Performance Analytics</h3>
              <div className="space-y-8">
                 {[
                   { label: "Confidence Core", val: 68 },
                   { label: "Linguistic Precision", val: 42 },
                   { label: "Technical Depth", val: 89 },
                   { label: "Stress Resilience", val: 74 },
                 ].map(stat => (
                   <div key={stat.label} className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase">
                         <span>{stat.label}</span>
                         <span className="text-white">{stat.val}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                         <motion.div animate={{ width: `${stat.val}%` }} className={cn("h-full", mode === 'voice' ? "bg-indigo-500" : "bg-white")} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className={cn("p-10 rounded-[3rem] text-white shadow-2xl transition-all duration-500", mode === 'voice' ? "bg-indigo-600 shadow-indigo-600/20" : "bg-red-600 shadow-red-600/20")}>
              <h3 className="font-black text-[10px] uppercase tracking-[0.4em] mb-4">Critique Level 5</h3>
              <p className="text-sm font-bold leading-relaxed mb-8 italic">"You hesitated for 4 seconds when discussing consistency. A Google L4 interviewer would have pivoted to CAP theorem trade-offs immediately. Don't let the silence break your flow."</p>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase cursor-pointer hover:gap-6 transition-all group">
                 Review Mistake Matrix <ChevronRight className="w-4 h-4" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
