import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { Trophy, Github, Star, GitCommit, Target, Code2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActiveStudent } from "@/components/Layout";

export default function GithubGamificationPage() {
  const id = useActiveStudent();
  const [gamification, setGamification] = useState<any>(null);
  const [githubMetrics, setGithubMetrics] = useState<any>(null);
  const [githubUsername, setGithubUsername] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [gRes, ghRes] = await Promise.all([
        fetch(`http://localhost:8080/api/gamification/${id}`),
        fetch(`http://localhost:8080/api/github/${id}`)
      ]);
      if (gRes.ok) setGamification(await gRes.json());
      if (ghRes.ok) setGithubMetrics(await ghRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchStats();
  }, [id]);

  const syncGithub = async (overrideUsername?: string) => {
    const targetUsername = overrideUsername || githubUsername || githubMetrics?.githubUsername;
    if (!targetUsername) return;
    setSyncing(true);
    try {
      const res = await fetch(`http://localhost:8080/api/github/sync/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubUsername: targetUsername })
      });
      if (res.ok) {
        await fetchStats();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  const unlinkGithub = async () => {
    try {
      setSyncing(true);
      await fetch(`http://localhost:8080/api/github/${id}`, { method: "DELETE" });
      setGithubMetrics(null);
      setGithubUsername("");
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xl font-bold animate-pulse">Loading AI Developer Rank...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-900 rounded-xl text-white">
              <Trophy className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Global Rank Center</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Developer <span className="text-slate-900 dark:text-slate-100">Rank</span></h1>
          <p className="text-muted-foreground font-medium">Link your GitHub and let AI calculate your credibility score.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 glass-card p-8 rounded-[2.5rem] bg-slate-900 text-white flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/20 rotate-12 group-hover:rotate-0 transition-transform">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Current Level</div>
          <div className="text-6xl font-black mb-6">{gamification?.level || 1}</div>
          
          <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
            <div 
              className="bg-indigo-500 h-full transition-all duration-1000" 
              style={{ width: `${((gamification?.xpPoints || 0) % 1000) / 10}%` }} 
            />
          </div>
          <div className="flex justify-between w-full text-[10px] font-bold text-slate-400">
            <span>{gamification?.xpPoints || 0} XP</span>
            <span>Next Lvl: {((gamification?.level || 1)) * 1000} XP</span>
          </div>

          <div className="w-full h-[1px] bg-slate-800 my-8" />
          
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Current Streak</span>
              <span className="text-sm font-black text-orange-400 flex items-center gap-1"><Zap className="w-4 h-4"/> {gamification?.currentStreak || 0} Days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Highest Streak</span>
              <span className="text-sm font-black text-white">{gamification?.highestStreak || 0} Days</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Github className="w-32 h-32" />
            </div>
            
            <h3 className="font-black text-xl mb-6 flex items-center gap-2 relative z-10">
              <Github className="w-6 h-6" /> GitHub AI Analysis
            </h3>

            {!githubMetrics ? (
              <div className="relative z-10 flex gap-4">
                <input 
                  type="text" 
                  placeholder="Enter GitHub Username" 
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className="flex-1 bg-muted/50 border-2 border-transparent focus:border-primary px-6 py-4 rounded-2xl outline-none font-bold text-sm transition-all"
                />
                <button 
                  onClick={() => syncGithub()}
                  disabled={syncing}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  {syncing ? "Syncing..." : "Connect AI"}
                </button>
              </div>
            ) : (
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <Github className="w-8 h-8 text-slate-900" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black">{githubMetrics.githubUsername}</h4>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">AI Synchronized</p>
                  </div>
                  <div className="ml-auto flex gap-4 text-center">
                    <div className="flex flex-col gap-2 mr-4 justify-center">
                      <button 
                        onClick={() => syncGithub(githubMetrics.githubUsername)}
                        disabled={syncing}
                        className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 bg-indigo-500/10 text-indigo-500 rounded-lg hover:bg-indigo-500/20 transition-all disabled:opacity-50"
                      >
                        {syncing ? "Syncing..." : "Refresh Stats"}
                      </button>
                      <button 
                        onClick={unlinkGithub}
                        className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all"
                      >
                        Unlink / Change
                      </button>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-emerald-500">{githubMetrics.developerCredibilityScore?.toFixed(0)}</div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Credibility</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-indigo-500">{githubMetrics.codingActivityScore?.toFixed(0)}</div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Activity</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                    <Target className="w-5 h-5 text-muted-foreground mb-2" />
                    <div className="text-xl font-black">{githubMetrics.totalRepos}</div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Repositories</div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                    <GitCommit className="w-5 h-5 text-muted-foreground mb-2" />
                    <div className="text-xl font-black">{githubMetrics.totalCommits}</div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Commits (1y)</div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                    <Code2 className="w-5 h-5 text-muted-foreground mb-2" />
                    <div className="text-xl font-black">{githubMetrics.totalPRs}</div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Pull Requests</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
