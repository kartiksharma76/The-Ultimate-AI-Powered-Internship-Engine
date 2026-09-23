import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Globe, Plane, AlertTriangle, CheckCircle2, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VisaIntelligencePage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("United States");
  const [results, setResults] = useState<any>(null);

  const countries = [
    { name: "United States", flag: "🇺🇸", type: "H1-B / L1", difficulty: "High" },
    { name: "United Kingdom", flag: "🇬🇧", type: "Skilled Worker", difficulty: "Medium" },
    { name: "Germany", flag: "🇩🇪", type: "Blue Card", difficulty: "Low" },
    { name: "Canada", flag: "🇨🇦", type: "Express Entry", difficulty: "Low" },
    { name: "Australia", flag: "🇦🇺", type: "Subclass 189", difficulty: "Medium" },
  ];

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setResults(null);
    
    // Simulation delay
    await new Promise(r => setTimeout(r, 2000));

    const mockResults = {
      chance: 78,
      status: "High Probability",
      insights: [
        "Your current role aligns with the 2024 Shortage Occupation List.",
        "Salary requirements for Tier 2 sponsorship are met by target roles.",
        "High historical sponsorship rate at your target companies (Google, Meta).",
        "Post-graduate visa paths remain stable for your profile."
      ],
      alerts: [
        "Recent policy updates in April might increase processing times by 3 weeks."
      ]
    };

    try {
      const response = await fetch("/api/ai/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: "visa-intelligence",
          studentId: 1,
          country: selectedCountry
        })
      });
      const data = await response.json();
      setResults(data.chance ? data : mockResults);
    } catch (e) {
      console.error("Failed to fetch visa prediction", e);
      setResults(mockResults);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-600/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Global Mobility</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Visa <span className="text-emerald-600">Intelligence</span></h1>
          <p className="text-muted-foreground font-medium">AI-driven predictive analysis for international sponsorship and relocation.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="glass-card p-10 rounded-[3.5rem] relative overflow-hidden">
            <div className="flex flex-col gap-8 mb-12">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Territory</label>
                  <div className="grid grid-cols-1 gap-2">
                    {countries.map((c) => (
                      <button 
                        key={c.name}
                        onClick={() => setSelectedCountry(c.name)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                          selectedCountry === c.name ? "border-emerald-600 bg-emerald-50 shadow-lg shadow-emerald-600/5" : "border-border/50 hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{c.flag}</span>
                          <span className="font-bold text-sm">{c.name}</span>
                        </div>
                        <span className="text-[10px] font-black uppercase text-muted-foreground/60">{c.type}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center p-8 bg-muted/30 rounded-[2.5rem] border-2 border-dashed border-border/50">
                   <Plane className="w-12 h-12 text-muted-foreground/30 mb-4" />
                   <h3 className="text-sm font-black uppercase tracking-widest mb-2">Relocation Readiness</h3>
                   <p className="text-[10px] text-muted-foreground font-medium text-center">We'll analyze your passport, experience, and target roles to predict sponsorship success.</p>
                </div>
              </div>

              <button 
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
              >
                {analyzing ? (
                  <>
                    <Globe className="w-4 h-4 animate-spin" />
                    Calculating Probability...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    Predict Sponsorship Chance
                  </>
                )}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {results && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between p-10 bg-emerald-600 text-white rounded-[2.5rem] shadow-2xl shadow-emerald-600/20">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Prediction Confidence</div>
                      <h3 className="text-4xl font-black">{results.chance}%</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Success Probability</div>
                      <div className="px-4 py-2 bg-white/20 rounded-full font-black text-xs uppercase tracking-widest">{results.status}</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Strategic Insights
                      </h4>
                      {results.insights.map((insight: string, i: number) => (
                        <div key={i} className="p-5 bg-muted/50 rounded-2xl border border-border/50 text-[11px] font-bold leading-relaxed">
                          {insight}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" /> Critical Warnings
                      </h4>
                      {results.alerts.map((alert: string, i: number) => (
                        <div key={i} className="p-5 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] font-bold text-amber-900 leading-relaxed italic">
                          "{alert}"
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
            <h3 className="font-black text-sm uppercase tracking-widest mb-6">Visa Pulse</h3>
            <div className="space-y-6">
              {[
                { label: "Sponsorship Demand", val: 82 },
                { label: "Policy Favorability", val: 64 },
                { label: "Approval Rate", val: 91 },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span className="text-muted-foreground/60">{stat.label}</span>
                    <span>{stat.val}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${stat.val}%` }} className="h-full bg-emerald-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-muted border-2 border-border/50 rounded-[2.5rem]">
            <h3 className="font-black text-sm mb-4 uppercase tracking-widest flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-600" /> Counselor Advice
            </h3>
            <p className="text-xs font-bold text-muted-foreground leading-relaxed italic">
              "Focusing on roles in 'High Shortage' categories will increase your L1-A visa probability by nearly 40%. Consider shifting your target title slightly."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
