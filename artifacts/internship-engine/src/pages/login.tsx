import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Smartphone, ChevronRight, User as UserIcon, LogIn, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type AuthMode = "login" | "register";

const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  const handleAction = async () => {
    if (mode === "register" && (!name || !mobile)) {
      toast.error("Please fill all fields");
      return;
    }
    if (!password) {
      toast.error("Password is required");
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = mode === "register" 
        ? { email, password, name, mobile }
        : { email, mobile, password }; // Login can use either

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        toast.success(mode === "login" ? "Welcome back!" : "Account created successfully!");
        window.location.href = "/";
      } else {
        toast.error(data?.error || "Authentication failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server connection failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-accent/10 rounded-full blur-[128px] animate-pulse delay-700" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="bg-black/40 backdrop-blur-2xl border-white/10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[3rem] overflow-hidden">
          <CardHeader className="text-center space-y-1 pt-12 pb-6">
            <motion.div 
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="mx-auto w-16 h-16 bg-gradient-to-tr from-primary to-accent rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-primary/20"
            >
              {mode === "login" ? <LogIn className="w-8 h-8 text-white" /> : <UserPlus className="w-8 h-8 text-white" />}
            </motion.div>
            
            <CardTitle className="text-3xl font-black tracking-tight">
              {mode === "login" ? "Welcome Back" : "Join the Engine"}
            </CardTitle>
            <CardDescription className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-2">
              {mode === "login" ? "Enter your credentials to continue" : "Create your professional account"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 px-10 pb-12 pt-4">
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === "register" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full bg-white/5 border-2 border-white/5 rounded-xl px-12 py-3 text-sm font-bold focus:border-primary/50 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  {mode === "login" ? "Email or Mobile Number" : "Mobile Number"}
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    value={mode === "login" ? (email || mobile) : mobile}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (mode === "login") {
                        if (val.includes("@")) { setEmail(val); setMobile(""); }
                        else { setMobile(val); setEmail(""); }
                      } else {
                        setMobile(val);
                      }
                    }}
                    placeholder={mode === "login" ? "email@example.com or +91..." : "+91 99999 99999"}
                    className="w-full bg-white/5 border-2 border-white/5 rounded-xl px-12 py-3 text-sm font-bold focus:border-primary/50 outline-none transition-all"
                  />
                </div>
              </div>

              {mode === "register" && (
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email (Optional)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full bg-white/5 border-2 border-white/5 rounded-xl px-12 py-3 text-sm font-bold focus:border-primary/50 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border-2 border-white/5 rounded-xl px-12 py-3 text-sm font-bold focus:border-primary/50 outline-none transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <Button 
                onClick={handleAction}
                disabled={isLoading}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
              >
                {isLoading ? "Authenticating..." : mode === "login" ? "Login to Dashboard" : "Create Account"}
              </Button>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setMode(mode === "login" ? "register" : "login")}
                  className="w-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white"
                >
                  {mode === "login" ? "Don't have an account? Register Free" : "Already have an account? Login"}
                </button>
                
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
                  <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                    <span className="bg-[#020617] px-4 text-muted-foreground">or social login</span>
                  </div>
                </div>

                <Button
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full h-14 bg-white text-black hover:bg-white/90 border-none rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all"
                >
                  <FcGoogle className="text-xl" />
                  Sign in with Google
                </Button>
              </div>
            </div>

            <p className="text-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed mt-6">
              Secure Cloud <span className="text-white">Authentication</span>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
