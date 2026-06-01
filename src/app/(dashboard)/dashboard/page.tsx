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
  HelpCircle,
  CheckCircle2,
  Calculator,
  AlertCircle,
  RefreshCw,
  FileSpreadsheet,
  BrainCircuit
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

interface PsychologyLog {
  id: string;
  moodBefore: string;
  emotionAfter?: string;
  disciplineScore: number;
  notes?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [logs, setLogs] = useState<PsychologyLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Pre-Trade Strategy Checklist State
  const [checklist, setChecklist] = useState({
    trendAligned: false,
    keyZone: false,
    riskDefined: false,
    timeframeConfirm: false,
    emotionsChecked: false,
  });

  // Risk & Position Size Calculator State
  const [calc, setCalc] = useState({
    balance: 10000,
    riskPercent: 1.0,
    stopLossPips: 20,
    assetType: "Forex", // "Forex" | "Gold" | "Crypto"
  });

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [tradesRes, logsRes] = await Promise.all([
          fetch("/api/trades"),
          fetch("/api/psychology")
        ]);

        if (tradesRes.ok) {
          const tradesData = await tradesRes.json();
          setTrades(tradesData.trades);
        }
        if (logsRes.ok) {
          const logsData = await logsRes.json();
          setLogs(logsData.logs);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  // Reset Checklist
  const resetChecklist = () => {
    setChecklist({
      trendAligned: false,
      keyZone: false,
      riskDefined: false,
      timeframeConfirm: false,
      emotionsChecked: false,
    });
  };

  // Checklist Score Calculation
  const checklistCheckedCount = Object.values(checklist).filter(Boolean).length;
  const checklistPercentage = Math.round((checklistCheckedCount / 5) * 100);

  // Position Size Calculator Math
  const dollarRisk = parseFloat((calc.balance * (calc.riskPercent / 100)).toFixed(2));
  let calculatedLotSize = 0;

  if (calc.stopLossPips > 0) {
    if (calc.assetType === "Forex") {
      // Standard Forex math: 1 standard lot is 100,000 units. 1 pip is $10 at 1.00 lot.
      calculatedLotSize = dollarRisk / (calc.stopLossPips * 10);
    } else if (calc.assetType === "Gold") {
      // Standard Gold (XAUUSD) math: 1 standard lot represents 100 oz. 1 pip/point difference is $10 at 1.00 lot.
      calculatedLotSize = dollarRisk / (calc.stopLossPips * 10);
    } else if (calc.assetType === "Crypto") {
      // Crypto position sizing (e.g. BTCUSD): Lot size = Dollar risk / stop loss difference (points)
      calculatedLotSize = dollarRisk / calc.stopLossPips;
    }
  }
  const lotSizeOutput = parseFloat(calculatedLotSize.toFixed(3));

  // Compute Performance Metrics
  const totalTrades = trades.length;
  const winTrades = trades.filter(t => t.result === "WIN").length;
  const winRate = totalTrades > 0 ? Math.round((winTrades / totalTrades) * 100) : 0;
  const netPnL = trades.reduce((sum, t) => sum + t.pnl, 0);

  // Compute Avg RR ratio
  let rawRRRatio = 0.0;
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
      rawRRRatio = totalRR / counts;
      avgRR = `1:${rawRRRatio.toFixed(1)}`;
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

  // Dynamic AI Grading Scale Calculations
  // 1. Discipline Index Grade (From psychology logs avg discipline score)
  const avgDisciplineScore = logs.length > 0 
    ? logs.reduce((sum, l) => sum + l.disciplineScore, 0) / logs.length
    : null;

  let disciplineGrade = "A";
  let disciplineGradeColor = "text-emerald-400";
  if (avgDisciplineScore !== null) {
    if (avgDisciplineScore >= 9.0) {
      disciplineGrade = "A+";
      disciplineGradeColor = "text-emerald-400";
    } else if (avgDisciplineScore >= 8.0) {
      disciplineGrade = "A";
      disciplineGradeColor = "text-emerald-400";
    } else if (avgDisciplineScore >= 7.0) {
      disciplineGrade = "B";
      disciplineGradeColor = "text-violet-400";
    } else if (avgDisciplineScore >= 5.5) {
      disciplineGrade = "C";
      disciplineGradeColor = "text-yellow-400";
    } else {
      disciplineGrade = "D";
      disciplineGradeColor = "text-rose-400";
    }
  }

  // 2. Risk-to-Reward Grade (From trades actual SL vs TP ratios)
  let rrGrade = "B";
  let rrGradeColor = "text-violet-400";
  if (totalTrades > 0) {
    if (rawRRRatio >= 2.5) {
      rrGrade = "A+";
      rrGradeColor = "text-emerald-400";
    } else if (rawRRRatio >= 2.0) {
      rrGrade = "A";
      rrGradeColor = "text-emerald-400";
    } else if (rawRRRatio >= 1.5) {
      rrGrade = "B";
      rrGradeColor = "text-violet-400";
    } else if (rawRRRatio >= 1.0) {
      rrGrade = "C";
      rrGradeColor = "text-yellow-400";
    } else {
      rrGrade = "F";
      rrGradeColor = "text-rose-400";
    }
  }

  // 3. Consistency Grade (From overall Win Rate)
  let consistencyGrade = "C";
  let consistencyGradeColor = "text-yellow-400";
  if (totalTrades > 0) {
    if (winRate >= 60) {
      consistencyGrade = "A";
      consistencyGradeColor = "text-emerald-400";
    } else if (winRate >= 50) {
      consistencyGrade = "B";
      consistencyGradeColor = "text-violet-400";
    } else if (winRate >= 40) {
      consistencyGrade = "C";
      consistencyGradeColor = "text-yellow-400";
    } else {
      consistencyGrade = "D";
      consistencyGradeColor = "text-rose-400";
    }
  }

  // AI Recommendation based on grading outcomes
  let aiReportTip = "Log your first few trades and psychology logs to enable standard cognitive pattern evaluations.";
  if (totalTrades > 0 || logs.length > 0) {
    if (disciplineGrade === "D" || disciplineGrade === "C") {
      aiReportTip = "💡 Your discipline grade is struggling. Impulsive FOMO/Revenge entries are your main bottleneck. Follow the Pre-Trade Checklist strictly!";
    } else if (rrGrade === "F" || rrGrade === "C") {
      aiReportTip = "💡 Poor risk-reward layouts detected. Even with high win-rates, tight RR spacing limits long-term compounding. Push TP targets to 1:2 standard minimums.";
    } else if (consistencyGrade === "D") {
      aiReportTip = "💡 Win consistency is low. Audit your market bias. Focus only on EURUSD or Gold standard structures and block out secondary volatile setups.";
    } else {
      aiReportTip = "🎯 Outstanding balance! Your discipline and risk spacings are highly professional. Continue following standard lot allocations.";
    }
  }

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
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Banner Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Performance Dashboard</h2>
          <p className="mt-1.5 text-sm text-slate-400">
            Real-time trade metrics parsed and audited by TradeMind AI.
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
              className="rounded-xl border border-slate-800 bg-slate-950/45 px-5 py-3 text-sm font-semibold text-slate-350 hover:bg-slate-900"
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

            {/* AI Performance Report Card (GRADE GRID) */}
            <div className="glass-panel rounded-3xl p-6 shadow-xl flex flex-col justify-between border border-violet-500/10">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-violet-400 animate-float" />
                    AI Mentor Report Card
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-violet-600/10 text-violet-400 px-2 py-0.5 rounded border border-violet-500/20">
                    Live Score
                  </span>
                </div>

                {/* Card Grades Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {/* Discipline */}
                  <div className="bg-slate-950/45 border border-slate-900 rounded-2xl p-3 text-center">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Discipline</p>
                    <p className={`text-2xl font-black mt-2 ${disciplineGradeColor}`}>{disciplineGrade}</p>
                    <span className="text-[8px] text-slate-500 mt-1 block">
                      {avgDisciplineScore !== null ? `${avgDisciplineScore.toFixed(1)}/10` : "N/A"}
                    </span>
                  </div>

                  {/* RR Spacing */}
                  <div className="bg-slate-950/45 border border-slate-900 rounded-2xl p-3 text-center">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Risk:Reward</p>
                    <p className={`text-2xl font-black mt-2 ${rrGradeColor}`}>{rrGrade}</p>
                    <span className="text-[8px] text-slate-500 mt-1 block">{avgRR}</span>
                  </div>

                  {/* Win Consistency */}
                  <div className="bg-slate-950/45 border border-slate-900 rounded-2xl p-3 text-center">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Consistency</p>
                    <p className={`text-2xl font-black mt-2 ${consistencyGradeColor}`}>{consistencyGrade}</p>
                    <span className="text-[8px] text-slate-500 mt-1 block">{winRate}% WR</span>
                  </div>
                </div>

                {/* AI Advice */}
                <div className="bg-violet-950/10 border border-violet-500/10 rounded-2xl p-4 text-xs leading-relaxed text-slate-300">
                  {aiReportTip}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-900/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">Workspace Health:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Fully Optimized
                </span>
              </div>
            </div>
          </div>

          {/* ADVANCED SUITE: Pre-Trade Checklist & Risk Calculator */}
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* 📋 Pre-Trade Checklist */}
            <div className="glass-panel rounded-3xl p-6 shadow-xl flex flex-col justify-between border border-violet-500/10">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-slate-900/60 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-violet-400" />
                    Pre-Trade Strategy Checklist
                  </h3>
                  <button 
                    onClick={resetChecklist} 
                    className="text-xs text-slate-500 hover:text-slate-350 flex items-center gap-1 font-semibold transition"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Reset
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4.5">
                  Check all standard system requirements before pushing execution triggers to eliminate impulse behaviors.
                </p>

