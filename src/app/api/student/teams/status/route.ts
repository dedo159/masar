import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ connected: false });
    }

    const connection = await prisma.teamsConnection.findUnique({
      where: { studentId: session.userId },
      select: {
        syncStatus: true,
        teamsEmail: true,
        teamsDisplayName: true,
        lastSyncedAt: true,
      },
    });

    if (!connection || connection.syncStatus !== "connected") {
      return NextResponse.json({ connected: false });
    }

    return NextResponse.json({
      connected: true,
      email: connection.teamsEmail || "student@aau.edu.jo",
      displayName: connection.teamsDisplayName || "طالب جامعة عمان الأهلية",
      lastSyncedAt: connection.lastSyncedAt?.toISOString(),
    });
  } catch (error) {
    console.error("[Teams Status] Error:", error);
    return NextResponse.json({ connected: false });
  }
}
