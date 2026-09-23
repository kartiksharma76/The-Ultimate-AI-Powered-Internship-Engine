import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Sparkles, Target, Zap, ArrowUpRight, BarChart3, LineChart, PieChart, CheckCircle2 } from "lucide-react";
import { ResponsiveContainer, LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from "recharts";
import { cn } from "@/lib/utils";

const defaultProjection = [
  { month: "Jan", salary: 12, trajectory: 12 },
  { month: "Mar", salary: 14, trajectory: 16 },
  { month: "May", salary: 15, trajectory: 22 },
  { month: "Jul", salary: 18, trajectory: 35 },
  { month: "Sep", salary: 22, trajectory: 48 },
  { month: "Nov", salary: 25, trajectory: 65 },
];

export default function CareerMultiplierPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [projectionData, setProjectionData] = useState<any[]>(defaultProjection);

  const handlePredict = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch("/api/ai/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "career-multiplier", studentId: 1 })
      });
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setProjectionData(data);
      }
    } catch (e) {
      console.error("Failed to predict", e);
    } finally {
      setAnalyzing(false);
    }
  };
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Predictive Intelligence</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Career <span className="text-indigo-600">Multiplier</span></h1>
          <p className="text-muted-foreground font-medium">Predicting your growth trajectory using global market trends and AI scoring.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Projected LCTC</div>
            <div className="text-2xl font-black text-indigo-600">$185,000</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <div className="glass-card p-8 rounded-[2.5rem] border-indigo-600/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <Target className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-black text-sm uppercase tracking-widest">Skill Velocity</h3>
          </div>
          <div className="text-4xl font-black mb-2">+42%</div>
          <p className="text-xs font-bold text-muted-foreground mb-6">Your learning speed is in the top 5% of all users this month.</p>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: "42%" }} className="h-full bg-indigo-600" />
          </div>
        </div>

        <div className="glass-card p-8 rounded-[2.5rem] border-emerald-600/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-black text-sm uppercase tracking-widest">Match Multiplier</h3>
          </div>
          <div className="text-4xl font-black mb-2">2.8x</div>
          <p className="text-xs font-bold text-muted-foreground mb-6">AI predicts your interview call rates will triple by Q3.</p>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: "70%" }} className="h-full bg-emerald-600" />
          </div>
        </div>

        <div className="glass-card p-8 rounded-[2.5rem] border-amber-600/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-black text-sm uppercase tracking-widest">Market Alignment</h3>
          </div>
          <div className="text-4xl font-black mb-2">94%</div>
          <p className="text-xs font-bold text-muted-foreground mb-6">Your tech stack perfectly matches high-growth fintech demands.</p>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: "94%" }} className="h-full bg-amber-600" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-card p-10 rounded-[3rem] h-full relative overflow-hidden">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-xl font-black">Trajectory Projection</h3>
                <p className="text-sm text-muted-foreground font-medium">Standard growth vs AI-Multiplied path</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full" />
                  <span className="text-[10px] font-black uppercase text-muted-foreground">AI Path</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-muted rounded-full" />
                  <span className="text-[10px] font-black uppercase text-muted-foreground">Organic</span>
                </div>
              </div>
            </div>

            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData}>
                  <defs>
                    <linearGradient id="colorTrajectory" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: "#94a3b8" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: "#94a3b8" }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", fontWeight: 900 }}
                  />
                  <Area type="monotone" dataKey="trajectory" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorTrajectory)" />
                  <Area type="monotone" dataKey="salary" stroke="#94a3b8" strokeWidth={2} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] bg-slate-900 text-white">
            <h3 className="font-black text-sm uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> AI Growth Strategy
            </h3>
            <div className="space-y-6">
              {[
                { title: "Switch to Rust", desc: "Learning Rust will open high-frequency trading roles with 2x salary.", impact: "+$40k" },
                { title: "System Design Mastery", desc: "Complete 4 more system design mocks to unlock Staff level roles.", impact: "+25%" },
                { title: "Open Source Proof", desc: "2 major contributions to Kubernetes will boost global visibility.", impact: "Elite" },
              ].map((step, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-black text-xs group-hover:text-indigo-400 transition-colors">{step.title}</h4>
                    <span className="text-[9px] font-black bg-indigo-500/20 px-2 py-0.5 rounded text-indigo-300">{step.impact}</span>
                  </div>
                  <p className="text-[11px] font-medium opacity-60 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
            <button 
              onClick={handlePredict}
              disabled={analyzing}
              className="w-full mt-8 py-4 bg-indigo-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all"
            >
              {analyzing ? "Simulating Future Nodes..." : "Generate AI Roadmap"}
            </button>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border-indigo-600/10">
            <h3 className="font-black text-sm uppercase tracking-widest mb-4">Milestone Tracker</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">AWS Certified Architect</span>
              </div>
              <div className="flex items-center gap-4 opacity-40">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                </div>
                <span className="text-xs font-bold">Google L4 Equivalent Score</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
