"use client";

import React, { useEffect, useState } from "react";
import { 
  Plus, 
  Upload, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  BookOpen,
  Image as ImageIcon,
  AlertTriangle,
  Lightbulb,
  X,
  FileText,
  Loader2
} from "lucide-react";

interface AiAnalysis {
  mistakes: string;
  riskRewardAssessment: string;
  generalFeedback: string;
  suggestions: string;
}

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
  screenshotUrl?: string;
  notes?: string;
  createdAt: string;
  analysis?: AiAnalysis;
}

export default function JournalPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploadTab, setUploadTab] = useState<"manual" | "screenshot">("manual");
  const [expandedTradeId, setExpandedTradeId] = useState<string | null>(null);

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [filterResult, setFilterResult] = useState<string>("ALL");
  const [filterType, setFilterType] = useState<string>("ALL");

  // Form states
  const [manualForm, setManualForm] = useState({
    pair: "",
    type: "BUY",
    entryPrice: "",
    sl: "",
    tp: "",
    lotSize: "",
    pnl: "",
    result: "WIN",
    notes: "",
  });

  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotBase64, setScreenshotBase64] = useState<string>("");
  const [uploadingProgress, setUploadingProgress] = useState(false);

  useEffect(() => {
    loadTrades();
  }, []);

  async function loadTrades() {
    try {
      const res = await fetch("/api/trades");
      if (res.ok) {
        const data = await res.json();
        setTrades(data.trades);
      }
    } catch (err) {
      console.error("Failed to fetch trades", err);
    } finally {
      setLoading(false);
    }
  }

  // Handle file picker
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshotFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit manual form
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingProgress(true);

    try {
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isScreenshot: false,
          ...manualForm,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setManualForm({
          pair: "",
          type: "BUY",
          entryPrice: "",
          sl: "",
          tp: "",
          lotSize: "",
          pnl: "",
          result: "WIN",
          notes: "",
        });
        loadTrades();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to log trade.");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setUploadingProgress(false);
    }
  };

  // Submit screenshot
  const handleScreenshotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshotBase64) {
      alert("Please choose a screenshot first.");
      return;
    }

    setUploadingProgress(true);

    try {
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isScreenshot: true,
          screenshot: screenshotBase64,
          fileName: screenshotFile?.name || "upload.png",
          notes: "Auto-analyzed trade screenshot",
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setScreenshotFile(null);
        setScreenshotBase64("");
        loadTrades();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to process Vision screenshot.");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setUploadingProgress(false);
    }
  };

  const toggleExpandTrade = (id: string) => {
    setExpandedTradeId(expandedTradeId === id ? null : id);
  };

  // Filtered List
  const filteredTrades = trades.filter((trade) => {
    const matchesSearch = trade.pair.toLowerCase().includes(search.toLowerCase());
    const matchesResult = filterResult === "ALL" || trade.result === filterResult;
    const matchesType = filterType === "ALL" || trade.type === filterType;
    return matchesSearch && matchesResult && matchesType;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Trading Journal</h2>
          <p className="mt-1.5 text-sm text-slate-400">
            Log manual entries or upload screenshots to review chart setup structures.
          </p>
        </div>
        <div>
          <button 
            onClick={() => setShowModal(true)}
            className="glow-btn flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow shadow-violet-600/20 hover:bg-violet-500"
          >
            <Plus className="h-4.5 w-4.5" />
            Add Trade Entry
          </button>
        </div>
      </div>

      {/* Filter Controls Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            placeholder="Search by asset (e.g. BTCUSD, EURUSD)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-xl border border-slate-900 bg-slate-950/45 py-3 pl-10 pr-4 text-slate-200 placeholder-slate-500 shadow-sm focus:border-violet-500 focus:outline-none text-sm"
          />
        </div>

        {/* Filter win/loss */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <Filter className="h-4.5 w-4.5" />
          </span>
          <select
            value={filterResult}
            onChange={(e) => setFilterResult(e.target.value)}
            className="block w-full rounded-xl border border-slate-900 bg-slate-950/45 py-3 pl-10 pr-4 text-slate-300 shadow-sm focus:border-violet-500 focus:outline-none text-sm appearance-none bg-no-repeat bg-[right_12px_center]"
          >
            <option value="ALL">All Outcomes</option>
            <option value="WIN">Wins</option>
            <option value="LOSS">Losses</option>
            <option value="BREAKEVEN">Breakeven</option>
          </select>
        </div>

        {/* Filter buy/sell */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <Filter className="h-4.5 w-4.5" />
          </span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="block w-full rounded-xl border border-slate-900 bg-slate-950/45 py-3 pl-10 pr-4 text-slate-300 shadow-sm focus:border-violet-500 focus:outline-none text-sm appearance-none bg-no-repeat bg-[right_12px_center]"
          >
            <option value="ALL">All Directions</option>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        </div>
      ) : filteredTrades.length === 0 ? (
        <div className="glass-panel flex flex-col items-center justify-center rounded-3xl p-16 text-center shadow-xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
            <BookOpen className="h-7 w-7" />
          </div>
          <h3 className="mt-6 text-lg font-bold text-white">No journal entries found</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-400">
            Modify your filters or log a new trade to see entries listed.
          </p>
        </div>
      ) : (
        /* Trades List */
        <div className="space-y-4">
          {filteredTrades.map((trade) => {
            const isExpanded = expandedTradeId === trade.id;
            return (
              <div 
                key={trade.id} 
                className="glass-panel rounded-2xl shadow transition-all duration-300 hover:border-violet-500/30 overflow-hidden"
              >
                {/* Header overview line */}
                <div 
                  onClick={() => toggleExpandTrade(trade.id)}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 cursor-pointer gap-4"
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-black tracking-wider ${
                      trade.result === "WIN" 
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" 
                        : "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                    }`}>
                      {trade.result}
                    </span>

                    <div>
                      <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                        {trade.pair}
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          trade.type === "BUY" ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
                        }`}>
                          {trade.type}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(trade.createdAt).toLocaleDateString(undefined, { 
                          month: "short", 
                          day: "numeric", 
                          hour: "2-digit", 
                          minute: "2-digit" 
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-8">
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-semibold text-slate-500 uppercase">Entry Price</p>
                      <p className="text-sm font-bold text-slate-200 mt-0.5">{trade.entryPrice}</p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xs font-semibold text-slate-500 uppercase">Lot Size</p>
                      <p className="text-sm font-bold text-slate-200 mt-0.5">{trade.lotSize} Lots</p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xs font-semibold text-slate-500 uppercase">Profit / Loss</p>
                      <p className={`text-sm font-black mt-0.5 ${
                        trade.pnl >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}>
                        {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                      </p>
                    </div>

                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details / AI Review panel */}
                {isExpanded && (
                  <div className="border-t border-slate-900 bg-slate-950/30 p-6 space-y-6">
                    {/* Setup stats visual row */}
                    <div className="grid gap-4 sm:grid-cols-3 bg-slate-950/65 rounded-2xl p-4 border border-slate-900 text-xs">
                      <div>
                        <span className="font-semibold text-slate-500">Stop Loss (SL):</span>
                        <span className="font-bold text-slate-300 ml-1.5">{trade.sl}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-500">Take Profit (TP):</span>
                        <span className="font-bold text-slate-300 ml-1.5">{trade.tp}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-500">Execution Mode:</span>
                        <span className="font-bold text-violet-400 ml-1.5">
                          {trade.screenshotUrl ? "AI Vision OCR" : "Manual Log"}
                        </span>
                      </div>
                    </div>

                    {/* AI Coach Detailed Panel */}
                    {trade.analysis && (
                      <div className="glass-panel border-violet-500/10 rounded-2xl p-6 bg-violet-950/5 space-y-4">
                        <div className="flex items-center gap-2 text-violet-400 font-bold text-sm">
                          <Sparkles className="h-4.5 w-4.5 animate-float" />
                          AI Trading Mentor Critique
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-3.5">
                            {/* General feedback */}
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Coach Feedback</p>
                              <p className="text-sm text-slate-300 leading-relaxed mt-1">{trade.analysis.generalFeedback}</p>
                            </div>
                            
                            {/* Mistakes */}
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Identified Mistakes</p>
                              <div className="flex flex-wrap gap-2 mt-1.5">
                                {trade.analysis.mistakes.split(",").map((m) => (
                                  <span key={m} className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold px-2 py-0.5 rounded-md">
                                    <AlertTriangle className="h-3.5 w-3.5" />
                                    {m.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3.5">
                            {/* Risk rewards */}
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Risk Assessment</p>
                              <p className="text-sm text-slate-300 leading-relaxed mt-1">{trade.analysis.riskRewardAssessment}</p>
                            </div>

                            {/* Suggestions */}
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Actionable Suggestions</p>
                              <ul className="space-y-1.5 mt-1.5 text-xs text-slate-300">
                                {trade.analysis.suggestions.split(";").map((s, idx) => (
                                  <li key={idx} className="flex items-start gap-1.5">
                                    <Lightbulb className="h-3.5 w-3.5 text-yellow-400 shrink-0 mt-0.5" />
                                    <span>{s.trim()}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {trade.notes && (
                      <div className="text-xs">
                        <p className="font-bold text-slate-500 uppercase">Trader Notes</p>
                        <p className="text-slate-400 mt-1 leading-relaxed">{trade.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Upload/Add Modal drawer */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-float">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-900 bg-slate-950/40 p-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-violet-400" />
                Log Trade Entry
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Selector Tabs */}
            <div className="flex border-b border-slate-900 bg-slate-950/15">
              <button
                onClick={() => setUploadTab("manual")}
                className={`flex-1 py-4 text-center text-sm font-semibold transition-colors ${
                  uploadTab === "manual" 
                    ? "border-b-2 border-violet-500 text-white" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <FileText className="h-4 w-4" />
                  Manual entry
                </span>
              </button>
              <button
                onClick={() => setUploadTab("screenshot")}
                className={`flex-1 py-4 text-center text-sm font-semibold transition-colors ${
                  uploadTab === "screenshot" 
                    ? "border-b-2 border-violet-500 text-white" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Screenshot upload
                </span>
              </button>
            </div>

            {/* Content forms */}
            <div className="p-6">
              {uploadingProgress ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                  <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
                  <p className="text-sm font-semibold text-slate-300">
                    {uploadTab === "screenshot" 
                      ? "AI Vision is reading chart structure & mapping risk settings..."
                      : "Processing manual log into database..."}
                  </p>
                </div>
              ) : uploadTab === "manual" ? (
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div className="grid gap-4 grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">Asset Pair</label>
                      <input
                        type="text"
                        placeholder="e.g. EURUSD"
                        value={manualForm.pair}
                        onChange={(e) => setManualForm({ ...manualForm, pair: e.target.value })}
                        className="block w-full rounded-lg border border-slate-900 bg-slate-950/45 px-3 py-2 text-white placeholder-slate-500 shadow-sm focus:border-violet-500 focus:outline-none text-xs"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">Direction</label>
                      <select
                        value={manualForm.type}
                        onChange={(e) => setManualForm({ ...manualForm, type: e.target.value })}
                        className="block w-full rounded-lg border border-slate-900 bg-slate-950/45 px-3 py-2 text-white shadow-sm focus:border-violet-500 focus:outline-none text-xs"
                      >
                        <option value="BUY">BUY</option>
                        <option value="SELL">SELL</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 grid-cols-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">Entry Price</label>
                      <input
                        type="number"
                        step="any"
                        placeholder="1.0845"
                        value={manualForm.entryPrice}
                        onChange={(e) => setManualForm({ ...manualForm, entryPrice: e.target.value })}
                        className="block w-full rounded-lg border border-slate-900 bg-slate-950/45 px-3 py-2 text-white placeholder-slate-500 shadow-sm focus:border-violet-500 focus:outline-none text-xs"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">Stop Loss (SL)</label>
                      <input
                        type="number"
                        step="any"
                        placeholder="1.0820"
                        value={manualForm.sl}
                        onChange={(e) => setManualForm({ ...manualForm, sl: e.target.value })}
                        className="block w-full rounded-lg border border-slate-900 bg-slate-950/45 px-3 py-2 text-white placeholder-slate-500 shadow-sm focus:border-violet-500 focus:outline-none text-xs"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">Take Profit (TP)</label>
                      <input
                        type="number"
                        step="any"
                        placeholder="1.0920"
                        value={manualForm.tp}
                        onChange={(e) => setManualForm({ ...manualForm, tp: e.target.value })}
                        className="block w-full rounded-lg border border-slate-900 bg-slate-950/45 px-3 py-2 text-white placeholder-slate-500 shadow-sm focus:border-violet-500 focus:outline-none text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 grid-cols-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">Lot Size</label>
                      <input
                        type="number"
                        step="any"
                        placeholder="0.10"
                        value={manualForm.lotSize}
                        onChange={(e) => setManualForm({ ...manualForm, lotSize: e.target.value })}
                        className="block w-full rounded-lg border border-slate-900 bg-slate-950/45 px-3 py-2 text-white placeholder-slate-500 shadow-sm focus:border-violet-500 focus:outline-none text-xs"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">Net PnL ($)</label>
                      <input
                        type="number"
                        step="any"
                        placeholder="-25.00 or 150.00"
                        value={manualForm.pnl}
                        onChange={(e) => setManualForm({ ...manualForm, pnl: e.target.value })}
                        className="block w-full rounded-lg border border-slate-900 bg-slate-950/45 px-3 py-2 text-white placeholder-slate-500 shadow-sm focus:border-violet-500 focus:outline-none text-xs"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">Outcome</label>
                      <select
                        value={manualForm.result}
                        onChange={(e) => setManualForm({ ...manualForm, result: e.target.value })}
                        className="block w-full rounded-lg border border-slate-900 bg-slate-950/45 px-3 py-2 text-white shadow-sm focus:border-violet-500 focus:outline-none text-xs"
                      >
                        <option value="WIN">WIN</option>
                        <option value="LOSS">LOSS</option>
                        <option value="BREAKEVEN">BREAKEVEN</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Journal Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Specify your setup trigger details (e.g. FVG bounce, order block, liquidity grab)..."
                      value={manualForm.notes}
                      onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                      className="block w-full rounded-lg border border-slate-900 bg-slate-950/45 px-3 py-2 text-white placeholder-slate-500 shadow-sm focus:border-violet-500 focus:outline-none text-xs resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="glow-btn mt-6 flex w-full justify-center rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white shadow hover:bg-violet-500"
                  >
                    Log Manual Entry
                  </button>
                </form>
              ) : (
                /* Vision Screenshot upload */
                <form onSubmit={handleScreenshotSubmit} className="space-y-6">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl p-8 bg-slate-950/30 text-center hover:border-violet-500/40 transition-colors">
                    <Upload className="h-10 w-10 text-slate-500 mb-4" />
                    
                    <p className="text-sm font-bold text-white">Upload chart screenshot</p>
                    <p className="text-xs text-slate-400 mt-1 mb-4">
                      Supports PNG, JPG, JPEG up to 5MB.
                    </p>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="screenshot-picker"
                    />
                    <label
                      htmlFor="screenshot-picker"
                      className="glow-btn cursor-pointer rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-violet-500"
                    >
                      Choose file
                    </label>

                    {screenshotFile && (
                      <div className="mt-4 flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                        <ImageIcon className="h-4 w-4 text-violet-400" />
                        <span className="text-xs font-medium text-slate-300 max-w-xs truncate">
                          {screenshotFile.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!screenshotBase64}
                    className="glow-btn flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white shadow hover:bg-violet-500 disabled:opacity-50"
                  >
                    <Sparkles className="h-4.5 w-4.5 animate-float" />
                    Trigger AI Vision Critique
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