                {/* Checklist options */}
                <div className="space-y-3">
                  {/* Option 1 */}
                  <label className="flex items-start gap-3 bg-slate-950/40 border border-slate-900 p-3 rounded-xl cursor-pointer hover:border-slate-800 transition">
                    <input 
                      type="checkbox" 
                      checked={checklist.trendAligned}
                      onChange={(e) => setChecklist({ ...checklist, trendAligned: e.target.checked })}
                      className="mt-0.5 rounded text-violet-600 focus:ring-violet-500 accent-violet-600 h-4 w-4 bg-slate-900 border-slate-800"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-200">📈 Higher Timeframe Trend Alignment</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Execution is verified to be in the direction of major Daily/4H structures.</p>
                    </div>
                  </label>

                  {/* Option 2 */}
                  <label className="flex items-start gap-3 bg-slate-950/40 border border-slate-900 p-3 rounded-xl cursor-pointer hover:border-slate-800 transition">
                    <input 
                      type="checkbox" 
                      checked={checklist.keyZone}
                      onChange={(e) => setChecklist({ ...checklist, keyZone: e.target.checked })}
                      className="mt-0.5 rounded text-violet-600 focus:ring-violet-500 accent-violet-600 h-4 w-4 bg-slate-900 border-slate-800"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-200">🎯 Key Supply/Demand Zone</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Trade entry lies directly at a key Support/Resistance structure or Order Block.</p>
                    </div>
                  </label>

