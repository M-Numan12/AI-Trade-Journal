import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { analyzeTradeScreenshot } from "@/lib/ai";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const trades = await prisma.trade.findMany({
      where: { userId: decoded.userId },
      include: {
        analysis: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ trades });
  } catch (error: any) {
    console.error("Fetch trades error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const { isScreenshot, screenshot, fileName, pair, type, entryPrice, sl, tp, lotSize, pnl, result, notes } = body;

    let tradeData: any = {};
    let aiAnalysisData: any = null;

    if (isScreenshot && screenshot) {
      // Vision AI upload
      const aiResponse = await analyzeTradeScreenshot(screenshot, fileName || "screenshot.png");
      
      tradeData = {
        pair: aiResponse.pair,
        type: aiResponse.type,
        entryPrice: aiResponse.entryPrice,
        sl: aiResponse.sl,
        tp: aiResponse.tp,
        lotSize: aiResponse.lotSize,
        pips: 0, // simple initial placeholder
        pnl: aiResponse.pnl,
        result: aiResponse.result,
        notes: notes ? `${notes}\n\n${aiResponse.notes}` : aiResponse.notes,
        screenshotUrl: "/placeholder-screenshot.png", // simulated file upload path
      };

      aiAnalysisData = {
        mistakes: aiResponse.mistakes.join(", "),
        riskRewardAssessment: aiResponse.riskRewardAssessment,
        generalFeedback: aiResponse.generalFeedback,
        suggestions: aiResponse.suggestions.join("; "),
      };
    } else {
      // Manual entry
      if (!pair || !type || !entryPrice || !sl || !tp || !lotSize || pnl === undefined || !result) {
        return NextResponse.json({ error: "Missing required manual fields" }, { status: 400 });
      }

      tradeData = {
        pair: pair.toUpperCase(),
        type: type.toUpperCase(),
        entryPrice: parseFloat(entryPrice),
        sl: parseFloat(sl),
        tp: parseFloat(tp),
        lotSize: parseFloat(lotSize),
        pnl: parseFloat(pnl),
        result: result.toUpperCase(),
        notes,
      };

      // Generate a quick AI analysis for manual entries too
      const risk = Math.abs(tradeData.entryPrice - tradeData.sl);
      const reward = Math.abs(tradeData.tp - tradeData.entryPrice);
      const rr = risk > 0 ? (reward / risk).toFixed(2) : "1.00";
      const isWin = tradeData.pnl > 0;

      aiAnalysisData = {
        mistakes: isWin ? "None detected" : "Check setup alignment, Late entry",
        riskRewardAssessment: `Risk-to-Reward ratio is 1:${rr}. ${
          parseFloat(rr) >= 2.0 ? "Excellent spacing." : "Tight margin; target higher targets."
        }`,
        generalFeedback: isWin
          ? `Nice execution on ${tradeData.pair}. Discipline with entry rules secure pips.`
          : `Market structural sweep triggered stop loss on ${tradeData.pair}. Check higher timeframe trends before execution.`,
        suggestions: isWin
          ? "Repeat standard sizes; protect profit triggers."
          : "Wait for candle confirmation; keep standard lot limits.",
      };
    }

    // Save in Transaction
    const newTrade = await prisma.$transaction(async (tx) => {
      const trade = await tx.trade.create({
        data: {
          ...tradeData,
          userId: decoded.userId,
        },
      });

      if (aiAnalysisData) {
        await tx.aiAnalysis.create({
          data: {
            ...aiAnalysisData,
            tradeId: trade.id,
          },
        });
      }

      return await tx.trade.findUnique({
        where: { id: trade.id },
        include: { analysis: true },
      });
    });

    return NextResponse.json({ trade: newTrade }, { status: 201 });
  } catch (error: any) {
    console.error("Create trade error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
