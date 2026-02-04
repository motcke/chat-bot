import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withRetry } from "@/lib/withRetry";

export const dynamic = 'force-dynamic';

const TEN_MINUTES_MS = 10 * 60 * 1000;

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chatbot = await withRetry(() =>
      prisma.chatbot.findFirst({
        where: { userId: user.id },
      })
    );

    if (!chatbot) {
      return NextResponse.json([]);
    }

    const sources = await withRetry(() =>
      prisma.knowledgeSource.findMany({
        where: { chatbotId: chatbot.id },
        orderBy: { createdAt: "desc" },
      })
    );

    // Check for stale "processing" sources - mark as failed on client side
    // Don't update DB here to avoid 502 errors from long-running updates
    const now = new Date();
    const processedSources = sources.map(source => {
      if (source.status === "processing") {
        const processingTime = now.getTime() - new Date(source.updatedAt).getTime();
        if (processingTime > TEN_MINUTES_MS) {
          // Return as failed without updating DB
          return {
            ...source,
            status: "failed",
            error: "העיבוד נכשל - תם הזמן. נסה שוב.",
          };
        }
      }
      return source;
    });

    return NextResponse.json(processedSources);
  } catch (error: any) {
    console.error("Knowledge GET error:", error?.message || error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
