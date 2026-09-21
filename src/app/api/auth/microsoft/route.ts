import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getMicrosoftAuthUrl } from "@/lib/teams-client";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || request.nextUrl.host;
  const proto = request.headers.get("x-forwarded-proto") || (request.url.startsWith("https") ? "https" : "http");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || `${proto}://${host}`;
  const redirectUri = `${appUrl}/api/auth/callback/microsoft`;
  const state = session.userId;

  const authUrl = getMicrosoftAuthUrl(redirectUri, state);
  return NextResponse.redirect(authUrl);
}
