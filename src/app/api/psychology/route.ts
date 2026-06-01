import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

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

    const logs = await prisma.psychologyLog.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ logs });
  } catch (error: any) {
    console.error("Fetch psychology logs error:", error);
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
    const { moodBefore, emotionAfter, disciplineScore, notes, tradeId } = body;

    if (!moodBefore || !disciplineScore) {
      return NextResponse.json(
        { error: "Mood before entry and discipline score are required." },
        { status: 400 }
      );
    }

    const newLog = await prisma.psychologyLog.create({
      data: {
        userId: decoded.userId,
        tradeId: tradeId || null,
        moodBefore,
        emotionAfter: emotionAfter || null,
        disciplineScore: parseInt(disciplineScore),
        notes: notes || null,
      },
    });

    return NextResponse.json({ log: newLog }, { status: 201 });
  } catch (error: any) {
    console.error("Create psychology log error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
