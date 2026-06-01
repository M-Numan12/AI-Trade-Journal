import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { getAiMentorResponse } from "@/lib/ai";

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
    const { message, chatHistory } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    // Fetch user trades history to inject custom trading context
    const userTrades = await prisma.trade.findMany({
      where: { userId: decoded.userId },
      include: { analysis: true },
    });

    const aiMessage = await getAiMentorResponse(
      message,
      chatHistory || [],
      userTrades || []
    );

    return NextResponse.json({ message: aiMessage });
  } catch (error: any) {
    console.error("AI mentor endpoint error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
