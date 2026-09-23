import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Github, GitPullRequest, Star, Zap, Sparkles, Terminal, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OpenSourceHubPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [issues, setIssues] = useState<any[]>([]);

  const handleScan = async () => {
    setAnalyzing(true);
    setIssues([]);
    try {
      const response = await fetch("/api/ai/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "open-source", studentId: 1 })
      });
      const data = await response.json();
      if (data.repos) {
        setIssues(data.repos.map((r: any, i: number) => ({ id: i, ...r })));
      }
    } catch (e) {
      console.error("Failed to scan repos", e);
      setIssues([
        { id: 1, repo: "facebook/react", title: "Optimize Reconciler for Suspense", difficulty: "High", bounty: "$500", match: 96, tags: ["React", "Performance"] },
        { id: 2, repo: "tailwindlabs/tailwindcss", title: "Add support for dynamic grid fractions", difficulty: "Medium", bounty: "Swag", match: 88, tags: ["CSS", "JS"] },
      ]);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-900 rounded-xl text-white shadow-lg">
              <Github className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Contribution Intelligence</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Open Source <span className="text-indigo-600">Hub</span></h1>
          <p className="text-muted-foreground font-medium">AI-matched GitHub issues that align with your skill profile and boost your developer rank.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-card p-10 rounded-[3.5rem] relative overflow-hidden">
             <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto mb-12">
                <div className="w-16 h-16 bg-muted rounded-[1.5rem] flex items-center justify-center mb-6 shadow-inner">
                   <GitPullRequest className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-black mb-4">Discover Your Impact</h3>
                <p className="text-sm text-muted-foreground font-medium mb-8 italic">"We'll analyze your past commits and current tech stack to find open-source issues where you can make a meaningful contribution today."</p>
                <button 
                  onClick={handleScan}
                  disabled={analyzing}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  {analyzing ? (
                    <>
                      <Terminal className="w-4 h-4 animate-spin" />
                      Scanning Repositories...
                    </>
                  ) : (
                    <>
                      <Star className="w-4 h-4" />
                      Scan for Issues
                    </>
                  )}
                </button>
             </div>

             <AnimatePresence>
                {issues.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid gap-6"
                  >
                    {issues.map((issue) => (
                      <div key={issue.id} className="p-8 bg-muted/30 rounded-[2.5rem] border border-border/50 group hover:border-indigo-600/30 transition-all flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                             <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{issue.repo}</span>
                             <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black rounded-full uppercase">{issue.match}% Match</span>
                          </div>
                          <h4 className="text-sm font-black mb-3">{issue.title}</h4>
                          <div className="flex gap-2">
                            {(issue.tags || []).map((t: string) => (
                              <span key={t} className="text-[8px] font-black text-muted-foreground uppercase tracking-widest bg-muted px-2 py-1 rounded-md">{t}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-6 shrink-0">
                           <div className="text-center">
                              <div className="text-xs font-black text-indigo-600">{issue.bounty}</div>
                              <div className="text-[8px] font-black uppercase text-muted-foreground">Reward</div>
                           </div>
                           <button className="px-6 py-3 bg-white border border-border rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center gap-2">
                             View Issue <ArrowRight className="w-3 h-3" />
                           </button>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden">
             <Sparkles className="absolute top-4 right-4 w-12 h-12 opacity-10" />
             <h3 className="font-black text-sm uppercase tracking-widest mb-6">Dev Reputation</h3>
             <div className="space-y-6">
                <div className="flex flex-col gap-2">
                   <div className="flex justify-between text-[10px] font-black uppercase">
                      <span>OSS Impact Factor</span>
                      <span>Level 4</span>
                   </div>
                   <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: "65%" }} className="h-full bg-indigo-500" />
                   </div>
                </div>
                <p className="text-[10px] font-bold opacity-60 leading-relaxed italic">
                  "Contributing to 2 more 'High Match' issues will elevate your rank to 'Elite Contributor', increasing recruiter views by 35%."
                </p>
             </div>
          </div>

          <div className="p-8 bg-indigo-50 border-2 border-indigo-200 rounded-[2.5rem]">
            <h3 className="font-black text-sm mb-4 uppercase tracking-widest flex items-center gap-2 text-indigo-600">
              <Zap className="w-4 h-4" /> Quick Hack
            </h3>
            <p className="text-xs font-bold text-indigo-900/60 leading-relaxed italic">
              "We found 3 documentation issues in 'Next.js' that perfectly match your blog history. These are great for building initial repo trust."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
