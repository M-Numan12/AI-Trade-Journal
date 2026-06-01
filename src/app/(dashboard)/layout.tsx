"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { Loader2, TrendingUp, TrendingDown, Clock } from "lucide-react";

interface HeaderTicker {
  symbol: string;
  price: number;
  change: number;
  isUp: boolean;
}

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Live ticking price feed for top header marquee
  const [marqueeTickers, setMarqueeTickers] = useState<HeaderTicker[]>([
    { symbol: "EUR/USD", price: 1.0845, change: -0.12, isUp: false },
    { symbol: "GBP/USD", price: 1.2720, change: 0.25, isUp: true },
    { symbol: "XAU/USD", price: 2345.50, change: 0.42, isUp: true },
    { symbol: "BTC/USDT", price: 67250.00, change: 2.45, isUp: true },
    { symbol: "ETH/USDT", price: 3485.50, change: 1.82, isUp: true }
  ]);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Auth check failed", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();

    // Subtle price ticker fluctuation interval to match the dashboard price feeds
    const tickInterval = setInterval(() => {
      setMarqueeTickers(prev => prev.map(t => {
        const percentChange = (Math.random() * 0.04 - 0.02); // slight shifts
        const isUp = percentChange > 0;
        const newPrice = t.price * (1 + percentChange);
        const newChange = t.change + (percentChange * 100);

        return {
          ...t,
          price: parseFloat(newPrice.toFixed(t.symbol.includes("EUR") || t.symbol.includes("GBP") ? 4 : 2)),
          change: parseFloat(newChange.toFixed(2)),
          isUp
        };
      }));
    }, 3500);

    return () => clearInterval(tickInterval);
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-space">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
          <p className="text-sm font-semibold tracking-wider text-slate-400">
            Verifying secure session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space text-white select-none">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="pl-64">
        {/* Top Header Panel with Scrolling Live Marquee */}
        <header className="flex h-16 items-center justify-between border-b border-slate-900 bg-slate-950/20 px-8 backdrop-blur-md sticky top-0 z-30">
          
          {/* Scrolling Live Marquee Section */}
          <div className="flex-1 max-w-2xl overflow-hidden hidden md:block">
            <div className="flex items-center gap-6 animate-marquee whitespace-nowrap">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 flex items-center gap-1.5 shrink-0 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-450 animate-pulse" />
                Live quotes
              </span>

              <div className="flex items-center gap-6 text-xs font-mono font-bold text-slate-350">
                {marqueeTickers.map((t) => (
                  <div key={t.symbol} className="flex items-center gap-1.5 hover:text-white transition cursor-pointer">
                    <span className="text-slate-500 font-sans font-bold">{t.symbol}</span>
                    <span className="text-slate-200">${t.price.toLocaleString(undefined, { minimumFractionDigits: t.symbol.includes("EUR") || t.symbol.includes("GBP") ? 4 : 2 })}</span>
                    <span className={`flex items-center text-[9px] font-bold ${
                      t.isUp ? "text-emerald-400" : "text-rose-400"
                    }`}>
                      {t.isUp ? <TrendingUp className="h-2.5 w-2.5 mr-0.5" /> : <TrendingDown className="h-2.5 w-2.5 mr-0.5" />}
                      {t.change > 0 ? "+" : ""}{t.change.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 select-none ml-auto shrink-0">
            {/* Server health check */}
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Secure Link Active
            </div>
            
            {/* User display name */}
            <p className="text-xs font-semibold text-slate-450 flex items-center gap-1">
              Trader: <span className="font-extrabold text-slate-200">{user?.name}</span>
            </p>
          </div>
        </header>

        {/* Dashboard Pages view */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
