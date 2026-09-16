import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Specify the paths to protect
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - public files (favicon.ico, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|icons/.*|.*\\.png|.*\\.jpg|.*\\.svg).*)',
  ],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Define Public Routes
  const publicRoutes = [
    '/', // Marketing / Home
    '/login',
    '/register',
    '/company/login',
    '/company/register',
    '/merchant/login',
    '/merchant/register',
    '/university/login'
  ];

  // Allow public routes and anything under /auth/ (just in case)
  if (publicRoutes.includes(pathname) || pathname.startsWith('/auth/')) {
    // Optionally: if logged in and visiting /login, redirect to /profile or somewhere
    return NextResponse.next();
  }

  // 2. Check for session
  const sessionToken = request.cookies.get('masar_session')?.value;

  if (!sessionToken) {
    // 3. Redirect to login with callbackUrl
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
