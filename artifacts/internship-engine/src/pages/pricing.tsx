import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap, Sparkles, Shield, Rocket, BrainCircuit, CreditCard, QrCode, Smartphone, X, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    id: "free",
    name: "Free Plan",
    monthlyPrice: 0,
    annualPrice: 0,
    desc: "For exploring the ecosystem.",
    features: [
      "Industry Postings Access",
      "Basic Profile AI Sync",
      "Limited Skill Matching",
      "Public Alumni Hub (Browse)",
      "Open Source Hub (Browse)"
    ],
    icon: Rocket,
    color: "text-muted-foreground",
    buttonText: "Current Plan"
  },
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 299,
    annualPrice: 1000,
    desc: "Personalized matching for students.",
    features: [
      "Everything in Free",
      "AI Talent Scout (Basic)",
      "Skill Graph 3D (Standard)",
      "Burnout Predictor (Basic)",
      "Priority Application Tracking"
    ],
    icon: Zap,
    color: "text-blue-500",
    buttonText: "Get Started"
  },
  {
    id: "pro",
    name: "Pro Plan",
    monthlyPrice: 499,
    annualPrice: 1300,
    desc: "Advanced prep with AI automation.",
    features: [
      "Everything in Starter",
      "Project Architect (Unlimited)",
      "Market Sentiment Analysis",
      "Portfolio Optimizer (Audit)",
      "Diversity Insights (Company)",
      "Interview Ghost (Basic)"
    ],
    icon: Sparkles,
    color: "text-primary",
    buttonText: "Go Pro",
    featured: true
  },
  {
    id: "premium",
    name: "Premium",
    monthlyPrice: 999,
    annualPrice: 1500,
    desc: "Complete AI career ecosystem.",
    features: [
      "Everything in Pro",
      "Interview Ghost (Elite Persona)",
      "Legal Assistant (Full Audit)",
      "Global Alumni Hub (Intros)",
      "Unlimited AI Synthesis",
      "Recruiter Priority Visibility",
      "Elite Mentorship (Unlimited)"
    ],
    icon: BrainCircuit,
    color: "text-accent",
    buttonText: "Get Premium"
  },
  {
    id: "recruiter",
    name: "Business",
    monthlyPrice: 5500,
    annualPrice: 5500,
    desc: "FOR EMPLOYERS: AI Hiring Engine.",
    features: [
      "Unlimited Job Postings",
      "AI Candidate Shortlisting",
      "Skill-Matched Talent Pool",
      "Direct Outreach Tools",
      "Verified Company Status",
      "Advanced Hiring Analytics"
    ],
    icon: Shield,
    color: "text-emerald-500",
    buttonText: "Get Access"
  }
];

