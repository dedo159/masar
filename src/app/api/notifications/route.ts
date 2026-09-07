import { NextResponse } from "next/server";
import { getNotifications } from "@/lib/db-queries";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const notifications = await getNotifications();
    // Return exact Notification[] array shape
    return NextResponse.json(notifications);
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Support PATCH /api/notifications to mark notification as read
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, readAll } = body;

    if (readAll) {
      await prisma.notification.updateMany({
        where: { read: false },
        data: { read: true },
      });
      return NextResponse.json({ success: true });
    }

    if (id) {
      await prisma.notification.update({
        where: { id },
        data: { read: true },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  } catch (error) {
    console.error("PATCH /api/notifications error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
