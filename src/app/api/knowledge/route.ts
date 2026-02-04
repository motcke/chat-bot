import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// Super simple GET - just return sources from DB
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chatbot = await prisma.chatbot.findFirst({
      where: { userId: user.id },
    });

    if (!chatbot) {
      return NextResponse.json([]);
    }

    const sources = await prisma.knowledgeSource.findMany({
      where: { chatbotId: chatbot.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        type: true,
        name: true,
        url: true,
        status: true,
        error: true,
        createdAt: true,
      },
    });

    return NextResponse.json(sources);
  } catch (error: any) {
    console.error("Knowledge GET error:", error?.message || error);
    // Return empty array on error instead of 500
    return NextResponse.json([]);
  }
}
