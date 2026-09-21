import { NextResponse } from "next/server";
import { getNotifications } from "@/lib/db-queries";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.userType !== "student" || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const notifications = await getNotifications(session.userId);
    return NextResponse.json(notifications);
  } catch (error) {
    console.error("GET /api/updates error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Support PATCH /api/updates to mark notification as read
export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.userType !== "student" || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, readAll } = body;

    if (readAll) {
      await prisma.notification.updateMany({
        where: { studentId: session.userId, read: false },
        data: { read: true },
      });
      return NextResponse.json({ success: true });
    }

    if (id) {
      await prisma.notification.updateMany({
        where: { id, studentId: session.userId },
        data: { read: true },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  } catch (error) {
    console.error("PATCH /api/updates error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
