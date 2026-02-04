import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withRetry } from "@/lib/withRetry";

export const dynamic = 'force-dynamic';

// Delete a conversation
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    // Verify the conversation belongs to the user's chatbot
    const conversation = await withRetry(() =>
      prisma.conversation.findFirst({
        where: {
          id: params.id,
          chatbotId: chatbot.id,
        },
      })
    );

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    // Delete the conversation (messages will be deleted via cascade)
    await withRetry(() =>
      prisma.conversation.delete({
        where: { id: params.id },
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete conversation error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