                  {/* Option 3 */}
                  <label className="flex items-start gap-3 bg-slate-950/40 border border-slate-900 p-3 rounded-xl cursor-pointer hover:border-slate-800 transition">
                    <input 
                      type="checkbox" 
                      checked={checklist.riskDefined}
                      onChange={(e) => setChecklist({ ...checklist, riskDefined: e.target.checked })}
                      className="mt-0.5 rounded text-violet-600 focus:ring-violet-500 accent-violet-600 h-4 w-4 bg-slate-900 border-slate-800"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-200">🛡️ Defined Stop-Loss & Risk &lt; 2%</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Stop loss is placed at an invalidation point. Total loss potential is audited.</p>
                    </div>
                  </label>

                  {/* Option 4 */}
                  <label className="flex items-start gap-3 bg-slate-950/40 border border-slate-900 p-3 rounded-xl cursor-pointer hover:border-slate-800 transition">
                    <input 
                      type="checkbox" 
                      checked={checklist.timeframeConfirm}
                      onChange={(e) => setChecklist({ ...checklist, timeframeConfirm: e.target.checked })}
                      className="mt-0.5 rounded text-violet-600 focus:ring-violet-500 accent-violet-600 h-4 w-4 bg-slate-900 border-slate-800"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-200">⏳ Candlestick Trigger Confirmation</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Wait for a candle close (e.g. rejection wick, engulfing bar) on the execution chart.</p>
                    </div>
                  </label>

