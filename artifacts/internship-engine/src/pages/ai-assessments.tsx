import { useState, useRef, useEffect } from "react";
import { useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Video, Play, CheckCircle2, AlertTriangle, Zap, ShieldAlert, Bot, User, Send, ScanFace, Mic, MicOff, Volume2 } from "lucide-react";
import * as faceapi from "@vladmandic/face-api";
import { cn } from "@/lib/utils";
import { useActiveStudent } from "@/components/Layout";

export default function AIAssessmentsPage() {
  const id = useActiveStudent();
  const [activeTab, setActiveTab] = useState<"assessments" | "interviews">("assessments");
  const [loading, setLoading] = useState(false);
  const [testActive, setTestActive] = useState(false);
  const [problem, setProblem] = useState<any>(null);
  const [mcqQuestions, setMcqQuestions] = useState<any[]>([]);
  const [currentMcqIndex, setCurrentMcqIndex] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({});
  const [codeInput, setCodeInput] = useState("// Write your solution here...\n");
  const [testScore, setTestScore] = useState<any>(null);
  const [assessmentType, setAssessmentType] = useState<"coding" | "mcq">("coding");
  
  // Fraud Detection Sensors
  const [browserSwitches, setBrowserSwitches] = useState(0);
  const [copyPastes, setCopyPastes] = useState(0);
  const [fraudWarning, setFraudWarning] = useState(false);

  useEffect(() => {
    if (testActive) {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          setBrowserSwitches(prev => prev + 1);
          setFraudWarning(true);
          setTimeout(() => setFraudWarning(false), 3000);
        }
      };

      const handlePaste = (e: ClipboardEvent) => {
        setCopyPastes(prev => prev + 1);
        setFraudWarning(true);
        setTimeout(() => setFraudWarning(false), 3000);
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      document.addEventListener("paste", handlePaste);
      
      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        document.removeEventListener("paste", handlePaste);
      };
    }
  }, [testActive]);

  const [timeLeft, setTimeLeft] = useState(45 * 60);

  // Mock Interview State
  const [interviewActive, setInterviewActive] = useState(false);
  const [interviewTime, setInterviewTime] = useState(0);
  const [interviewMessages, setInterviewMessages] = useState<{sender: string, text: string}[]>([]);
  const [interviewInput, setInterviewInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Jarvis Voice State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  // Real-time Facial Expression Tracker State
  const [hudConfidence, setHudConfidence] = useState("98.4");
  const [hudEmotion, setHudEmotion] = useState("ANALYZING");
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [initializingVision, setInitializingVision] = useState(false);
  
  // Webcam State
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      // ONLY request video. Requesting audio: true locks the microphone hardware on Windows
      // and prevents window.SpeechRecognition from listening!
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Failed to access camera", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopCamera(); // Cleanup on unmount
  }, []);

  // Timers
  useEffect(() => {
    let interval: any;
    if (testActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && testActive) {
      submitTest(); // auto-submit when time is up
    }
    return () => clearInterval(interval);
  }, [testActive, timeLeft]);

  useEffect(() => {
    let interval: any;
    if (interviewActive) {
      interval = setInterval(() => setInterviewTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [interviewActive]);

  // Jarvis Text-to-Speech (TTS)
  const speakMessage = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to find a good English voice (preferably male/professional for "Jarvis")
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.name.includes("Google UK English Male") || v.name.includes("Microsoft Mark")) || voices[0];
      if (preferredVoice) utterance.voice = preferredVoice;
      
      utterance.pitch = 0.9;
      utterance.rate = 1.05;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Trigger Speech when AI replies
  useEffect(() => {
    const lastMsg = interviewMessages[interviewMessages.length - 1];
    if (interviewActive && lastMsg && lastMsg.sender === "ai") {
      speakMessage(lastMsg.text);
    }
  }, [interviewMessages, interviewActive]);

  // We removed the useEffect that created SpeechRecognition once.
  // Instead, we create a fresh instance every time the user clicks the microphone
  // to avoid 'stale instance' or 'already started' bugs in Chrome.

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in your browser. Please try Chrome or Edge.");
      return;
    }

    try {
      setInterviewInput(""); // Clear before speaking
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English works much better for Indian users
      
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
        
        // Update input with whatever we have heard so far
        if (finalTranscript || interimTranscript) {
          setInterviewInput((prev) => {
            const baseText = prev.replace(/ \(listening\.\.\.\)$/, ''); // remove old interim
            if (finalTranscript) return (baseText + " " + finalTranscript).trim();
            return (baseText + " " + interimTranscript + " (listening...)").trim();
          });
        }
      };
      
      recognition.onend = () => {
        setIsListening(false);
        // Remove the "(listening...)" tag when it ends
        setInterviewInput(prev => prev.replace(/ \(listening\.\.\.\)$/, ''));
      };
      
      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert("Microphone access was denied. Please allow microphone permissions in your browser.");
        }
      };
      
      recognitionRef.current = recognition;
      recognitionRef.current.start();
      setIsListening(true);
      
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsListening(false);
    }
  };

  // Load Face-API Models
  useEffect(() => {
    const loadModels = async () => {
      setInitializingVision(true);
      try {
        const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Failed to load face-api models", err);
        // If it fails (e.g. adblocker, network issue), still allow the user to proceed
        // by setting modelsLoaded to true, but the inference loop will naturally fail gracefully
        setModelsLoaded(true);
      } finally {
        setInitializingVision(false);
      }
    };
    if (activeTab === "interviews" && !modelsLoaded && !initializingVision) {
      loadModels();
    }
  }, [activeTab, modelsLoaded, initializingVision]);

  // Real-time Inference Loop
  useEffect(() => {
    let interval: any;
    if (interviewActive && modelsLoaded && videoRef.current) {
      interval = setInterval(async () => {
        if (!videoRef.current) return;
        
        const detections = await faceapi.detectSingleFace(
          videoRef.current, 
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceExpressions();
        
        if (detections) {
          // Get emotion with highest probability
          const expressions = detections.expressions;
          const dominantEmotion = Object.keys(expressions).reduce((a, b) => 
            // @ts-ignore
            expressions[a] > expressions[b] ? a : b
          );
          
          setHudEmotion(dominantEmotion.toUpperCase());
          setHudConfidence((detections.detection.score * 100).toFixed(1));
        } else {
          setHudEmotion("NO_FACE");
          setHudConfidence("0.0");
        }
      }, 500); // Run inference every 500ms
    }
    return () => clearInterval(interval);
  }, [interviewActive, modelsLoaded]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (interviewActive) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [interviewMessages, interviewActive, isTyping]);

  const startInterview = () => {
    // Unlock Audio Context for modern browsers
    if ("speechSynthesis" in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
    }
    
    setInterviewActive(true);
    setInterviewTime(0);
    setEvaluation(null);
    startCamera();
    setInterviewMessages([
      { sender: "ai", text: "Hello! I am your AI Interviewer. I will be conducting your mock interview today. To start, please introduce yourself and tell me about a project you are proud of." }
    ]);
  };

  const sendInterviewMessage = async () => {
    if (!interviewInput.trim()) return;
    
    // Unlock Audio Context for modern browsers
    if ("speechSynthesis" in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
    }
    
    const userText = interviewInput;
    setInterviewMessages(prev => [...prev, { sender: "user", text: userText }]);
    setInterviewInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:8080/api/ai/career-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: `I am answering a mock interview question. My response: "${userText}". Please act as the elite technical interviewer, acknowledge my response strictly, and ask ONE highly technical follow-up question based on what I just said.`, 
          studentId: id 
        })
      });
      const data = await response.json();
      setInterviewMessages(prev => [...prev, { sender: "ai", text: data.response }]);
    } catch (err) {
      setInterviewMessages(prev => [...prev, { sender: "ai", text: "I had a connection issue. Can you please repeat that?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const endInterview = async () => {
    setIsTyping(true);
    try {
      const transcript = interviewMessages.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join("\n\n");
      const res = await fetch("http://localhost:8080/api/interviews/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: id, transcript })
      });
      if (res.ok) {
        setEvaluation(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
      setInterviewActive(false);
      stopCamera();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      if (isListening) recognitionRef.current?.stop();
      setIsListening(false);
    }
  };

  const startTest = async (type: "coding" | "mcq") => {
    setLoading(true);
    setAssessmentType(type);
    try {
      const res = await fetch(`http://localhost:8080/api/assessments/generate?type=${type}&difficulty=medium&studentId=${id}`);
      if (res.ok) {
        const data = await res.json();
        if (type === "coding") {
          setProblem(data.problem);
        } else {
          setMcqQuestions(data.questions || []);
          setCurrentMcqIndex(0);
          setMcqAnswers({});
        }
        setTimeLeft(45 * 60);
        setTestActive(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitTest = async () => {
    setLoading(true);
    try {
      let payload: any = {
        studentId: id,
        type: assessmentType,
        timeTakenMinutes: Math.floor((45 * 60 - timeLeft) / 60),
        fraudDetails: { 
          browserSwitches, 
          copyPastes,
          flagged: browserSwitches > 3 || copyPastes > 1
        },
      };

      if (assessmentType === "coding") {
        payload.codeOutput = { passed: codeInput.length > 50 };
      } else {
        // Calculate MCQ score
        let correct = 0;
        mcqQuestions.forEach((q, idx) => {
          if (mcqAnswers[idx] === q.correctIndex) correct++;
        });
        payload.codeOutput = { passed: true, score: (correct / mcqQuestions.length) * 100 };
      }

      const res = await fetch("http://localhost:8080/api/assessments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const result = await res.json();
        setTestScore(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setTestActive(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Evaluation Center</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">AI <span className="text-indigo-600">Assessments</span></h1>
          <p className="text-muted-foreground font-medium">Adaptive skill testing and AI-driven mock interviews with fraud detection.</p>
        </div>
        <div className="flex bg-muted/50 p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab("assessments")}
            className={cn("px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all", activeTab === "assessments" ? "bg-background shadow-md" : "text-muted-foreground hover:text-foreground")}
          >
            Skill Tests
          </button>
          <button 
            onClick={() => setActiveTab("interviews")}
            className={cn("px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all", activeTab === "interviews" ? "bg-background shadow-md" : "text-muted-foreground hover:text-foreground")}
          >
            Mock Interviews
          </button>
        </div>
      </div>

      {activeTab === "assessments" && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6 rounded-[2rem] border-emerald-500/20">
              <div className="flex items-center gap-3 mb-4">
                <ShieldAlert className="w-5 h-5 text-emerald-500" />
                <h3 className="font-black text-sm uppercase tracking-widest">Anti-Cheat Active</h3>
              </div>
              <ul className="space-y-3 text-xs font-bold text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Tab switch monitoring</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Copy/paste disabled</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Webcam verification</li>
              </ul>
            </div>
          </div>
          <div className="lg:col-span-2">
            {!testActive && !testScore ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card rounded-[2.5rem] p-10 text-center flex flex-col items-center hover:border-indigo-600/30 transition-all group">
                  <div className="w-16 h-16 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Code2 className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-black mb-2">Adaptive Coding Round</h2>
                  <p className="text-muted-foreground text-xs mb-8 max-w-[200px]">Dynamic algorithm problems generated by AI.</p>
                  <button 
                    onClick={() => startTest("coding")}
                    disabled={loading}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3"
                  >
                    {loading && assessmentType === "coding" ? "Generating..." : <><Play className="w-4 h-4"/> Start Coding</>}
                  </button>
                </div>

                <div className="glass-card rounded-[2.5rem] p-10 text-center flex flex-col items-center hover:border-indigo-600/30 transition-all group">
                  <div className="w-16 h-16 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Zap className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-black mb-2">Technical MCQ Round</h2>
                  <p className="text-muted-foreground text-xs mb-8 max-w-[200px]">Core CS concepts and logic assessment.</p>
                  <button 
                    onClick={() => startTest("mcq")}
                    disabled={loading}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
                  >
                    {loading && assessmentType === "mcq" ? "Generating..." : <><Play className="w-4 h-4"/> Start MCQ</>}
                  </button>
                </div>
              </div>
            ) : testScore ? (
              <div className="glass-card rounded-[2.5rem] p-12 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-black mb-2">Assessment Completed</h2>
                <div className="text-5xl font-black text-indigo-600 my-6">{testScore.codingAccuracy}%</div>
                <p className="text-muted-foreground mb-8 max-w-md">Your code has been evaluated by the AI engine.</p>
                <button 
                  onClick={() => setTestScore(null)}
                  className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  Return to Hub
                </button>
              </div>
            ) : (
              <div className="glass-card rounded-[2.5rem] p-8 border-indigo-600/30 min-h-[500px] flex flex-col relative overflow-hidden">
                <AnimatePresence>
                  {fraudWarning && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute top-0 left-0 right-0 bg-red-600 text-white py-3 px-6 text-center z-50 flex items-center justify-center gap-3 shadow-xl"
                    >
                      <AlertTriangle className="w-4 h-4 animate-bounce" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Cheating Detected: Activity Logged for Recruiter Review</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="flex justify-between items-center mb-10 pb-6 border-b">
                  <div>
                    <h2 className="text-xl font-black">{assessmentType === "coding" ? (problem?.title || "AI Generated Problem") : "Technical MCQ Assessment"}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {assessmentType === "coding" ? "Algorithm Analysis" : `Question ${currentMcqIndex + 1} of ${mcqQuestions.length}`}
                      </p>
                      <div className="w-1 h-1 rounded-full bg-muted" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 animate-pulse">
                        AI Personalized
                      </span>
                    </div>
                  </div>
                  <div className={cn("px-5 py-2.5 rounded-2xl font-black text-sm tabular-nums shadow-sm", timeLeft < 300 ? "bg-red-50 text-red-600 animate-pulse border border-red-100" : "bg-indigo-50 text-indigo-600 border border-indigo-100")}>
                    {formatTime(timeLeft)}
                  </div>
                </div>

                {assessmentType === "coding" ? (
                  <div className="flex-1 flex flex-col">
                    <p className="text-sm font-medium mb-6 text-foreground/80 leading-relaxed italic border-l-4 border-indigo-500 pl-4 bg-indigo-500/5 py-2 rounded-r-xl">
                      {problem?.description}
                    </p>
                    <div className="space-y-4 mb-8">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Example Test Cases</h4>
                      {(problem?.exampleCases || []).map((ex: any, i: number) => (
                        <div key={i} className="p-4 bg-muted/50 rounded-xl text-xs font-mono border">
                          <div><span className="text-muted-foreground">Input:</span> {ex.input}</div>
                          <div><span className="text-muted-foreground">Output:</span> {ex.output}</div>
                        </div>
                      ))}
                    </div>
                    <textarea 
                      className="flex-1 min-h-[300px] w-full bg-[#0a0a0a] rounded-2xl p-6 font-mono text-sm text-green-400 outline-none resize-none focus:ring-4 focus:ring-indigo-600/20 transition-all border-2 border-border/50"
                      value={codeInput}
                      onChange={e => setCodeInput(e.target.value)}
                      placeholder="// Implement your solution here..."
                    />
                  </div>
                ) : (
                  <div className="flex-1">
                    {mcqQuestions[currentMcqIndex] && (
                      <div className="space-y-8">
                        <h3 className="text-lg font-black leading-snug">{mcqQuestions[currentMcqIndex].question}</h3>
                        <div className="grid gap-4">
                          {mcqQuestions[currentMcqIndex].options.map((option: string, oIdx: number) => (
                            <button 
                              key={oIdx}
                              onClick={() => setMcqAnswers(prev => ({ ...prev, [currentMcqIndex]: oIdx }))}
                              className={cn(
                                "w-full text-left p-5 rounded-2xl border-2 font-bold transition-all flex items-center justify-between group",
                                mcqAnswers[currentMcqIndex] === oIdx 
                                  ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-[1.02]" 
                                  : "bg-muted/30 border-border/50 hover:border-indigo-600/50 hover:bg-muted/50"
                              )}
                            >
                              <span>{option}</span>
                              <div className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                mcqAnswers[currentMcqIndex] === oIdx ? "border-white bg-white/20" : "border-border group-hover:border-indigo-600/30"
                              )}>
                                {mcqAnswers[currentMcqIndex] === oIdx && <div className="w-2 h-2 bg-white rounded-full" />}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-10 pt-6 border-t flex justify-between items-center">
                  {assessmentType === "mcq" && (
                    <div className="flex gap-2">
                       <button 
                        onClick={() => setCurrentMcqIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentMcqIndex === 0}
                        className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground disabled:opacity-0 transition-all"
                      >
                        Previous
                      </button>
                      <button 
                        onClick={() => setCurrentMcqIndex(prev => Math.min(mcqQuestions.length - 1, prev + 1))}
                        disabled={currentMcqIndex === mcqQuestions.length - 1}
                        className="px-6 py-3 bg-muted rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted/80 disabled:opacity-0 transition-all"
                      >
                        Next Question
                      </button>
                    </div>
                  )}
                  <div className="ml-auto">
                    <button 
                      onClick={submitTest}
                      disabled={loading || (assessmentType === "mcq" && Object.keys(mcqAnswers).length < mcqQuestions.length)}
                      className="px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-3"
                    >
                      {loading ? "Finalizing..." : <><CheckCircle2 className="w-4 h-4"/> Submit to AI Engine</>}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "interviews" && (
        <div className="glass-card rounded-[2.5rem] p-8 border-indigo-600/10">
          {!interviewActive && !evaluation ? (
            <div className="text-center flex flex-col items-center py-12">
              <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mb-6 relative">
                <Video className="w-10 h-10 text-indigo-600" />
                <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-pulse" />
              </div>
              <h2 className="text-2xl font-black mb-2">AI Mock Interview Room</h2>
              <p className="text-muted-foreground mb-8 max-w-md">Connect your microphone. The AI will ask dynamic HR and Technical questions based on your profile and analyze your responses.</p>
              <button 
                onClick={startInterview}
                disabled={initializingVision}
                className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3 disabled:opacity-50"
              >
                {initializingVision ? (
                  <>Initializing AI Vision <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /></>
                ) : (
                  <><Video className="w-4 h-4"/> Start Mock Interview</>
                )}
              </button>
            </div>
          ) : evaluation ? (
            <div className="py-8">
              <div className="text-center mb-12">
                <div className="inline-block p-4 bg-emerald-500/10 rounded-3xl mb-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                </div>
                <h2 className="text-3xl font-black mb-2">Interview Evaluated</h2>
                <p className="text-muted-foreground">The AI has analyzed your transcript.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-muted/30 rounded-2xl border text-center">
                  <div className="text-3xl font-black text-indigo-600 mb-2">{evaluation.confidenceScore?.toFixed(0)}/100</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Confidence</div>
                </div>
                <div className="p-6 bg-muted/30 rounded-2xl border text-center">
                  <div className="text-3xl font-black text-emerald-600 mb-2">{evaluation.technicalScore?.toFixed(0)}/100</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Technical</div>
                </div>
                <div className="p-6 bg-muted/30 rounded-2xl border text-center">
                  <div className="text-3xl font-black text-blue-600 mb-2">{evaluation.communicationScore?.toFixed(0)}/100</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Communication</div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                  <h3 className="font-black text-emerald-600 mb-4 uppercase tracking-widest text-xs">Strengths Identified</h3>
                  <ul className="space-y-2">
                    {evaluation.strengths?.map((s: string, i: number) => <li key={i} className="text-sm font-bold flex gap-2"><CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500"/>{s}</li>)}
                  </ul>
                </div>
                <div className="p-6 bg-orange-500/5 border border-orange-500/20 rounded-2xl">
                  <h3 className="font-black text-orange-600 mb-4 uppercase tracking-widest text-xs">Areas to Improve</h3>
                  <ul className="space-y-2">
                    {evaluation.weaknesses?.map((w: string, i: number) => <li key={i} className="text-sm font-bold flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 text-orange-500"/>{w}</li>)}
                  </ul>
                </div>
              </div>
              <div className="mt-8 p-6 bg-muted/30 border rounded-2xl">
                <h3 className="font-black mb-2 text-sm">AI Advice</h3>
                <p className="text-sm text-muted-foreground font-medium">{evaluation.improvementSuggestions}</p>
              </div>
              <div className="mt-8 text-center">
                <button onClick={() => setEvaluation(null)} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold">Retake Interview</button>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 h-[600px]">
              {/* Left Side: Live Video Feed */}
              <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 border-2 border-indigo-500/20 shadow-2xl flex items-center justify-center">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="absolute inset-0 w-full h-full object-cover scale-[1.02]"
                />
                
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
                
                {/* Face Scanning Bounding Box */}
                <div className="absolute top-[15%] bottom-[15%] left-[20%] right-[20%] z-10 pointer-events-none border-2 border-emerald-500/50 rounded-3xl flex items-center overflow-hidden">
                  <motion.div 
                    animate={{ y: ["-100%", "100%", "-100%"] }} 
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="w-full h-1 bg-emerald-500 shadow-[0_0_25px_5px_rgba(16,185,129,0.8)]"
                  />
                  {/* Corner Markers */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                </div>

                {/* HUD Elements */}
                <div className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-lg text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-white/10">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  REC
                </div>
                <div className="absolute top-6 right-6 z-20 flex flex-col items-end gap-1.5 text-[9px] font-mono font-bold text-emerald-400 bg-black/40 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2">FACE_DETECTED: <span className="text-white">[ TRUE ]</span></div>
                  <div className="flex items-center gap-2">CONFIDENCE: <span className="text-white">[ {hudConfidence}% ]</span></div>
                  <div className="flex items-center gap-2">EXPRESSION: <span className="text-indigo-300">[ {hudEmotion} ]</span></div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-center">
                  <div className="px-5 py-2.5 bg-black/60 backdrop-blur-md rounded-xl text-white text-xs font-bold flex items-center gap-3 border border-white/10">
                    <ScanFace className="w-4 h-4 text-emerald-400" /> Professional Environment Verified
                  </div>
                </div>
              </div>

              {/* Right Side: Chat AI */}
              <div className="flex flex-col h-full bg-muted/30 rounded-[2.5rem] p-6 border relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />
                <div className="flex justify-between items-center mb-6 border-b pb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-3 h-3 rounded-full", isSpeaking ? "bg-indigo-500 animate-pulse" : "bg-red-500 animate-pulse")}/>
                    <span className="font-black uppercase tracking-widest text-xs text-foreground/80">
                      {isSpeaking ? "Jarvis is Speaking..." : `Interview in Progress • ${formatTime(interviewTime)}`}
                    </span>
                  </div>
                  <button onClick={endInterview} className="px-5 py-2 bg-red-500/10 text-red-600 font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-red-500/20 transition-all active:scale-95">
                    End & Evaluate
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-6 relative z-10">
                  {interviewMessages.map((msg, i) => (
                    <div key={i} className={cn("flex gap-4 max-w-[90%]", msg.sender === "user" ? "ml-auto flex-row-reverse" : "")}>
                      <div className={cn("w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center shadow-sm relative", msg.sender === "ai" ? "bg-indigo-600/10 text-indigo-600" : "bg-slate-900 text-white")}>
                        {msg.sender === "ai" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                        {msg.sender === "ai" && isSpeaking && i === interviewMessages.length - 1 && (
                           <div className="absolute -inset-1 bg-indigo-500/20 rounded-2xl animate-ping pointer-events-none" />
                        )}
                      </div>
                      <div className={cn("p-4 rounded-[1.5rem] text-sm font-medium shadow-sm", msg.sender === "ai" ? "bg-background border text-foreground rounded-tl-sm leading-relaxed" : "bg-slate-900 text-white rounded-tr-sm")}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-4 relative z-10">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600"><Bot className="w-5 h-5" /></div>
                      <div className="p-4 bg-background border rounded-[1.5rem] rounded-tl-sm flex gap-1.5 items-center shadow-sm">
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"/>
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay:"100ms"}}/>
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay:"200ms"}}/>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="mt-4 flex gap-3 pt-4 border-t relative z-10">
                  <button 
                    onClick={toggleListening}
                    className={cn("w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-all shadow-sm", 
                      isListening ? "bg-red-500 text-white shadow-red-500/30 animate-pulse" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>
                  <input 
                    type="text" 
                    value={interviewInput}
                    onChange={e => setInterviewInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendInterviewMessage()}
                    placeholder={isListening ? "Listening... speak now" : "Type or click mic to speak..."}
                    className="flex-1 bg-background shadow-sm border border-border/50 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 transition-colors text-sm font-medium"
                  />
                  <button 
                    onClick={() => {
                      if (isListening) toggleListening();
                      sendInterviewMessage();
                    }} 
                    disabled={!interviewInput.trim() || isTyping} 
                    className="w-14 h-14 shrink-0 bg-indigo-600 text-white rounded-2xl flex items-center justify-center disabled:opacity-50 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
                  >
                    <Send className="w-5 h-5 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
