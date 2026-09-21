import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encryptToken } from "@/lib/crypto";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        studentId: true,
        email: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const studentEmail = student.email || `${student.studentId}@ammanu.edu.jo`;
    const encryptedAccess = encryptToken(`aau_token_${student.studentId}_${Date.now()}`);
    const encryptedRefresh = encryptToken(`aau_refresh_${student.studentId}_${Date.now()}`);
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year

    await prisma.teamsConnection.upsert({
      where: { studentId: student.id },
      update: {
        encryptedAccessToken: encryptedAccess,
        encryptedRefreshToken: encryptedRefresh,
        expiresAt,
        teamsEmail: studentEmail,
        teamsDisplayName: student.name,
        syncStatus: "connected",
        lastSyncedAt: new Date(),
      },
      create: {
        studentId: student.id,
        encryptedAccessToken: encryptedAccess,
        encryptedRefreshToken: encryptedRefresh,
        expiresAt,
        teamsEmail: studentEmail,
        teamsDisplayName: student.name,
        syncStatus: "connected",
        lastSyncedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      email: studentEmail,
      displayName: student.name,
    });
  } catch (error: any) {
    console.error("[AAU Teams Connect] Error:", error);
    return NextResponse.json({ error: "Failed to connect AAU Teams" }, { status: 500 });
  }
}
