import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Sparkles, MessageCircle, Star, Calendar, Zap, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MentorshipPage() {
  const [booking, setBooking] = useState<number | null>(null);

  const mentors = [
    { id: 1, name: "David Malan", role: "Sr. Software Engineer @ Google", rating: 4.9, reviews: 124, price: "Free for Students", expertise: ["Algorithms", "C++", "System Design"] },
    { id: 2, name: "Jessica Lee", role: "Staff Frontend @ Airbnb", rating: 5.0, reviews: 89, price: "₹2,500 / hr", expertise: ["React", "UI/UX", "Career Strategy"] },
    { id: 3, name: "Ryan Dahl", role: "Principal Architect @ Cloudflare", rating: 4.8, reviews: 210, price: "Free", expertise: ["Node.js", "Security", "Open Source"] },
    { id: 4, name: "Sarah Drasner", role: "VP of Eng @ Netlify", rating: 5.0, reviews: 156, price: "₹5,000 / hr", expertise: ["Leadership", "SVG", "Performance"] },
  ];

  const handleBook = async (id: number) => {
    setBooking(id);
    const mentor = mentors.find(m => m.id === id);
    
    try {
      await fetch("/api/mentorship-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: 1,
          mentorId: id,
          mentorName: mentor?.name,
          mentorRole: mentor?.role,
          sessionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
        })
      });
      // Simulate confirmation
      await new Promise(r => setTimeout(r, 1500));
    } catch (e) {
      console.error("Failed to book mentor", e);
    } finally {
      setBooking(null);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20">
              <User className="w-5 h-5" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Expert Intelligence</h4>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Elite <span className="text-indigo-600">Mentorship</span></h1>
          <p className="text-muted-foreground font-medium">Connect with industry titans and senior architects for personalized 1:1 guidance.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="grid md:grid-cols-2 gap-6">
            {mentors.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 rounded-[3rem] hover:border-indigo-600/30 transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                   <div className="w-20 h-20 rounded-[2.5rem] bg-muted overflow-hidden border-2 border-border/50 group-hover:border-indigo-600/30 transition-colors shadow-lg">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`} alt="" />
                   </div>
                   <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                      <Star className="w-3 h-3 fill-current" /> {m.rating}
                   </div>
                </div>
                <h3 className="text-xl font-black mb-1">{m.name}</h3>
                <p className="text-xs font-bold text-muted-foreground mb-6 leading-relaxed">{m.role}</p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {m.expertise.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-muted rounded-xl text-[9px] font-black uppercase tracking-widest text-muted-foreground/80">{skill}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-8">
                   <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Consultation</div>
                   <div className="text-sm font-black text-indigo-600">{m.price}</div>
                </div>

                <button 
                  onClick={() => handleBook(m.id)}
                  disabled={booking === m.id}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  {booking === m.id ? (
                    <>
                      <Calendar className="w-4 h-4 animate-pulse" />
                      Booking Session...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      Book 1:1 Session
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] bg-indigo-600 text-white relative overflow-hidden">
             <Sparkles className="absolute top-4 right-4 w-12 h-12 opacity-10" />
             <h3 className="font-black text-sm uppercase tracking-widest mb-6">Neural Matching</h3>
             <div className="p-6 bg-white/10 rounded-2xl border border-white/10 mb-8 font-medium text-xs italic">
               "{booking ? "Booking confirmed!" : "We've analyzed your career trajectory. David Malan is your #1 match based on your interest in C++ and System Architecture."}"
             </div>
             <button 
                onClick={async () => {
                  try {
                    const res = await fetch("/api/ai/intelligence", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ module: "mentorship", studentId: 1 })
                    });
                    const data = await res.json();
                    alert(data.advice || "Match found!");
                  } catch(e) {
                    alert("Error finding match");
                  }
                }}
                className="w-full py-4 bg-white/20 hover:bg-white/30 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Quick Match Me
              </button>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border-indigo-600/10 text-center">
             <div className="w-16 h-16 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-indigo-600" />
             </div>
             <h3 className="text-sm font-black uppercase tracking-widest mb-2">Verified Experts</h3>
             <p className="text-[10px] text-muted-foreground font-medium px-4">All mentors are manually verified for professional identity and experience levels.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
