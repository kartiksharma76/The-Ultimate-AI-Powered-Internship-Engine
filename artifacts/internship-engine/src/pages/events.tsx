import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Calendar, MapPin, Users, Zap, Sparkles, Globe, Terminal, CheckCircle2, ArrowRight, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<"hackathons" | "workshops">("hackathons");
  const [insight, setInsight] = useState<string>("NVIDIA's Neural Nexus hackathon is trending high in your region. Participants often land interview invites for the AI/ML division.");
  const [loadingInsight, setLoadingInsight] = useState(false);
  
  const [eventsData, setEventsData] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [registering, setRegistering] = useState<number | null>(null);
  const [registered, setRegistered] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchInsight = async () => {
    setLoadingInsight(true);
    try {
      const response = await fetch("/api/ai/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "events", studentId: 1 })
      });
      const data = await response.json();
      if (data.events && data.events.length > 0) {
        setInsight(`Hot event: ${data.events[0].title} is coming up ${data.events[0].date}. Perfect for your profile!`);
      }
    } catch (e) {
      setInsight("Global AI Hackathon is trending in your region. Don't miss out!");
    } finally {
      setLoadingInsight(false);
    }
  };

  const fetchEvents = async (query = "") => {
    setLoadingEvents(true);
    try {
      const response = await fetch("/api/ai/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "events", studentId: 1, query })
      });
      const data = await response.json();
      if (data.events) {
        setEventsData(data.events.map((e: any, i: number) => ({ id: i, ...e })));
      }
    } catch (e) {
      setEventsData([
        { id: 1, title: "Lablab Agentic AI Hackathon", host: "Lablab.ai", date: "Aug 15-20, 2026", location: "Global / Online", prize: "$100,000", participants: 4500, difficulty: "Elite" },
        { id: 2, title: "Azure Cloud Scale", host: "Microsoft", date: "Nov 5-8, 2026", location: "Hybrid / Seattle", prize: "$50,000", participants: 3200, difficulty: "Pro" },
        { id: 3, title: "Neural Workflows Challenge", host: "Google DeepMind", date: "Dec 10-14, 2026", location: "Online", prize: "Mentorship", participants: 8500, difficulty: "Open" },
        { id: 4, title: "Web3 Super Summit", host: "Solana", date: "Oct 1-3, 2026", location: "Lisbon, Portugal", prize: "$25,000", participants: 1200, difficulty: "Expert" }
      ]);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegister = (id: number) => {
    setRegistering(id);
    setTimeout(() => {
      setRegistering(null);
      setRegistered(prev => [...prev, id]);
    }, 1500);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20">
              <Trophy className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Global Engagement</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Events & <span className="text-indigo-600">Hackathons</span></h1>
          <p className="text-muted-foreground font-medium">Curated feed of global tech competitions and high-impact developer events.</p>
        </div>
        <div className="flex bg-muted/50 p-1.5 rounded-2xl">
          <button onClick={() => setActiveTab("hackathons")} className={cn("px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all", activeTab === "hackathons" ? "bg-background shadow-md" : "text-muted-foreground")}>Hackathons</button>
          <button onClick={() => setActiveTab("workshops")} className={cn("px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all", activeTab === "workshops" ? "bg-background shadow-md" : "text-muted-foreground")}>Workshops</button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-12">
        <div className="flex-1 flex items-center gap-3 bg-muted/50 px-6 py-4 rounded-2xl border border-border/50 focus-within:border-indigo-500/50 transition-colors w-full">
           <Search className="w-5 h-5 text-muted-foreground" />
           <input 
             type="text" 
             placeholder="Search for hackathons by tech stack, company, or location..." 
             className="bg-transparent border-none outline-none w-full text-sm font-medium"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && fetchEvents(searchQuery)}
           />
        </div>
        <button 
          onClick={() => alert("Redirecting to Organizer Portal... Your event will be pushed to the AI registry.")}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 w-full md:w-auto flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Host an Event
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="grid gap-6">
            {loadingEvents ? (
               <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
                 <Loader2 className="w-8 h-8 animate-spin mb-4" />
                 <p className="font-bold uppercase tracking-widest text-xs">Finding global events...</p>
               </div>
            ) : eventsData.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-10 rounded-[3rem] border border-border/50 group hover:border-indigo-600/30 transition-all flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-2xl rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">{event.host}</span>
                    <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest flex items-center gap-2">
                       <Calendar className="w-3.5 h-3.5" /> {event.date}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black mb-4 group-hover:text-indigo-600 transition-colors">{event.title}</h3>
                  <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                     <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" /> {event.location}
                     </div>
                     <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5" /> {event.participants?.toLocaleString() || 500} joined
                     </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4 shrink-0">
                   <div className="text-center">
                      <div className="text-lg font-black text-emerald-600">{event.prize}</div>
                      <div className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Prize Pool</div>
                   </div>
                   <button 
                     onClick={() => handleRegister(event.id)}
                     disabled={registered.includes(event.id) || registering === event.id}
                     className={cn(
                       "px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2",
                       registered.includes(event.id) ? "bg-emerald-500 text-white" : "bg-slate-900 text-white hover:scale-105 shadow-xl"
                     )}
                   >
                     {registered.includes(event.id) ? <><CheckCircle2 className="w-4 h-4" /> Registered</> : registering === event.id ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing</> : "Register Now"}
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] bg-indigo-600 text-white relative overflow-hidden">
             <Sparkles className="absolute top-4 right-4 w-12 h-12 opacity-10" />
             <h3 className="font-black text-sm uppercase tracking-widest mb-6 italic">Event Insights</h3>
             <div className="p-6 bg-white/10 rounded-2xl border border-white/10 mb-8 font-medium text-xs">
               "{insight}"
             </div>
             <button onClick={fetchInsight} disabled={loadingInsight} className="w-full py-4 bg-white/20 hover:bg-white/30 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
               {loadingInsight ? "Analyzing..." : "Get AI Insights"}
             </button>
          </div>

          <div className="p-8 bg-muted border-2 border-border/50 rounded-[2.5rem]">
            <h3 className="font-black text-sm mb-4 uppercase tracking-widest flex items-center gap-2 text-indigo-600">
              <Zap className="w-4 h-4" /> Elite Tier
            </h3>
            <p className="text-xs font-bold text-muted-foreground leading-relaxed italic">
              "You've participated in 3 hackathons this year. One more 'Elite' tier win will qualify you for the Global Hall of Fame."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
