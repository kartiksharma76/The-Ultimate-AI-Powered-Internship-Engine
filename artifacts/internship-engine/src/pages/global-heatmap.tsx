import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Globe, Search, Zap, Filter, Users, Building2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const defaultHotspots = [
  { city: "San Francisco", demand: "High", salary: "$165k", domain: "AI/ML", color: "bg-indigo-500" },
  { city: "Bangalore", demand: "Extreme", salary: "₹45L", domain: "Fintech", color: "bg-emerald-500" },
  { city: "London", demand: "Stable", salary: "£95k", domain: "Cybersecurity", color: "bg-blue-500" },
  { city: "Singapore", demand: "High", salary: "$130k", domain: "Web3", color: "bg-amber-500" },
  { city: "Berlin", demand: "Rising", salary: "€85k", domain: "Clean Energy", color: "bg-purple-500" },
];

export default function GlobalHeatmapPage() {
  const [hotspots, setHotspots] = useState<any[]>(defaultHotspots);

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const response = await fetch("/api/ai/intelligence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ module: "global-heatmap", studentId: 1 })
        });
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setHotspots(data);
        }
      } catch (e) {
        console.error("Failed to fetch heatmap", e);
      }
    };
    fetchHeatmap();
  }, []);
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20">
              <Map className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Market Intelligence</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Global <span className="text-indigo-600">Heatmap</span></h1>
          <p className="text-muted-foreground font-medium">Real-time talent supply and demand visualization across the world.</p>
        </div>
        <div className="flex items-center gap-3 bg-muted/50 p-2 rounded-2xl">
          <button className="px-5 py-2.5 bg-background shadow-sm rounded-xl text-[10px] font-black uppercase tracking-widest">Live Demand</button>
          <button className="px-5 py-2.5 text-muted-foreground hover:text-foreground transition-all rounded-xl text-[10px] font-black uppercase tracking-widest">Salary Index</button>
          <button className="px-5 py-2.5 text-muted-foreground hover:text-foreground transition-all rounded-xl text-[10px] font-black uppercase tracking-widest">Talent Flows</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-card rounded-[3rem] p-4 h-[600px] relative overflow-hidden bg-slate-900 border-indigo-600/20">
            {/* Mock Globe / Map Visualization */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center">
               <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                className="w-[800px] h-[800px] rounded-full border border-indigo-500/10 flex items-center justify-center"
               >
                 <div className="w-[600px] h-[600px] rounded-full border border-indigo-500/20 flex items-center justify-center">
                   <div className="w-[400px] h-[400px] rounded-full border border-indigo-500/30 shadow-[0_0_100px_rgba(99,102,241,0.1)]" />
                 </div>
               </motion.div>
            </div>

            {/* Hotspot Markers */}
            <div className="relative z-10 w-full h-full">
              {hotspots.map((h, i) => (
                <motion.div
                  key={h.city}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.2 }}
                  style={{ 
                    left: `${20 + i * 15}%`, 
                    top: `${30 + (i % 3) * 20}%` 
                  }}
                  className="absolute group cursor-pointer"
                >
                  <div className={cn("w-4 h-4 rounded-full animate-pulse shadow-lg", h.color)} />
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 glass-card p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 bg-slate-900/90 border-white/10">
                    <h4 className="text-[10px] font-black text-white uppercase">{h.city}</h4>
                    <div className="flex justify-between mt-2 text-[8px] font-black uppercase text-indigo-400">
                      <span>{h.domain}</span>
                      <span className="text-white">{h.salary}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* HUD Overlay */}
            <div className="absolute bottom-8 left-8 right-8 z-20 flex justify-between items-end">
              <div className="glass-card p-6 rounded-[2rem] bg-black/40 backdrop-blur-xl border-white/10">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Active Vacancies</div>
                    <div className="text-2xl font-black text-white">452,189</div>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Avg. Global Salary</div>
                    <div className="text-2xl font-black text-white">$88,400</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="px-4 py-2 bg-indigo-600 rounded-xl text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-3 h-3" /> System: Optimized
                </div>
                <div className="px-4 py-2 bg-black/40 backdrop-blur-xl rounded-xl text-white text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Earth View: Enabled
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] bg-indigo-600 text-white">
            <h3 className="font-black text-lg mb-6">Migration Insights</h3>
            <div className="space-y-6">
              {[
                { label: "India to USA", flow: "Increasing", icon: TrendingUp },
                { label: "UK to Singapore", flow: "Stable", icon: Users },
                { label: "USA to Canada", flow: "Declining", icon: Building2 },
              ].map((flow, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/10 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <flow.icon className="w-4 h-4 opacity-60" />
                    <span className="text-xs font-bold">{flow.label}</span>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">{flow.flow}</span>
                </div>
              ))}
            </div>
            <p className="mt-8 text-[11px] font-medium opacity-80 leading-relaxed italic">
              "AI Alert: Remote job availability in Europe has surged by 15% for Node.js developers in the last 48 hours."
            </p>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border-indigo-600/10">
            <h3 className="font-black text-sm uppercase tracking-widest mb-6">Top Domain Demand</h3>
            <div className="space-y-4">
              {[
                { name: "Generative AI", demand: 98 },
                { name: "Cybersecurity", demand: 82 },
                { name: "Cloud Arch", demand: 75 },
                { name: "DeFi Systems", demand: 64 },
              ].map(domain => (
                <div key={domain.name} className="flex flex-col gap-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span>{domain.name}</span>
                    <span>{domain.demand}%</span>
                  </div>
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${domain.demand}%` }} className="h-full bg-indigo-600" />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors">Download Market Report</button>
          </div>
        </div>
      </div>
    </div>
  );
}
