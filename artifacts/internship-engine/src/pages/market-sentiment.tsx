import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Zap, Globe, Activity, ShieldCheck, AlertCircle, TrendingDown } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

const sentimentData = [
  { time: "08:00", sentiment: 72, volume: 45 },
  { time: "10:00", sentiment: 78, volume: 60 },
  { time: "12:00", sentiment: 85, volume: 55 },
  { time: "14:00", sentiment: 82, volume: 80 },
  { time: "16:00", sentiment: 90, volume: 95 },
  { time: "18:00", sentiment: 88, volume: 70 },
];

export default function MarketSentimentPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchSentiment = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/ai/intelligence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ module: "market-sentiment", studentId: 1 })
        });
        const result = await response.json();
        setData(result);
      } catch (e) {
        console.error("Failed to fetch sentiment", e);
      } finally {
        setLoading(false);
      }
    };
    fetchSentiment();
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-600/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Market Intelligence</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Market <span className="text-emerald-600">Sentiment</span></h1>
          <p className="text-muted-foreground font-medium">Real-time macro-analysis of global hiring velocity and industry confidence.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-5 py-2.5 bg-emerald-500/10 text-emerald-600 rounded-2xl border border-emerald-500/20 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest">{data?.status || "Analyzing Market..."}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-card p-10 rounded-[3.5rem] relative overflow-hidden">
             <div className="flex items-center justify-between mb-12">
                <div>
                   <h3 className="text-xl font-black italic">Hiring Velocity Index</h3>
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">24H Aggregate Feed</p>
                </div>
                <div className="flex gap-6">
                   <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                      <span className="text-[10px] font-black uppercase text-muted-foreground">Sentiment</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-muted rounded-full" />
                      <span className="text-[10px] font-black uppercase text-muted-foreground">Volume</span>
                   </div>
                </div>
             </div>

             <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={sentimentData}>
                      <defs>
                        <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: "#94a3b8" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: "#94a3b8" }} />
                      <Tooltip contentStyle={{ borderRadius: "20px", border: "none", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", fontWeight: 900 }} />
                      <Area type="monotone" dataKey="sentiment" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorSentiment)" />
                      <Area type="monotone" dataKey="volume" stroke="#94a3b8" strokeWidth={2} fillOpacity={0.1} fill="#94a3b8" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
             {(data?.sectors || [
               { label: "AI & ML", trend: "Extreme", icon: Zap, color: "text-primary" },
               { label: "Cloud Infra", trend: "High", icon: Globe, color: "text-blue-500" },
               { label: "Fintech", trend: "Stable", icon: Activity, color: "text-amber-500" },
             ]).map((sector: any, i: number) => {
               const Icon = sector.icon || Activity;
               return (
                <div key={i} className="p-8 bg-muted/20 border border-border/50 rounded-[2.5rem] hover:scale-105 transition-all group">
                   <Icon className={cn("w-6 h-6 mb-4 group-hover:scale-110 transition-transform", sector.color)} />
                   <h4 className="font-black text-sm mb-1">{sector.label}</h4>
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{sector.trend} Demand</p>
                </div>
               );
             })}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="glass-card p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden">
              <h3 className="font-black text-sm uppercase tracking-widest mb-6">Market Signal</h3>
              <div className="flex flex-col gap-8">
                 {(data?.signals || [
                   { title: "Expansion Phase", desc: "Large-cap tech companies have increased 'Intern' and 'New Grad' headcount by 14% over the last 30 days.", type: "Bullish" },
                   { title: "Waitlist Surge", desc: "Application volume is currently at peak levels. Expect response times to increase to 14-21 days.", type: "Neutral" }
                 ]).map((signal: any, i: number) => (
                   <div key={i} className={cn("p-6 rounded-2xl border", signal.type === 'Bullish' ? "bg-emerald-500/10 border-emerald-500/20" : "bg-amber-500/10 border-amber-500/20")}>
                      <div className="flex items-center gap-3 mb-4">
                         {signal.type === 'Bullish' ? <TrendingUp className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-amber-500" />}
                         <span className="text-xl font-black tracking-tight">{signal.title}</span>
                      </div>
                      <p className="text-[11px] font-medium leading-relaxed opacity-60">{signal.desc}</p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="p-8 bg-emerald-600 rounded-[2.5rem] text-white">
              <div className="flex items-center gap-3 mb-6">
                 <ShieldCheck className="w-6 h-6 opacity-60" />
                 <h3 className="font-black text-sm uppercase tracking-widest">Trade Execution</h3>
              </div>
              <p className="text-sm font-bold leading-relaxed mb-8 italic">"The market is currently rewarding candidates with strong 'System Design' fundamentals over pure 'Leeting' capability."</p>
              <button className="w-full py-4 bg-white text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Optimize Strategy</button>
           </div>
        </div>
      </div>
    </div>
  );
}
