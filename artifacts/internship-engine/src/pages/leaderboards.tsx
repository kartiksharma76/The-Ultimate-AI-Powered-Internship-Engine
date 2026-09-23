import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Star, Target, Zap, Shield, Crown, Search, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  studentId: number;
  name: string;
  avatarUrl: string | null;
  xpPoints: number;
  level: number;
  badges: any[];
}

export default function LeaderboardsPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"global" | "institute" | "state">("global");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/leaderboard/global");
        if (response.ok) {
          const data = await response.json();
          setLeaderboard(data);
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const filteredLeaderboard = leaderboard.filter(entry => 
    entry.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRankIcon = (rank: number) => {
    if (rank === 0) return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500/20" />;
    if (rank === 1) return <Medal className="w-6 h-6 text-slate-300 fill-slate-300/20" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-amber-600 fill-amber-600/20" />;
    return <div className="w-6 h-6 flex items-center justify-center font-black text-xs text-muted-foreground">{rank + 1}</div>;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500/10 rounded-xl">
              <Trophy className="w-5 h-5 text-yellow-500" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Competency Index</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Developer <span className="text-gradient">Rankings</span></h1>
          <p className="text-muted-foreground font-medium italic max-w-lg">
            Real-time synchronization of <span className="text-foreground font-black">Global Talent</span> based on AI scores, coding activity, and platform engagement.
          </p>
        </div>

        <div className="flex flex-col gap-4">
           <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search developers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-6 py-4 bg-muted/30 border-2 border-border/50 rounded-2xl text-sm font-bold w-full md:w-[300px] focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
            />
          </div>
          <div className="flex bg-muted/50 p-1.5 rounded-2xl border border-border/50">
            {["global", "institute", "state"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as any)}
                className={cn(
                  "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeFilter === filter ? "bg-background shadow-md text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-20 bg-muted/20 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Top 3 Spotlight */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Top Performers</h3>
            {filteredLeaderboard.slice(0, 3).map((entry, i) => (
              <motion.div 
                key={entry.studentId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "glass-card p-6 rounded-[2rem] border relative overflow-hidden group",
                  i === 0 ? "border-yellow-500/30 bg-yellow-500/5" : 
                  i === 1 ? "border-slate-300/30 bg-slate-300/5" : 
                  "border-amber-600/30 bg-amber-600/5"
                )}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all">
                  {i === 0 ? <Crown className="w-16 h-16" /> : <Medal className="w-16 h-16" />}
                </div>
                <div className="flex flex-col items-center text-center relative z-10">
                  <div className="relative mb-4">
                    <div className={cn(
                      "w-20 h-20 rounded-full border-4 p-1",
                      i === 0 ? "border-yellow-500" : i === 1 ? "border-slate-300" : "border-amber-600"
                    )}>
                      {entry.avatarUrl ? (
                        <img src={entry.avatarUrl} alt={entry.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <div className="w-full h-full rounded-full bg-muted flex items-center justify-center text-xl font-black">
                          {typeof entry.name === "string" ? entry.name[0] : (entry.name as any)?.employee?.[0] || "?"}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-foreground text-background text-[10px] font-black rounded-full">
                      #{i + 1}
                    </div>
                  </div>
                  <h4 className="font-black text-lg mb-1">
                    {typeof entry.name === "string" ? entry.name : (entry.name as any)?.employee || "Unknown Developer"}
                  </h4>
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-3 h-3 text-primary fill-primary" />
                    <span className="text-xs font-black text-primary uppercase tracking-widest">{entry.xpPoints.toLocaleString()} XP</span>
                  </div>
                  <div className="flex gap-1">
                    {entry.badges?.slice(0, 3).map((badge, bi) => (
                      <div key={bi} className="w-8 h-8 bg-muted/50 rounded-lg flex items-center justify-center border border-border/50" title={typeof badge === 'string' ? badge : JSON.stringify(badge)}>
                        <Shield className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Leaderboard Table */}
          <div className="lg:col-span-3">
            <div className="glass-card rounded-[2.5rem] overflow-hidden border-border/30">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/20 border-b border-border/50">
                      <th className="text-left px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-20">Rank</th>
                      <th className="text-left px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Developer</th>
                      <th className="text-center px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Level</th>
                      <th className="text-right px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">XP Score</th>
                      <th className="text-right px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Trending</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {filteredLeaderboard.map((entry, i) => (
                      <motion.tr 
                        key={entry.studentId}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className={cn(
                          "group hover:bg-muted/10 transition-all",
                          i < 3 ? "bg-muted/5" : ""
                        )}
                      >
                        <td className="px-8 py-6">
                          <div className="flex justify-center">
                            {getRankIcon(i)}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-border/50 bg-muted">
                              {entry.avatarUrl ? (
                                <img src={entry.avatarUrl} alt={entry.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground">
                                  {typeof entry.name === "string" ? entry.name[0] : (entry.name as any)?.employee?.[0] || "?"}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-black group-hover:text-primary transition-colors">
                                {typeof entry.name === "string" ? entry.name : (entry.name as any)?.employee || "Unknown"}
                              </div>
                              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                {entry.studentId === 1 ? "Elite Neural Architect" : "Candidate"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-black text-xs border border-primary/20">
                            {entry.level}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="font-black text-sm tabular-nums">{entry.xpPoints.toLocaleString()}</div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-1.5 text-emerald-500 font-bold text-xs">
                            <TrendingUp className="w-3 h-3" />
                            +{(Math.random() * 500).toFixed(0)}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {filteredLeaderboard.length === 0 && (
              <div className="text-center py-20">
                <Users className="w-12 h-12 text-muted/30 mx-auto mb-4" />
                <h3 className="text-lg font-black text-muted-foreground">No developers found matching your search.</h3>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