                  {/* Option 5 */}
                  <label className="flex items-start gap-3 bg-slate-950/40 border border-slate-900 p-3 rounded-xl cursor-pointer hover:border-slate-800 transition">
                    <input 
                      type="checkbox" 
                      checked={checklist.emotionsChecked}
                      onChange={(e) => setChecklist({ ...checklist, emotionsChecked: e.target.checked })}
                      className="mt-0.5 rounded text-violet-600 focus:ring-violet-500 accent-violet-600 h-4 w-4 bg-slate-900 border-slate-800"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-200">🧘 Psychological Stability Audit</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Mind is detached from previous wins/losses. Zero revenge or FOMO impulse.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Checklist visual score result */}
              <div className="mt-6 flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-900">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Readiness Rating</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-black text-white">{checklistPercentage}%</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      checklistPercentage === 100 
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" 
                        : "bg-slate-900 text-slate-500"
                    }`}>
                      {checklistPercentage === 100 ? "Ready to Execute!" : "Checklist Incomplete"}
                    </span>
                  </div>
                </div>

                {/* Progress bar visual */}
                <div className="w-24 h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-violet-600 rounded-full transition-all duration-300"
                    style={{ width: `${checklistPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 🧮 Live Position Size & Risk Calculator */}
            <div className="glass-panel rounded-3xl p-6 shadow-xl flex flex-col justify-between border border-violet-500/10">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-slate-900/60 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-violet-400" />
                    Position Size & Risk Calculator
                  </h3>
                  <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">
                    Real-time Math
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4.5">
                  Calculate the exact lot size to input on your MT4/MT5/TradingView terminals instantly to keep precise capital allocations.
                </p>

                {/* Calculator Inputs Grid */}
                <div className="space-y-4">
                  
                  {/* Row 1 */}
                  <div className="grid gap-4 grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Account Size ($)</label>
                      <input 
                        type="number"
                        value={calc.balance}
                        onChange={(e) => setCalc({ ...calc, balance: Math.max(0, parseFloat(e.target.value) || 0) })}
                        className="block w-full rounded-xl border border-slate-900 bg-slate-950/45 px-3 py-2.5 text-white placeholder-slate-500 shadow-sm focus:border-violet-500 focus:outline-none text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Risk Limit (%)</label>
                      <input 
                        type="number"
                        step="0.1"
                        value={calc.riskPercent}
                        onChange={(e) => setCalc({ ...calc, riskPercent: Math.max(0, parseFloat(e.target.value) || 0) })}
                        className="block w-full rounded-xl border border-slate-900 bg-slate-950/45 px-3 py-2.5 text-white placeholder-slate-500 shadow-sm focus:border-violet-500 focus:outline-none text-xs"
                      />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid gap-4 grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Stop Loss (Pips/Points)</label>
                      <input 
                        type="number"
                        value={calc.stopLossPips}
                        onChange={(e) => setCalc({ ...calc, stopLossPips: Math.max(1, parseFloat(e.target.value) || 0) })}
                        className="block w-full rounded-xl border border-slate-900 bg-slate-950/45 px-3 py-2.5 text-white placeholder-slate-500 shadow-sm focus:border-violet-500 focus:outline-none text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Asset Type</label>
                      <select 
                        value={calc.assetType}
                        onChange={(e) => setCalc({ ...calc, assetType: e.target.value })}
                        className="block w-full rounded-xl border border-slate-900 bg-slate-950/45 px-3 py-2.5 text-white shadow-sm focus:border-violet-500 focus:outline-none text-xs"
                      >
                        <option value="Forex">Forex (EUR/GBP/JPY)</option>
                        <option value="Gold">Gold (XAUUSD)</option>
                        <option value="Crypto">Crypto (BTC/ETH)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculator Output Grid */}
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-900 pt-5">
                <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Total Cash At Risk</span>
                  <p className="text-xl font-black text-rose-450 mt-1">${dollarRisk.toLocaleString()}</p>
                  <span className="text-[8px] text-slate-500 block mt-0.5">({calc.riskPercent}% size)</span>
                </div>

                <div className="bg-slate-950/60 border border-violet-500/10 rounded-2xl p-4 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Recommended Position</span>
                  <p className="text-xl font-black text-violet-400 mt-1">{lotSizeOutput} Lots</p>
                  <span className="text-[8px] text-slate-500 block mt-0.5">
                    {calc.assetType === "Crypto" ? "Units" : "Standard Lots"}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Asset Analytics & Quick Insight */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Pairs Stats Card */}
            <div className="glass-panel rounded-3xl p-6 shadow-xl flex flex-col justify-between lg:col-span-1">
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

            {/* Recent Trades Snapshot Table (Span 2) */}
            <div className="glass-panel rounded-3xl p-6 shadow-xl lg:col-span-2">
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
