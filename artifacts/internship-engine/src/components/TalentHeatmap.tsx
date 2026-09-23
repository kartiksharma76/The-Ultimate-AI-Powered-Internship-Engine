import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { Target, Globe, Zap } from "lucide-react";

const data = [
  { subject: 'Cloud Arch', A: 120, B: 110, fullMark: 150 },
  { subject: 'AI/ML', A: 98, B: 130, fullMark: 150 },
  { subject: 'Backend', A: 86, B: 130, fullMark: 150 },
  { subject: 'DevOps', A: 99, B: 100, fullMark: 150 },
  { subject: 'Frontend', A: 85, B: 90, fullMark: 150 },
  { subject: 'Security', A: 65, B: 85, fullMark: 150 },
];

export default function TalentHeatmap() {
  return (
    <div className="glass-card rounded-[2.5rem] p-8 h-full relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
        <Globe className="w-24 h-24 text-primary" />
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-primary" />
              Global Benchmarking
            </h3>
            <h2 className="text-2xl font-black tracking-tight">Talent <span className="text-primary">Heatmap</span></h2>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-tighter">You</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-muted" />
              <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Top 1% Global</span>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="currentColor" strokeOpacity={0.1} />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 800 }}
              />
              <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
              <Radar
                name="You"
                dataKey="A"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.5}
              />
              <Radar
                name="Global 1%"
                dataKey="B"
                stroke="hsl(var(--muted-foreground))"
                fill="hsl(var(--muted))"
                fillOpacity={0.2}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '1rem',
                  fontSize: '10px',
                  fontWeight: '800'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-500 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">System Insight</div>
              <div className="text-sm font-bold">You outpace 88% of Google applicants in <span className="text-primary">Cloud Architecture</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