export default function PricingPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "qr">("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOpenCheckout = (plan: any) => {
    if (plan.id === "free") {
      setLocation("/");
      return;
    }
    if (!user) {
      setLocation("/login");
      return;
    }
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async () => {
    if (!user?.id) {
      alert("Please login to upgrade.");
      return;
    }

    setIsProcessing(true);
    
    try {
      const res = await loadRazorpay();
      if (!res) {
        alert("Razorpay SDK failed to load. Check your internet.");
        return;
      }

      // 1. Create order on backend
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: billingCycle === "monthly" ? selectedPlan.monthlyPrice : selectedPlan.annualPrice,
          planId: selectedPlan.id 
        })
      });
      
      const orderData = await orderRes.json();
      
      if (!orderRes.ok) throw new Error(orderData.error || "Order creation failed");

      // 2. Open Razorpay Checkout
      const options = {
        key: "rzp_test_SmW6BpXgYl8I4t",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "InternAI",
        description: `Upgrade to ${selectedPlan.name}`,
        order_id: orderData.id,
        handler: async (response: any) => {
          // 3. Verify payment on backend
          const verifyRes = await fetch("/api/payments/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              studentId: user.id,
              planId: selectedPlan.id
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            setIsSuccess(true);
            setTimeout(() => {
              setShowCheckout(false);
              window.location.href = "/dashboard";
            }, 2000);
          } else {
            alert("Payment verification failed: " + verifyData.error);
          }
        },
        prefill: {
          name: user.name,
          email: user.email || "test@example.com",
        },
        theme: {
          color: "#7c3aed",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (error: any) {
      console.error("Payment error:", error);
      alert("Payment failed to initialize: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 relative">
      <div className="fixed inset-0 pointer-events-none opacity-[0.2] mesh-gradient -z-10" />

      <div className="text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <div className="p-2 bg-primary/10 rounded-xl">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Premium Intelligence</h4>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black tracking-tight mb-8"
        >
          Choose Your <span className="text-gradient">Neural Path</span>
        </motion.h1>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={cn("text-xs font-black uppercase tracking-widest", billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground")}>Monthly</span>
          <button 
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")}
            className="w-14 h-7 bg-muted rounded-full relative p-1 transition-all"
          >
            <motion.div 
              animate={{ x: billingCycle === "monthly" ? 0 : 28 }}
              className="w-5 h-5 bg-primary rounded-full shadow-lg" 
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={cn("text-xs font-black uppercase tracking-widest", billingCycle === "annually" ? "text-foreground" : "text-muted-foreground")}>Annually</span>
            <span className="bg-emerald-500/10 text-emerald-500 text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">Save 20%</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "glass-card rounded-[2.5rem] p-8 flex flex-col relative group overflow-hidden",
              plan.featured ? "border-primary/40 shadow-2xl shadow-primary/10 scale-105 z-10" : "border-border/50"
            )}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={cn("w-12 h-12 rounded-xl bg-muted flex items-center justify-center", plan.featured ? "bg-primary/10" : "")}>
                <plan.icon className={cn("w-6 h-6", plan.color)} />
              </div>
              <div>
                <h3 className="font-black text-lg tracking-tight">{plan.name}</h3>
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{plan.id === "free" ? "Freemium" : "Professional"}</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black">₹{billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice}</span>
                <span className="text-muted-foreground font-bold text-xs">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
              </div>
              <p className="text-[10px] font-medium text-muted-foreground mt-2 leading-relaxed">{plan.desc}</p>
            </div>

            <div className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature, j) => (
                <div key={j} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-500 stroke-[4]" />
                  </div>
                  <span className="text-[11px] font-bold text-muted-foreground leading-tight">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleOpenCheckout(plan)}
              disabled={
                user?.subscriptionStatus === plan.id || 
                (user?.isPremium === 1 && PLANS.findIndex(p => p.id === user?.subscriptionStatus) > PLANS.findIndex(p => p.id === plan.id))
              }
              className={cn(
                "w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100",
                user?.subscriptionStatus === plan.id
                  ? "bg-muted text-muted-foreground"
                  : (user?.isPremium === 1 && PLANS.findIndex(p => p.id === user?.subscriptionStatus) > PLANS.findIndex(p => p.id === plan.id))
                    ? "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
                    : "bg-primary text-white shadow-xl shadow-primary/20"
              )}
            >
              {user?.subscriptionStatus === plan.id 
                ? "Active Plan" 
                : (user?.isPremium === 1 && PLANS.findIndex(p => p.id === user?.subscriptionStatus) > PLANS.findIndex(p => p.id === plan.id))
                  ? "Lower Tier"
                  : plan.buttonText}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessing && setShowCheckout(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-xl" 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-lg rounded-[2.5rem] border-primary/20 relative z-10 overflow-hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Header: Compact Info */}
                <div className="bg-muted/30 p-8 border-b border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <selectedPlan.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Order Summary</h4>
                      <h3 className="text-xl font-black">{selectedPlan.name}</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Total Amount</p>
                    <h4 className="text-2xl font-black italic">₹{billingCycle === "monthly" ? selectedPlan.monthlyPrice : selectedPlan.annualPrice}</h4>
                  </div>
                </div>

                {/* Body: Payment Action */}
                <div className="p-8 relative">
                  <AnimatePresence mode="wait">
                    {isSuccess ? (
                      <motion.div 
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-10 text-center"
                      >
                        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-xl shadow-emerald-500/20">
                          <Check className="w-8 h-8 text-white stroke-[4]" />
                        </div>
                        <h3 className="text-xl font-black mb-1">Payment Received!</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                          Upgrading to <span className="text-primary">{selectedPlan.name}</span>...
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div key="payment" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <button 
                          onClick={() => setShowCheckout(false)}
                          className="absolute -top-2 -right-2 p-2 hover:bg-muted rounded-full transition-colors"
                        >
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>

                        <div className="space-y-6 flex flex-col items-center justify-center text-center py-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Shield className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-black mb-1">Secure Checkout</h3>
                            <p className="text-[10px] font-bold text-muted-foreground leading-relaxed max-w-[240px] mx-auto">
                              We use <span className="text-foreground font-black">Razorpay Secure</span> to process your payment. 
                              All UPI apps, Cards, and Netbanking supported.
                            </p>
                          </div>
                        </div>

                        <button 
                          onClick={handleUpgrade}
                          disabled={isProcessing}
                          className="w-full mt-6 py-4 bg-primary text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Pay Now with Razorpay <ChevronRight className="w-3 h-3" />
                            </>
                          )}
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-4 opacity-40 grayscale scale-75">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" className="h-4" />
                          <div className="h-4 w-[1px] bg-border mx-1" />
                          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" />
                          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" className="h-4" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mt-20 text-center">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Trusted by 50,000+ students across 500+ institutions</p>
      </div>
    </div>
  );
}
