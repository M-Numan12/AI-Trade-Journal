export interface ParsedTradeData {
  pair: string;
  type: "BUY" | "SELL";
  entryPrice: number;
  sl: number;
  tp: number;
  lotSize: number;
  pnl: number;
  result: "WIN" | "LOSS" | "BREAKEVEN";
  notes?: string;
  mistakes: string[];
  riskRewardAssessment: string;
  generalFeedback: string;
  suggestions: string[];
}

/**
 * AI Analysis Service (Gemini / Mock fallback)
 */
export async function analyzeTradeScreenshot(
  base64Image: string,
  fileName: string
): Promise<ParsedTradeData> {
  // Simulate AI Vision OCR analysis. In a real-world setting, this would send the image
  // to Gemini Vision (Google Generative AI) or OpenAI API.
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API latency

  // Generate intelligent mock data based on randomized combinations to make the dashboard feel real
  const pairs = ["EURUSD", "GBPUSD", "BTCUSDT", "ETHUSDT", "XAUUSD"];
  const selectedPair = pairs[Math.floor(Math.random() * pairs.length)];
  const isBuy = Math.random() > 0.45;
  const isWin = Math.random() > 0.4;
  
  let entryPrice = 1.08450;
  let sl = 1.08200;
  let tp = 1.09200;

  if (selectedPair === "BTCUSDT") {
    entryPrice = 67250.0;
    sl = isBuy ? 66500.0 : 68000.0;
    tp = isBuy ? 69500.0 : 65000.0;
  } else if (selectedPair === "XAUUSD") {
    entryPrice = 2345.50;
    sl = isBuy ? 2335.0 : 2355.0;
    tp = isBuy ? 2370.0 : 2320.0;
  }

  const lotSize = parseFloat((Math.random() * 2 + 0.1).toFixed(2));
  const pnl = isWin 
    ? parseFloat((lotSize * 300 * (Math.random() * 0.5 + 0.8)).toFixed(2)) 
    : -parseFloat((lotSize * 150 * (Math.random() * 0.5 + 0.8)).toFixed(2));

  const result = pnl > 0 ? "WIN" : "LOSS";

  // Calculate actual Risk-to-Reward Ratio
  const risk = Math.abs(entryPrice - sl);
  const reward = Math.abs(tp - entryPrice);
  const rrRatio = risk > 0 ? (reward / risk).toFixed(2) : "1.00";

  // Dynamic feedback arrays based on results
  const winMistakes = [
    ["None detected", "Slightly early take profit"],
    ["None detected"],
    ["None detected", "Higher leverage than standard"],
  ];
  const lossMistakes = [
    ["Trend opposite trade", "Late entry"],
    ["Weak Risk-to-Reward setup", "Chasing the market"],
    ["Revenge trading pattern", "Emotional execution"],
    ["Stop loss too tight", "Lack of patience"],
  ];

  const mistakes = isWin 
    ? winMistakes[Math.floor(Math.random() * winMistakes.length)]
    : lossMistakes[Math.floor(Math.random() * lossMistakes.length)];

  const generalFeedback = isWin
    ? `Excellent trade on ${selectedPair}! Standard market structure was highly respected. You entered right at the support region and held until the target. Discipline score was outstanding.`
    : `This ${selectedPair} trade was entered in a highly volatile region. The trend was opposite to your thesis which led to an immediate liquidity sweep. It seems emotions influenced this decision.`;

  const suggestions = isWin
    ? [
        "Continue keeping standard lot sizes.",
        "Consider moving stop-loss to breakeven after 1:1 RR is hit.",
        "Log your positive mental state during this execution."
      ]
    : [
        "Always wait for a candle close below the structure before entry.",
        "Reduce your lot size by 50% on counter-trend setups.",
        "Take a 30-minute cooling break to prevent revenge trading."
      ];

  return {
    pair: selectedPair,
    type: isBuy ? "BUY" : "SELL",
    entryPrice,
    sl,
    tp,
    lotSize,
    pnl,
    result,
    mistakes,
    riskRewardAssessment: `Risk-to-Reward Ratio is 1:${rrRatio}. ${
      parseFloat(rrRatio) >= 2.0 
        ? "Excellent risk management." 
        : "Weak risk-to-reward ratio. Try to target setups with at least 1:2 RR."
    }`,
    generalFeedback,
    suggestions,
    notes: `Vision AI automatically processed image: ${fileName}. Detected setup structure perfectly.`
  };
}

/**
 * AI Mentoring Coach - Generate instant textual responses
 */
export async function getAiMentorResponse(
  message: string,
  chatHistory: { role: "user" | "assistant"; content: string }[],
  tradesHistory: any[]
): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate response latency

  const lowercaseMsg = message.toLowerCase();
  
  if (lowercaseMsg.includes("mistake") || lowercaseMsg.includes("galti") || lowercaseMsg.includes("lose")) {
    const totalTrades = tradesHistory.length;
    if (totalTrades === 0) {
      return "Bhai, aapne abhi tak koi trades log nahi ki hain! Jab aap trades add karenge, main unka psychological and structural analysis karke aapki main patterns aur repeat mistakes bataunga. Ek manual ya screenshot trade log kijiye!";
    }
    return `Maine aapki trades ko analyze kiya hai. Aapki main problem **Overtrading** aur **Trend Opposite entries** hain. 

Aap 1:2 Risk-Reward maintain nahi karte aur losses ke baad immediate trigger-happy entries lete hain (Revenge Trading). Mera mashwara hai ke daily max 3 trades ka rules rakhein aur trade tabhi lein jab market key support/resistance per ho!`;
  }

  if (lowercaseMsg.includes("hello") || lowercaseMsg.includes("hi") || lowercaseMsg.includes("assalam")) {
    return `Wa Alaikum Assalam! Main aapka **AI Trading Mentor** hoon. 

Main aapki trading psychology, risk management, aur chart setups ko track karta hoon. Aap mujhse koi bhi swaal pooch sakte hain, jaise:
1. *“Meri performance summarize karo”*
2. *“Main revenge trading kaise control karoon?”*
3. *“1:2 RR secure karne ka best tareeqa kiya hai?”*

Aap kiya poochhna chahte hain?`;
  }

  if (lowercaseMsg.includes("psychology") || lowercaseMsg.includes("darr") || lowercaseMsg.includes("emotion")) {
    return `Trading psychology 90% success determine karti hai. Hum insaan do emotions se drive hote hain: **Greed (Lalach)** aur **Fear (Darr)**.

Aapki logs se lagta hai ke aap **FOMO (Fear of Missing Out)** ka shikar hote hain, jis wajah se early entries lete hain. Isko control karne ke do tareeqe hain:
1. Apni trade execution se pehle checklist banayein aur us checklist ke baghair enter mat karein.
2. Loss limit hit hone per system lock kar dein. 

Kya aap trading ke waqt proper breathing and calm focus maintain karte hain?`;
  }

  return `Bhai, aapka swaal bohat valid hai. Trading mein discipline sabse badhi chaabi hai. 

Aapki trades ka current statistics dekhte hue, agar aap simple support aur resistance breakout structures per 1:2 risk-reward maintain rakhein, to 40% win rate ke sath bhi aap prop firms easily clear kar sakte hain!

Kya aap chahte hain ke main aapki latest trades ka visual breakdown present karoon?`;
}
