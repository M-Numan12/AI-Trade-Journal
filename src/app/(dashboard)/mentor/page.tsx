"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Volume2, 
  Zap, 
  ShieldAlert,
  HelpCircle,
  Loader2
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function MentorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Wa Alaikum Assalam! Main aapka **AI Trading Mentor** hoon.\n\nMain aapki logged trades aur psychology records ko read karke aapke setups, risk management, aur repeat mental mistakes ko detect karta hoon. Aap mujhse trading-related kuch bhi pooch sakte hain!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickQuestions = [
    "Meri performance summarize karo",
    "Main revenge trading kaise control karoon?",
    "1:2 RR secure karne ka best tareeqa kiya hai?",
  ];

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: messages,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { 
            role: "assistant", 
            content: "Maaf kijiye bhai, server connection issues ki wajah se respond nahi kar saka. Please try again in a moment." 
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[82vh] flex-col gap-6">
      {/* Title */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Bot className="h-8 w-8 text-violet-500 animate-float" />
            AI Mentor Chat
          </h2>
          <p className="mt-1.5 text-sm text-slate-400">
            Discuss trading psychology strategies, ask questions, and review your logs.
          </p>
        </div>

        {/* Status pill */}
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-400">
          <Zap className="h-3.5 w-3.5" />
          Mentor Active
        </div>
      </div>

      {/* Main chat interface grid */}
      <div className="grid gap-6 lg:grid-cols-4 flex-1 min-h-0">
        {/* Chat Timeline (Col span 3) */}
        <div className="glass-panel rounded-3xl p-6 lg:col-span-3 shadow-xl flex flex-col min-h-0 bg-slate-950/20">
          {/* Scroll Area */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-4 max-w-3xl ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div className={`flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-xl font-bold shadow ${
                  msg.role === "assistant" 
                    ? "bg-violet-600 text-white shadow-violet-600/35" 
                    : "bg-slate-900 border border-slate-800 text-violet-400"
                }`}>
                  {msg.role === "assistant" ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                </div>

                {/* Bubble */}
                <div className={`rounded-2xl p-4 text-sm leading-relaxed shadow-sm border ${
                  msg.role === "assistant" 
                    ? "bg-slate-950/45 border-slate-900/60 text-slate-200" 
                    : "bg-violet-600 border-violet-500 text-white"
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              /* Typing Indicator */
              <div className="flex gap-4 max-w-3xl">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow shadow-violet-600/35">
                  <Bot className="h-5 w-5 animate-pulse" />
                </div>
                <div className="rounded-2xl p-4 bg-slate-950/45 border border-slate-900/60 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick options Pills */}
          <div className="mt-4 shrink-0 flex flex-wrap gap-2.5">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSendMessage(q)}
                disabled={loading}
                className="rounded-full bg-slate-950/65 border border-slate-900 hover:border-violet-500/25 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-all disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
            className="mt-4 shrink-0 flex items-center gap-3"
          >
            <input
              type="text"
              placeholder="Ask AI mentor about your risk, trading mistakes or psychological tips..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="block flex-1 rounded-xl border border-slate-900 bg-slate-950/50 py-3.5 px-4 text-slate-200 placeholder-slate-500 shadow-sm focus:border-violet-500 focus:outline-none text-xs"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="glow-btn flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow shadow-violet-600/20 hover:bg-violet-500 disabled:opacity-50"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>

        {/* Coach Rules & Tips (Col span 1) */}
        <div className="glass-panel rounded-3xl p-6 shadow-xl space-y-5 hidden lg:block bg-slate-950/10">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="h-4.5 w-4.5 text-yellow-400" />
            Mentor Rules
          </h3>
          
          <div className="space-y-4 text-xs leading-relaxed text-slate-400">
            <div className="rounded-xl bg-slate-950/40 border border-slate-900 p-3.5">
              <p className="font-bold text-slate-200">Rule #1: Max 3 Trades</p>
              <p className="mt-1">Kabhi bhi daily 3 trades se zyada execute mat karein. Overtrading accounts blown karne ki main wajah hai.</p>
            </div>

            <div className="rounded-xl bg-slate-950/40 border border-slate-900 p-3.5">
              <p className="font-bold text-slate-200">Rule #2: 1:2 RR Limit</p>
              <p className="mt-1">Humesha stop-loss aur take-profit minimum 1:2 ratio mein spacing pe rakhein. Win rate kam hone pe bhi profitable rahenge.</p>
            </div>

            <div className="rounded-xl bg-slate-950/40 border border-slate-900 p-3.5">
              <p className="font-bold text-slate-200">Rule #3: Lock System</p>
              <p className="mt-1">Jab bhi 2 consecutive loss hit ho jayein, system lock kar dein aur daily limit khatam karein. Revenge trading ko rokein!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


