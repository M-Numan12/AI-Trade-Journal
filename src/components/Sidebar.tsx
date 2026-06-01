"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  BrainCircuit, 
  Bot, 
  LogOut,
  TrendingUp
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Re-initialize Lemon Squeezy to scan the DOM and bind modal overlays to 'lemonsqueezy-button' class links
    if (typeof window !== "undefined" && (window as any).createLemonSqueezy) {
      try {
        (window as any).createLemonSqueezy();
      } catch (err) {
        console.error("Lemon Squeezy init error:", err);
      }
    }
  }, []);

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Journal", href: "/journal", icon: BookOpen },
    { name: "Psychology Tracker", href: "/psychology", icon: BrainCircuit },
    { name: "AI Mentor Chat", href: "/mentor", icon: Bot },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-slate-900 bg-slate-950/60 backdrop-blur-xl">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-2 px-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 font-extrabold shadow-md shadow-violet-600/30">
            T
          </span>
          <span>TradeMind<span className="text-violet-400">AI</span></span>
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5 px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 group ${
                isActive 
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20" 
                  : "text-slate-400 hover:bg-slate-900/60 hover:text-white"
              }`}
            >
              <Icon className={`h-5 w-5 transition-transform group-hover:scale-105 ${
                isActive ? "text-white" : "text-slate-400 group-hover:text-violet-400"
              }`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Subscription Card Mock */}
      <div className="px-4 py-4">
        <div className="glass-panel rounded-2xl p-4 border border-violet-500/10 bg-violet-950/10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400">
            <TrendingUp className="h-4 w-4" />
            Free Plan Active
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Upgrade to Pro for unlimited trades and instant Vision chart setup detection.
          </p>
          <a 
            href="https://luminaminimal.lemonsqueezy.com/checkout/buy/00544e3f-4ff1-43af-8973-9d39e470c576"
            className="glow-btn mt-3.5 block w-full rounded-lg bg-violet-600 py-2 text-center text-xs font-bold text-white shadow hover:bg-violet-500 transition-colors lemonsqueezy-button"
          >
            Upgrade to Pro
          </a>
        </div>
      </div>

      {/* Footer / Logout */}
      <div className="border-t border-slate-900 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 hover:bg-rose-950/20 hover:text-rose-400 transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
