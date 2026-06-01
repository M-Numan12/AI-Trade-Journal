"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  TrendingDown, 
  Percent, 
  Layers, 
  BarChart3, 
  Plus, 
  Sparkles,
  ArrowRight,
  TrendingUp as WinIcon,
  TrendingDown as LossIcon,
  HelpCircle
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface Trade {
  id: string;
  pair: string;
  type: "BUY" | "SELL";
  entryPrice: number;
  sl: number;
  tp: number;
  lotSize: number;
  pnl: number;
  result: "WIN" | "LOSS" | "BREAKEVEN";
  notes?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrades() {
      try {
        const res = await fetch("/api/trades");
        if (res.ok) {
          const data = await res.json();
          setTrades(data.trades);
        }
      } catch (err) {
        console.error("Failed to load trades", err);
      } finally {
        setLoading(false);
      }
    }
    loadTrades();
  }, []);

  // Compute Metrics
  const totalTrades = trades.length;
  const winTrades = trades.filter(t => t.result === "WIN").length;
  const winRate = totalTrades > 0 ? Math.round((winTrades / totalTrades) * 100) : 0;
  const netPnL = trades.reduce((sum, t) => sum + t.pnl, 0);

  // Compute Avg RR
  let avgRR = "1:2.0";
  if (totalTrades > 0) {
    let totalRR = 0;
    let counts = 0;
    trades.forEach(t => {
      const risk = Math.abs(t.entryPrice - t.sl);
      const reward = Math.abs(t.tp - t.entryPrice);
      if (risk > 0) {
        totalRR += reward / risk;
        counts++;
      }
    });
    if (counts > 0) {
      avgRR = `1:${(totalRR / counts).toFixed(1)}`;
    }
  }

  // Best & Worst Pairs
  const pairPnL: { [key: string]: number } = {};
  trades.forEach(t => {
    pairPnL[t.pair] = (pairPnL[t.pair] || 0) + t.pnl;
  });

  const sortedPairs = Object.entries(pairPnL).sort((a, b) => b[1] - a[1]);
  const bestPair = sortedPairs.length > 0 && sortedPairs[0][1] > 0 ? sortedPairs[0][0] : "N/A";
  const worstPair = sortedPairs.length > 0 && sortedPairs[sortedPairs.length - 1][1] < 0 
    ? sortedPairs[sortedPairs.length - 1][0] 
    : "N/A";

  // Cumulative PnL data for Charting
  const chartData = [...trades]
    .reverse()
    .reduce((acc: any[], trade, index) => {
      const prevPnL = index > 0 ? acc[index - 1].pnl : 0;
      acc.push({
        date: new Date(trade.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        pnl: parseFloat((prevPnL + trade.pnl).toFixed(2)),
      });
      return acc;
    }, []);

  // Add initial zero point if data exists
  if (chartData.length > 0) {
    chartData.unshift({ date: "Start", pnl: 0 });
  }

  const kpis = [
    { 
      name: "Net Profit / Loss", 
      value: `${netPnL >= 0 ? "+" : ""}$${netPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
      icon: netPnL >= 0 ? TrendingUp : TrendingDown,
      colorClass: netPnL >= 0 ? "text-emerald-400" : "text-rose-400",
      bgClass: netPnL >= 0 ? "bg-emerald-500/10" : "bg-rose-500/10",
      description: "Total overall earnings accumulated"
    },
    { 
      name: "Win Rate", 
      value: `${winRate}%`, 
      icon: Percent,
      colorClass: "text-violet-400",
      bgClass: "bg-violet-500/10",
      description: `${winTrades} wins out of ${totalTrades} total trades`
    },
    { 
      name: "Average Risk:Reward", 
      value: avgRR, 
      icon: Layers,
      colorClass: "text-teal-400",
      bgClass: "bg-teal-500/10",
      description: "Targeted profit-to-loss execution spacing"
    },
    { 
      name: "Total Logged Trades", 
      value: totalTrades.toString(), 
      icon: BarChart3,
      colorClass: "text-slate-400",
      bgClass: "bg-slate-500/10",
      description: "Total entries recorded this month"
    },
  ];

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Performance Dashboard</h2>
          <p className="mt-1.5 text-sm text-slate-400">
            Real-time trade metrics parsed and audited by AI trading model.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/journal" 
            className="glow-btn flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow shadow-violet-600/20 hover:bg-violet-500"
          >
            <Plus className="h-4 w-4" />
            Log New Trade
          </Link>
        </div>
      </div>

      {totalTrades === 0 ? (
        /* Empty State */
        <div className="glass-panel flex flex-col items-center justify-center rounded-3xl p-16 text-center shadow-xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
            <Sparkles className="h-8 w-8 animate-float" />
          </div>
          <h3 className="mt-6 text-xl font-bold text-white">Your trading journal is empty</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-400">
            Upload your first manual trade details or drag-and-drop a chart screenshot to unlock advanced AI review and performance statistics!
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link 
              href="/journal" 
              className="glow-btn rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500"
            >
              Add first trade
            </Link>
            <Link 
              href="/mentor" 
              className="rounded-xl border border-slate-800 bg-slate-950/45 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-900"
            >
              Talk to AI Coach
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* KPI Matrix */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.name} className="glass-panel glass-panel-hover rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-400">{kpi.name}</span>
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.bgClass} ${kpi.colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className={`text-2xl font-black ${kpi.colorClass}`}>{kpi.value}</span>
                    <p className="mt-1 text-xs text-slate-500">{kpi.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Chart & Pair breakdown */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Area PnL Chart */}
            <div className="glass-panel rounded-3xl p-6 lg:col-span-2 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-6">Equity & PnL Curve</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#475569" 
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#475569" 
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "rgba(9, 6, 32, 0.9)", 
                        borderColor: "rgba(255, 255, 255, 0.08)",
                        borderRadius: "12px",
                        color: "#fff"
                      }}
                      labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="pnl" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#pnlGrad)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pairs Stats Card */}
            <div className="glass-panel rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-6">Asset Analytics</h3>
                
                <div className="space-y-5">
                  <div className="flex items-center justify-between rounded-xl bg-slate-950/40 p-4 border border-slate-900">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                        <WinIcon className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">Best Performing Pair</p>
                        <p className="text-sm font-bold text-white mt-0.5">{bestPair}</p>
                      </div>
                    </div>
                    {bestPair !== "N/A" && (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
                        +${pairPnL[bestPair].toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-950/40 p-4 border border-slate-900">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
                        <LossIcon className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">Worst Performing Pair</p>
                        <p className="text-sm font-bold text-white mt-0.5">{worstPair}</p>
                      </div>
                    </div>
                    {worstPair !== "N/A" && (
                      <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-1 rounded-md">
                        ${pairPnL[worstPair].toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Psychological Health Review */}
              <div className="mt-6 rounded-2xl bg-violet-950/10 border border-violet-500/10 p-4 text-xs">
                <div className="flex items-center gap-2 font-bold text-violet-400 mb-1.5">
                  <Sparkles className="h-4 w-4" />
                  AI Coach Insight
                </div>
                <p className="leading-relaxed text-slate-400">
                  You make 73% of your profit trading **{bestPair || "your primary assets"}**. However, losses on **{worstPair || "side assets"}** are counteracting your growth. Consider sticking strictly to your best assets next week!
                </p>
              </div>
            </div>
          </div>

          {/* Recent Trades Snapshot Table */}
          <div className="glass-panel rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Recent Logged Entries</h3>
              <Link href="/journal" className="flex items-center gap-1.5 text-sm font-semibold text-violet-400 hover:text-violet-300">
                View full journal
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Asset</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Lot Size</th>
                    <th className="py-3 px-4 text-right">PnL Amount</th>
                    <th className="py-3 px-4 text-center">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 text-sm">
                  {trades.slice(0, 5).map((trade) => (
                    <tr key={trade.id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(trade.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">{trade.pair}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          trade.type === "BUY" ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
                        }`}>
                          {trade.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-300">{trade.lotSize}</td>
                      <td className={`py-3.5 px-4 text-right font-bold ${
                        trade.pnl >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}>
                        {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          trade.result === "WIN" 
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" 
                            : "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                        }`}>
                          {trade.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Simple loader helper
function Loader2({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
