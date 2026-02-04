import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withRetry } from "@/lib/withRetry";

export const dynamic = 'force-dynamic';

// עדכון משתמש (toggle admin)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { isAdmin, isApproved } = body;

    // מניעת הסרת הרשאת מנהל מעצמך
    if (params.id === user.id && isAdmin === false) {
      return NextResponse.json(
        { error: "Cannot remove admin from yourself" },
        { status: 400 }
      );
    }

    // בניית אובייקט העדכון
    const updateData: { isAdmin?: boolean; isApproved?: boolean } = {};
    if (isAdmin !== undefined) updateData.isAdmin = isAdmin;
    if (isApproved !== undefined) updateData.isApproved = isApproved;

    const updated = await withRetry(() =>
      prisma.user.update({
        where: { id: params.id },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          isAdmin: true,
          isApproved: true,
          createdAt: true,
          _count: {
            select: { chatbots: true }
          }
        }
      })
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// מחיקת משתמש
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // מניעת מחיקה עצמית
    if (params.id === user.id) {
      return NextResponse.json(
        { error: "Cannot delete yourself" },
        { status: 400 }
      );
    }

    // מחיקת המשתמש וכל הנתונים שלו (cascade)
    await withRetry(() =>
      prisma.user.delete({
        where: { id: params.id },
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
