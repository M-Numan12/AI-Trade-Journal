"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Bot, 
  BrainCircuit, 
  Layers, 
  Percent, 
  Check, 
  ArrowUpRight 
} from "lucide-react";

export default function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          setIsAuthenticated(true);
        }
      } catch (err) {
        // Not logged in
      }
    }
    checkAuth();

    // Re-initialize Lemon Squeezy to scan the DOM and bind modal overlays to 'lemonsqueezy-button' class links
    if (typeof window !== "undefined" && (window as any).createLemonSqueezy) {
      try {
        (window as any).createLemonSqueezy();
      } catch (err) {
        console.error("Lemon Squeezy init error:", err);
      }
    }
  }, []);

  const features = [
    {
      title: "AI Chart Vision OCR",
      description: "Simply upload a screenshot of your trade chart. Our Vision model parses entry, take-profit, stop-loss, and maps trading risk setups instantly.",
      icon: Sparkles,
    },
    {
      title: "Discipline & Psychology Log",
      description: "Log your moods and after-trade emotions. Our AI mental analyst detects patterns of revenge trading and fear to protect your funded accounts.",
      icon: BrainCircuit,
    },
    {
      title: "Interactive AI Mentor Chat",
      description: "Your personal 24/7 trading coach. Talk in Roman Urdu or English to analyze your performance logs, ask strategy questions, and get feedback.",
      icon: Bot,
    },
  ];

  const pricingPlans = [
    {
      name: "Free Plan",
      price: "$0",
      description: "Perfect for starting your journaling journey.",
      features: [
        "10 trade logs per month",
        "Basic performance dashboard",
        "Standard win-rate metrics",
        "Limited AI mentor review",
      ],
      cta: "Get Started Free",
      href: "/signup",
      popular: false,
    },
    {
      name: "Pro Coach Plan",
      price: "$15",
      period: "/month",
      description: "Best for independent active retail traders.",
      features: [
        "Unlimited trade logs",
        "Full AI screenshot Vision OCR",
        "Dynamic psychology pattern analysis",
        "24/7 unlimited AI Mentor Chat",
        "Advanced assets and session insights",
      ],
      cta: "Upgrade to Pro",
      href: "https://luminaminimal.lemonsqueezy.com/checkout/buy/00544e3f-4ff1-43af-8973-9d39e470c576",
      popular: true,
    },
    {
      name: "Premium Sync Plan",
      price: "$30",
      period: "/month",
      description: "Built for funded prop firm account management.",
      features: [
        "MT5 automatic trade sync (Phase 2)",
        "Advanced PDF & CSV report exports",
        "Private dedicated coach API configuration",
        "Custom instant Telegram risk warnings",
        "Priority feature request access",
      ],
      cta: "Unlock Premium",
      href: "/signup",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-space text-white select-none">
      {/* Decorative Blur Backdrops */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[100px] animate-pulse-slow" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-[500px] w-[500px] rounded-full bg-teal-600/10 blur-[100px] animate-pulse-slow" />

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-900 bg-space/65 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 font-extrabold shadow shadow-violet-600/35">
              T
            </span>
            <span>TradeMind<span className="text-violet-400">AI</span></span>
          </div>
          <nav className="flex items-center gap-6">
            {isAuthenticated ? (
              <Link 
                href="/dashboard" 
                className="glow-btn flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow shadow-violet-600/20 hover:bg-violet-500"
              >
                Go to Workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-slate-350 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="glow-btn flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow shadow-violet-600/20 hover:bg-violet-500"
                >
                  Start Free Trial
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-5xl px-6 py-20 text-center space-y-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 px-4 py-1.5 text-xs font-bold text-violet-400 animate-float">
          <Sparkles className="h-3.5 w-3.5" />
          The World's First AI-Powered Trading Coach
        </span>

        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl max-w-4xl mx-auto leading-tight sm:leading-none">
          Stop repeating trading mistakes. Let <span className="text-gradient-purple font-black">TradeMind AI</span> guide your growth.
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-slate-400 leading-relaxed">
          Log manual setups or upload chart screenshots. Our OCR Vision AI reviews your risk-reward spacing, audits emotional patterns, and provides a 24/7 interactive mentor coach to clear funded account challenges.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row pt-4">
          <Link 
            href={isAuthenticated ? "/dashboard" : "/signup"}
            className="glow-btn flex items-center gap-2 rounded-xl bg-violet-600 px-7 py-4 text-base font-bold text-white shadow-lg shadow-violet-600/25 hover:bg-violet-500"
          >
            {isAuthenticated ? "Enter Workspace" : "Get Started Free"}
            <ArrowRight className="h-5 w-5" />
          </Link>
          <a 
            href="#features"
            className="rounded-xl border border-slate-900 bg-slate-950/45 px-7 py-4 text-base font-bold text-slate-350 hover:bg-slate-900 hover:text-white transition-colors"
          >
            Explore Features
          </a>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20 border-t border-slate-900/60 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Everything you need to secure your edge
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Retail trading is 90% psychological. Our feature set was engineered to protect your trading accounts from emotional impulses.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="glass-panel glass-panel-hover rounded-3xl p-8 shadow-md">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600/10 text-violet-400 mb-6">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing Comparison Matrix */}
      <section className="mx-auto max-w-7xl px-6 py-20 border-t border-slate-900/60">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Flexible premium subscription tiers
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Choose the subscription tier aligned with your current funding levels. Swap plans anytime.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {pricingPlans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`glass-panel rounded-3xl p-8 shadow-xl flex flex-col justify-between relative ${
                plan.popular ? "border-violet-500 scale-102 bg-violet-950/5 shadow-violet-600/5" : ""
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 right-6 inline-flex rounded-full bg-violet-600 px-3 py-1 text-xs font-bold text-white shadow shadow-violet-600/40">
                  Most Popular
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">{plan.description}</p>
                </div>

                <div className="flex items-baseline">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  {plan.period && <span className="text-sm font-semibold text-slate-400 ml-1">{plan.period}</span>}
                </div>

                <ul className="space-y-3.5 border-t border-slate-900/60 pt-6">
                  {plan.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-start gap-2.5 text-xs text-slate-350">
                      <Check className="h-4.5 w-4.5 text-violet-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                {plan.href.startsWith("http") ? (
                  <a
                    href={plan.href}
                    className={`glow-btn block w-full py-3.5 text-center text-xs font-bold rounded-xl shadow transition-all lemonsqueezy-button ${
                      plan.popular
                        ? "bg-violet-600 text-white hover:bg-violet-500 shadow-violet-600/20"
                        : "bg-slate-950 border border-slate-900 text-slate-350 hover:bg-slate-900"
                    }`}
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <Link
                    href={plan.href}
                    className={`glow-btn block w-full py-3.5 text-center text-xs font-bold rounded-xl shadow transition-all ${
                      plan.popular
                        ? "bg-violet-600 text-white hover:bg-violet-500 shadow-violet-600/20"
                        : "bg-slate-950 border border-slate-900 text-slate-350 hover:bg-slate-900"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900/60 bg-slate-950/20 py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between text-center gap-6">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-600 font-extrabold text-xs text-white">
              T
            </span>
            TradeMind AI © 2026. Made with ❤️ for profitable traders.
          </div>
          <div className="flex justify-center gap-8 text-xs font-semibold text-slate-500">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms of Service</Link>
            <Link href="#" className="hover:text-white">Affiliate Program</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
