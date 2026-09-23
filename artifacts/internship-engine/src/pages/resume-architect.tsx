import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Sparkles, Download, CheckCircle2, Zap, ArrowRight, Plus, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ResumeArchitectPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [score, setScore] = useState(72);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [userName, setUserName] = useState("Kartik Sharma");
  const [role, setRole] = useState("Full Stack Developer");
  const [experience, setExperience] = useState([
    { title: "Senior Software Intern", company: "Google Cloud Platform", period: "2023 - Present", bullets: ["Developed a distributed caching layer that handled 1M+ requests per second.", "Optimized database queries leading to a 30% reduction in cloud infrastructure costs.", "Collaborated with AI teams to integrate LLMs into core search products."] },
    { title: "Frontend Developer", company: "Tech Startup", period: "2021 - 2022", bullets: ["Built a high-fidelity dashboard using React and TailwindCSS.", "Reduced bundle size by 40% through code splitting."] }
  ]);

  const handleExportJSON = () => {
    const content = JSON.stringify({ userName, role, experience }, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${userName}_Resume_Data.json`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleImport = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      if (file.name.endsWith('.pdf') || file.type === 'application/pdf') {
        toast.info("AI is extracting data from your PDF...", { duration: 3000 });
        setIsOptimizing(true);
        const formData = new FormData();
        formData.append("resume", file);
        try {
          const res = await fetch("/api/ai/parse-resume-architect", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (res.ok) {
            if (data.userName) setUserName(data.userName);
            if (data.role) setRole(data.role);
            if (data.experience) setExperience(data.experience);
            setScore(85);
            toast.success("PDF data extracted successfully!");
          } else {
            toast.error(data.error || "Failed to extract data from PDF.");
          }
        } catch (err) {
          console.error("PDF extraction error", err);
          toast.error("Network error during PDF extraction.");
        }
        setIsOptimizing(false);
        e.target.value = null;
        return;
      }

      if (!file.name.endsWith('.json') && file.type !== 'application/json') {
        toast.error("Invalid file format. Please upload a JSON or PDF file.");
        e.target.value = null;
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.userName) setUserName(data.userName);
          if (data.role) setRole(data.role);
          if (data.experience) setExperience(data.experience);
          setScore(88);
          toast.success("Resume data imported successfully!");
        } catch (err) {
          console.error("Import failed", err);
          toast.error("Failed to parse the file. Ensure it is a valid exported JSON.");
        }
        e.target.value = null;
      };
      reader.readAsText(file);
    }
  };

  const [showAiInsights, setShowAiInsights] = useState(true);

  const optimizationPoints = [
    { label: "Action Verbs", status: "good", desc: "Used 12 strong action verbs." },
    { label: "Quantifiable Impact", status: "warning", desc: "Add more metrics to your experience." },
    { label: "Keyword Matching", status: "good", desc: "85% match with SDE roles." },
    { label: "Formatting", status: "good", desc: "Clean, ATS-friendly structure." },
  ];

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setScore(94);
      setIsOptimizing(false);
    }, 2000);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Intelligence Suite</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Resume <span className="text-indigo-600">Architect</span></h1>
          <p className="text-muted-foreground font-medium">AI-driven resume generation with real-time ATS optimization.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="px-5 py-3 bg-muted rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted/80 transition-all flex items-center gap-2 cursor-pointer border border-border/50">
            <Plus className="w-4 h-4" /> Import Data
            <input type="file" accept=".json,.pdf" className="hidden" onChange={handleImport} />
          </label>
          <button 
            onClick={handleExportJSON}
            className="px-5 py-3 bg-muted rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted/80 transition-all flex items-center gap-2 border border-border/50"
          >
            <Download className="w-4 h-4" /> Export Data
          </button>
          <button 
            onClick={handlePrint}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Editor Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-2xl rounded-full" />
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black">Optimization Center</h3>
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-black uppercase text-muted-foreground">AI Pulse</span>
                <button 
                  onClick={() => setShowAiInsights(!showAiInsights)}
                  className={cn(
                    "w-8 h-4 rounded-full relative transition-all duration-300",
                    showAiInsights ? "bg-indigo-600" : "bg-muted"
                  )}
                >
                  <motion.div 
                    animate={{ x: showAiInsights ? 16 : 2 }}
                    className="absolute top-1 w-2 h-2 bg-white rounded-full"
                  />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-8">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle className="text-muted/20" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                  <motion.circle 
                    className="text-indigo-600" 
                    strokeWidth="8" 
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * score) / 100}
                    strokeLinecap="round" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r="40" cx="50" cy="50" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black">{score}</span>
                  <span className="text-[8px] font-black uppercase text-muted-foreground">ATS Score</span>
                </div>
              </div>
              <div className="flex-1 ml-6">
                <p className="text-xs font-bold text-muted-foreground leading-relaxed">Your resume is better than <span className="text-indigo-600 font-black">88%</span> of applicants in this domain.</p>
              </div>
            </div>

            <AnimatePresence>
              {showAiInsights && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 mb-8 overflow-hidden"
                >
                  {optimizationPoints.map((pt) => (
                    <div key={pt.label} className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest">{pt.label}</span>
                        {pt.status === "good" ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Zap className="w-3 h-3 text-amber-500" />}
                      </div>
                      <p className="text-[11px] font-medium text-muted-foreground">{pt.desc}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 overflow-hidden relative"
            >
              <AnimatePresence mode="wait">
                {isOptimizing ? (
                  <motion.div 
                    key="loading"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 animate-pulse" /> Neural Optimizing...
                  </motion.div>
                ) : (
                  <motion.div 
                    key="idle"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Wand2 className="w-4 h-4" /> AI Hyper-Optimize
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          <div className="p-6 bg-indigo-600 rounded-[2rem] text-white shadow-2xl shadow-indigo-600/30">
            <h3 className="font-black mb-2 flex items-center gap-2 text-sm uppercase tracking-widest">
              <Zap className="w-4 h-4 fill-current" /> Pro Tip
            </h3>
            <p className="text-xs font-medium leading-relaxed opacity-80">
              Mentioning specific technologies like "Kubernetes" or "GraphQL" in your summary can boost ATS visibility by 40% for backend roles.
            </p>
          </div>
        </div>

        {/* Live Preview / Editor */}
        <div className="lg:col-span-8">
          <div className="glass-card rounded-[3rem] p-12 min-h-[800px] shadow-2xl relative overflow-hidden bg-white dark:bg-[#0a0a0a]">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12 pb-12 border-b border-border/50">
                <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter cursor-text outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-2" contentEditable onBlur={(e) => setUserName(e.currentTarget.textContent || "")}>{userName}</h2>
                <div className="flex justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <span contentEditable onBlur={(e) => setRole(e.currentTarget.textContent || "")}>{role}</span>
                  <span className="w-1 h-1 bg-border rounded-full self-center" />
                  <span>Delhi, India</span>
                  <span className="w-1 h-1 bg-border rounded-full self-center" />
                  <span>kartik@example.com</span>
                </div>
              </div>

              <div className="space-y-12">
                <section>
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-600 mb-6">Professional Summary</h3>
                  <p className="text-sm font-medium leading-relaxed text-foreground/80 italic">
                    "High-performing full-stack engineer with 3+ years of experience in building scalable AI-driven applications. Expert in React, Node.js, and Distributed Systems. Proven track record of reducing latency by 40% in enterprise-grade platforms."
                  </p>
                </section>

                <section>
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-600 mb-6">Experience</h3>
                  <div className="space-y-8">
                    {experience.map((exp, i) => (
                      <div key={i} className="group cursor-text p-4 -mx-4 rounded-2xl hover:bg-muted/30 transition-all border border-transparent hover:border-border/50">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-black text-lg outline-none" contentEditable onBlur={(e) => {
                            const newExp = [...experience];
                            newExp[i].title = e.currentTarget.textContent || "";
                            setExperience(newExp);
                          }}>{exp.title}</h4>
                          <span className="text-[10px] font-black uppercase tracking-widest bg-muted px-2 py-1 rounded-md">{exp.period}</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600/60 mb-3">{exp.company}</p>
                        <ul className="space-y-2 list-disc list-inside text-sm font-medium text-muted-foreground leading-relaxed">
                          {exp.bullets.map((bullet, bi) => (
                            <li key={bi} contentEditable className="outline-none" onBlur={(e) => {
                              const newExp = [...experience];
                              newExp[i].bullets[bi] = e.currentTarget.textContent || "";
                              setExperience(newExp);
                            }}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-600 mb-6">Core Competencies</h3>
                  <div className="flex flex-wrap gap-2">
                    {["React", "TypeScript", "Node.js", "Python", "Docker", "AWS", "Machine Learning", "System Design"].map(skill => (
                      <span key={skill} className="px-4 py-2 bg-muted/50 rounded-xl text-[10px] font-black uppercase tracking-widest border border-border/50">{skill}</span>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            {/* AI Assistant Tooltip */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute bottom-8 right-8 bg-slate-900 text-white p-6 rounded-3xl shadow-3xl max-w-xs border border-white/10"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">AI Suggestion</span>
              </div>
              <p className="text-[11px] font-medium opacity-80 leading-relaxed mb-4">
                "I noticed you mentioned 'Developed a layer'. Try replacing it with <span className="text-indigo-400 font-bold">'Architected and Scaled'</span> to sound more authoritative for senior roles."
              </p>
              <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Apply Change</button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
