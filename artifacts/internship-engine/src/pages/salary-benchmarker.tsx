import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, TrendingUp, MapPin, Briefcase, Zap, Info, BarChart3, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SalaryBenchmarkerPage() {
  const [role, setRole] = useState("Software Engineer");
  const [location, setLocation] = useState("San Francisco, CA");
  const [calculating, setCalculating] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleCalculate = async () => {
    setCalculating(true);
    setData(null);
    try {
      const response = await fetch("/api/ai/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "salary-benchmarker", studentId: 1, role, location })
      });
      const result = await response.json();
      setData(result);
    } catch (e) {
      console.error("Failed to calculate", e);
      setData({
        median: 165000,
        range: { min: 142000, max: 210000 },
        percentile: 85,
        comparison: [
          { company: "FAANG Average", val: 185000 },
          { company: "Unicorn Average", val: 155000 },
          { company: "Market Median", val: 142000 },
        ],
        breakdown: { base: 70, equity: 20, bonus: 10 }
      });
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-600 rounded-xl text-white shadow-lg shadow-amber-600/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Economic Intelligence</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Salary <span className="text-amber-600">Benchmarker</span></h1>
          <p className="text-muted-foreground font-medium">Real-time compensation analysis and negotiation benchmarks for global tech roles.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-card p-10 rounded-[3.5rem] relative overflow-hidden">
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Job Title</label>
                <div className="relative group">
                  <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-hover:text-amber-600" />
                  <input 
                    type="text" 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-muted/30 border-2 border-border/50 rounded-2xl pl-14 pr-5 py-4 text-sm font-bold outline-none focus:border-amber-600 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Global Location</label>
                <div className="relative group">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-hover:text-amber-600" />
                  <input 
                    type="text" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-muted/30 border-2 border-border/50 rounded-2xl pl-14 pr-5 py-4 text-sm font-bold outline-none focus:border-amber-600 transition-all"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleCalculate}
              disabled={calculating}
              className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-2xl"
            >
              {calculating ? (
                <>
                  <Zap className="w-4 h-4 animate-pulse" />
                  Accessing Salary Stream...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4" />
                  Calculate Benchmarks
                </>
              )}
            </button>

            <AnimatePresence>
              {data && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-12 space-y-8"
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-8 bg-amber-600 text-white rounded-[2.5rem] shadow-xl shadow-amber-600/20 text-center">
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Median Total Comp</div>
                      <div className="text-3xl font-black tabular-nums">${data.median.toLocaleString()}</div>
                    </div>
                    <div className="p-8 bg-muted/50 border-2 border-border/50 rounded-[2.5rem] text-center">
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">90th Percentile</div>
                      <div className="text-3xl font-black tabular-nums">${data.range.max.toLocaleString()}</div>
                    </div>
                    <div className="p-8 bg-muted/50 border-2 border-border/50 rounded-[2.5rem] text-center">
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Market Percentile</div>
                      <div className="text-3xl font-black tabular-nums">{data.percentile}th</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Market Comparison
                      </h4>
                      <div className="space-y-4">
                        {data.comparison.map((c: any) => (
                          <div key={c.company} className="flex flex-col gap-2">
                            <div className="flex justify-between text-[11px] font-bold">
                              <span>{c.company}</span>
                              <span className="text-amber-600">${c.val.toLocaleString()}</span>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${(c.val / data.range.max) * 100}%` }} className="h-full bg-amber-500" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <PieChart className="w-4 h-4" /> Compensation Mix
                      </h4>
                      <div className="flex h-12 rounded-2xl overflow-hidden shadow-inner border border-border/50">
                        <div className="h-full bg-amber-600" style={{ width: `${data.breakdown.base}%` }} />
                        <div className="h-full bg-amber-400" style={{ width: `${data.breakdown.equity}%` }} />
                        <div className="h-full bg-amber-200" style={{ width: `${data.breakdown.bonus}%` }} />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber-600" />
                          <span className="text-[10px] font-black text-muted-foreground uppercase">Base {data.breakdown.base}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber-400" />
                          <span className="text-[10px] font-black text-muted-foreground uppercase">Equity {data.breakdown.equity}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber-200" />
                          <span className="text-[10px] font-black text-muted-foreground uppercase">Bonus {data.breakdown.bonus}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden">
             <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-500/20 blur-2xl rounded-full" />
             <h3 className="font-black text-sm uppercase tracking-widest mb-6">Neural Insights</h3>
             <p className="text-xs font-bold leading-relaxed opacity-70 mb-6 italic">
               "In the current {location} market, candidates with specialized expertise in LLMs are commanding a 22% premium over standard senior roles."
             </p>
             <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Download Market Report</button>
          </div>

          <div className="p-8 bg-amber-50 border-2 border-amber-200 rounded-[2.5rem]">
            <h3 className="font-black text-sm mb-4 uppercase tracking-widest flex items-center gap-2 text-amber-700">
              <Zap className="w-4 h-4" /> Power Move
            </h3>
            <p className="text-xs font-bold text-amber-900/60 leading-relaxed italic">
              "Your target range is 12% below market peak. Focus on your architectural contributions during the next round to anchor at ${data?.range.max.toLocaleString() || '180,000'}+."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
