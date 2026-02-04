import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// Simple upload - save text and mark as ready immediately
// No embeddings, no processing, just save the text
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chatbot = await prisma.chatbot.findFirst({
      where: { userId: user.id },
    });

    if (!chatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const results = [];

    for (const file of files) {
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: `הקובץ ${file.name} גדול מדי (מקסימום 5MB)` },
          { status: 400 }
        );
      }

      // Only allow text files
      const allowedExtensions = [".txt", ".md", ".csv", ".json"];
      const ext = file.name.toLowerCase().substring(file.name.lastIndexOf("."));

      if (!allowedExtensions.includes(ext)) {
        return NextResponse.json(
          { error: `סוג הקובץ ${ext} לא נתמך. נתמכים: ${allowedExtensions.join(", ")}` },
          { status: 400 }
        );
      }

      // Read file content
      const buffer = Buffer.from(await file.arrayBuffer());
      const content = buffer.toString("utf-8");

      if (!content.trim()) {
        return NextResponse.json(
          { error: `הקובץ ${file.name} ריק` },
          { status: 400 }
        );
      }

      // Save to database - immediately ready (no processing needed)
      const source = await prisma.knowledgeSource.create({
        data: {
          chatbotId: chatbot.id,
          type: "file",
          name: file.name,
          content: content.slice(0, 100000), // Limit to 100KB
          status: "ready", // Immediately ready - no embedding processing
        },
      });

      results.push({
        id: source.id,
        type: source.type,
        name: source.name,
        status: source.status,
        createdAt: source.createdAt,
      });
    }

    return NextResponse.json(results);

  } catch (error: any) {
    console.error("Upload error:", error?.message || error);
    return NextResponse.json(
      { error: "שגיאה בהעלאת הקובץ" },
      { status: 500 }
    );
  }
}
