"use client";

import React, { useEffect, useState } from "react";
import { 
  BrainCircuit, 
  Sparkles, 
  Smile, 
  Meh, 
  Frown, 
  AlertOctagon, 
  History,
  TrendingUp,
  Sliders,
  Loader2
} from "lucide-react";

interface PsychologyLog {
  id: string;
  moodBefore: string;
  emotionAfter?: string;
  disciplineScore: number;
  notes?: string;
  createdAt: string;
}

export default function PsychologyPage() {
  const [logs, setLogs] = useState<PsychologyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [moodBefore, setMoodBefore] = useState("Confident");
  const [emotionAfter, setEmotionAfter] = useState("Satisfied");
  const [disciplineScore, setDisciplineScore] = useState(8);
  const [notes, setNotes] = useState("");

  const moods = [
    { name: "Confident", emoji: "😎", desc: "Solid analysis; calm execution" },
    { name: "Fear", emoji: "😨", desc: "Scared of taking loss; hesitation" },
    { name: "FOMO", emoji: "🚀", desc: "Chasing price aggressively" },
    { name: "Angry", emoji: "😡", desc: "Revenge entry; high frustration" },
    { name: "Excited", emoji: "🤩", desc: "Overconfident; higher risk size" },
  ];

  const emotions = [
    { name: "Satisfied", emoji: "🎯" },
    { name: "Regret", emoji: "🤦" },
    { name: "Frustrated", emoji: "🗯️" },
    { name: "Greedy", emoji: "🤑" },
  ];

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    try {
      const res = await fetch("/api/psychology");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
      }
    } catch (err) {
      console.error("Failed to load logs", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/psychology", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moodBefore,
          emotionAfter,
          disciplineScore,
          notes,
        }),
      });

      if (res.ok) {
        setNotes("");
        setDisciplineScore(8);
        loadLogs();
      } else {
        alert("Failed to save psychology log.");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setSaving(false);
    }
  };

  // Determine main pattern based on logs
  const angryLogs = logs.filter(l => l.moodBefore === "Angry").length;
  const fomoLogs = logs.filter(l => l.moodBefore === "FOMO").length;
  const avgDiscipline = logs.length > 0 
    ? (logs.reduce((sum, l) => sum + l.disciplineScore, 0) / logs.length).toFixed(1) 
    : "10.0";

  let aiPsychMessage = "Mera AI analysis batata hai ke aap proper discipline maintain kar rahe hain. Standard rule execution se aapka mental game highly professional hai.";
  if (angryLogs > 0 || fomoLogs > 0) {
    if (angryLogs >= fomoLogs) {
      aiPsychMessage = "Caution: Maine aapki patterns mein **Revenge Trading** detect kiya hai! Jab aap 'Angry' mood mein log hote hain, to aap loss hone per immediate high lot entries lete hain. Mera mashwara hai ke system ko 1 ghante ke liye off kar dein jab bhi trade close ho!";
    } else {
      aiPsychMessage = "Alert: Aapki entries mein **FOMO (Fear of Missing Out)** pattern heavy hai. Aap price key zones per aane se pehle hi entry trigger kar dete hain. Wait for candle close confirmations!";
    }
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Trading Psychology Tracker</h2>
        <p className="mt-1.5 text-sm text-slate-400">
          Track your emotional states and discipline metrics to eliminate emotional mistakes.
        </p>
      </div>

      {/* Main split grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form panel */}
        <div className="glass-panel rounded-3xl p-6 lg:col-span-2 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-violet-400" />
            Log Mental State
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mood Before */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Mood Before Trade Entry
              </label>
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-5">
                {moods.map((m) => (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => setMoodBefore(m.name)}
                    className={`flex flex-col items-center justify-center rounded-xl p-3 border text-center transition-all ${
                      moodBefore === m.name
                        ? "bg-violet-600 border-violet-500 text-white shadow shadow-violet-600/30 scale-102"
                        : "bg-slate-950/45 border-slate-900 text-slate-400 hover:border-slate-800"
                    }`}
                  >
                    <span className="text-2xl mb-1.5">{m.emoji}</span>
                    <span className="text-xs font-bold">{m.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Emotion After */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Emotion After Close
              </label>
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                {emotions.map((e) => (
                  <button
                    key={e.name}
                    type="button"
                    onClick={() => setEmotionAfter(e.name)}
                    className={`flex items-center gap-2.5 rounded-xl px-4 py-3 border transition-all ${
                      emotionAfter === e.name
                        ? "bg-violet-600 border-violet-500 text-white shadow shadow-violet-600/30 scale-102"
                        : "bg-slate-950/45 border-slate-900 text-slate-400 hover:border-slate-800"
                    }`}
                  >
                    <span className="text-xl">{e.emoji}</span>
                    <span className="text-xs font-bold">{e.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Discipline Slider */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Discipline Score
                </label>
                <span className="text-sm font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-md">
                  {disciplineScore} / 10
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Sliders className="h-5 w-5 text-slate-500 shrink-0" />
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={disciplineScore}
                  onChange={(e) => setDisciplineScore(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Mental Thoughts / Notes</label>
              <textarea
                rows={3}
                placeholder="Write your mental process... Were you scared of taking a loss? Did you move your stop loss during the trade? Be honest."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="block w-full rounded-xl border border-slate-900 bg-slate-950/45 py-3 px-4 text-slate-200 placeholder-slate-500 shadow-sm focus:border-violet-500 focus:outline-none text-xs resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="glow-btn flex w-full justify-center rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
            >
              {saving ? "Saving Log..." : "Save Psychology Log"}
            </button>
          </form>
        </div>

        {/* Coach Insight & KPI side */}
        <div className="space-y-6">
          {/* AI Coach Card */}
          <div className="glass-panel border-violet-500/15 rounded-3xl p-6 bg-violet-950/5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-violet-400 font-bold text-sm">
              <Sparkles className="h-4.5 w-4.5 animate-float" />
              AI Mind Analyst
            </div>
            
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Psychology Metric Summary</p>
              <div className="mt-2.5 flex items-center justify-between rounded-xl bg-slate-950/40 p-4 border border-slate-900">
                <span className="text-xs text-slate-400 font-medium">Average Discipline Score:</span>
                <span className="text-base font-black text-emerald-400">{avgDiscipline} / 10</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Mentorship Feedback</p>
              <p className="text-xs text-slate-300 leading-relaxed mt-2.5 p-3 rounded-xl bg-slate-950/30 border border-slate-900">
                {aiPsychMessage}
              </p>
            </div>
          </div>

          {/* Past History Logs Timeline */}
          <div className="glass-panel rounded-3xl p-6 shadow-xl space-y-4 max-h-[360px] overflow-y-auto">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="h-4.5 w-4.5 text-slate-400" />
              Log Timeline
            </h3>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
              </div>
            ) : logs.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No past logs captured yet.</p>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => {
                  const mInfo = moods.find(m => m.name === log.moodBefore) || { emoji: "🤔" };
                  return (
                    <div key={log.id} className="rounded-xl bg-slate-950/30 border border-slate-900 p-3.5 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5 font-bold text-slate-200">
                          <span className="text-lg">{mInfo.emoji}</span>
                          {log.moodBefore} 
                          {log.emotionAfter && (
                            <span className="text-[10px] text-slate-500 font-normal">
                              → ended {log.emotionAfter}
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(log.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      {log.notes && <p className="text-slate-400 leading-relaxed italic">“{log.notes}”</p>}
                      <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-900/60 pt-1.5">
                        <span>Discipline rating:</span>
                        <span className="font-bold text-violet-400">{log.disciplineScore} / 10</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


