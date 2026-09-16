import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('masar_session', '', { maxAge: 0, expires: new Date(0), path: '/' });
  return response;
}

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL('/login', request.url));
  response.cookies.set('masar_session', '', { maxAge: 0, expires: new Date(0), path: '/' });
  return response;
}
