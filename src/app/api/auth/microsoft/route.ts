import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getMicrosoftAuthUrl } from "@/lib/teams-client";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const redirectUri = `${appUrl}/api/auth/callback/microsoft`;
  const state = session.userId;

  const authUrl = getMicrosoftAuthUrl(redirectUri, state);
  return NextResponse.redirect(authUrl);
}
