import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { exchangeCodeForTokens } from "@/lib/teams-client";
import { encryptToken } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const session = await getSession();
  const studentId = session?.userId || state;

  if (!studentId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (error || !code) {
    console.error("[Teams Callback] OAuth error or missing code:", error);
    return NextResponse.redirect(new URL("/settings?teams_error=" + encodeURIComponent(error || "cancelled"), request.url));
  }

  try {
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || request.nextUrl.host;
    const proto = request.headers.get("x-forwarded-proto") || (request.url.startsWith("https") ? "https" : "http");
    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || `${proto}://${host}`;
    const redirectUri = `${appUrl}/api/auth/callback/microsoft`;

    const tokenResult = await exchangeCodeForTokens(code, redirectUri);

    const encryptedAccess = encryptToken(tokenResult.accessToken);
    const encryptedRefresh = tokenResult.refreshToken ? encryptToken(tokenResult.refreshToken) : null;
    const expiresAt = new Date(Date.now() + tokenResult.expiresIn * 1000);

    await prisma.teamsConnection.upsert({
      where: { studentId },
      update: {
        encryptedAccessToken: encryptedAccess,
        encryptedRefreshToken: encryptedRefresh,
        expiresAt,
        teamsEmail: tokenResult.email || "student@aau.edu.jo",
        teamsDisplayName: tokenResult.displayName || "طالب جامعة عمان الأهلية",
        syncStatus: "connected",
        lastSyncedAt: new Date(),
      },
      create: {
        studentId,
        encryptedAccessToken: encryptedAccess,
        encryptedRefreshToken: encryptedRefresh,
        expiresAt,
        teamsEmail: tokenResult.email || "student@aau.edu.jo",
        teamsDisplayName: tokenResult.displayName || "طالب جامعة عمان الأهلية",
        syncStatus: "connected",
        lastSyncedAt: new Date(),
      },
    });

    return NextResponse.redirect(new URL("/schedule?teams_connected=true", request.url));
  } catch (err: any) {
    console.error("[Teams Callback] Failed to save connection:", err);
    return NextResponse.redirect(new URL("/settings?teams_error=" + encodeURIComponent(err.message || "failed"), request.url));
  }
}
