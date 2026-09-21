import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getMicrosoftAuthUrl } from "@/lib/teams-client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || request.nextUrl.host;
    const proto = request.headers.get("x-forwarded-proto") || (request.url.startsWith("https") ? "https" : "http");
    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || `${proto}://${host}`;

    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.redirect(`${appUrl}/login?callbackUrl=/settings`);
    }

    const redirectUri = `${appUrl}/api/auth/callback/microsoft`;
    const state = session.userId;

    let authUrl = getMicrosoftAuthUrl(redirectUri, state);
    if (!authUrl.startsWith("http://") && !authUrl.startsWith("https://")) {
      authUrl = `${appUrl}${authUrl.startsWith("/") ? "" : "/"}${authUrl}`;
    }

    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error("[Microsoft Auth Route] Error:", error);
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || request.nextUrl.host;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || `https://${host}`;
    return NextResponse.redirect(`${appUrl}/settings?teams_error=init_failed`);
  }
}
