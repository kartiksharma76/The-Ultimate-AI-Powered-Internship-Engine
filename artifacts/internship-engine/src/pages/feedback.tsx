import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Sparkles, Star, TrendingUp, Heart, Frown, Meh } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActiveStudent } from "@/components/Layout";

interface SentimentResult {
  sentiment: string;
  score: number;
  emoji: string;
  summary: string;
}

export default function FeedbackPage() {
  const studentId = useActiveStudent();
  const [feedback, setFeedback] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);

  const handleSubmit = async () => {
    if (!feedback.trim()) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/ai/analyze-sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback, studentId })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">AI Sentiment Engine</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Share Your <span className="text-gradient">Experience</span></h1>
        <p className="text-muted-foreground font-medium max-w-xl mx-auto">
          Our AI analyzes your feedback in real-time to understand your experience and improve our ecosystem.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="glass-card rounded-[2.5rem] p-8 border-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
              <MessageSquare className="w-32 h-32 text-primary" />
            </div>
            
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-6">Write Your Feedback</h3>
            <textarea
              className="w-full h-48 bg-background/50 border border-border/50 rounded-3xl p-6 text-sm font-medium focus:ring-4 focus:ring-primary/10 transition-all resize-none outline-none"
              placeholder="How is your internship search going? What can we improve?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            
            <button
              onClick={handleSubmit}
              disabled={isAnalyzing || !feedback.trim()}
              className="w-full mt-6 py-5 bg-foreground text-background rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-foreground/10 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  Analyzing Sentiment...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Feedback
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Positive", icon: Heart, color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { label: "Neutral", icon: Meh, color: "text-amber-500", bg: "bg-amber-500/10" },
              { label: "Negative", icon: Frown, color: "text-red-500", bg: "bg-red-500/10" },
            ].map((item) => (
              <div key={item.label} className={cn("p-4 rounded-3xl flex flex-col items-center gap-2", item.bg)}>
                <item.icon className={cn("w-5 h-5", item.color)} />
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card rounded-[2.5rem] p-10 h-full border-primary/20 flex flex-col items-center justify-center text-center relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                
                <div className="text-7xl mb-8 animate-bounce">
                  {result.emoji}
                </div>
                
                <div className="mb-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Analysis Result</h4>
                  <div className="text-4xl font-black tracking-tight mb-2">{result.sentiment}</div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-1.5 w-32 bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${result.score}%` }}
                        className="h-full bg-primary"
                      />
                    </div>
                    <span className="text-xs font-black">{result.score}%</span>
                  </div>
                </div>

                <div className="p-6 bg-muted/30 rounded-3xl w-full">
                  <p className="text-xs font-bold text-muted-foreground leading-relaxed italic">
                    "{result.summary}"
                  </p>
                </div>

                <button 
                  onClick={() => setResult(null)}
                  className="mt-8 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
                >
                  Analyze New Feedback
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-[2.5rem] p-10 h-full border-dashed border-muted flex flex-col items-center justify-center text-center text-muted-foreground"
              >
                <TrendingUp className="w-16 h-16 mb-6 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">Awaiting Analysis</p>
                <p className="text-[10px] max-w-[180px] mt-2 leading-relaxed">
                  Submit your feedback to see the AI's sentiment report.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
