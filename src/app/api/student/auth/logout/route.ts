export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('masar_session', '', { maxAge: 0, expires: new Date(0), path: '/', secure: true, sameSite: 'lax', httpOnly: true });
  return response;
}

export async function GET(request: Request) {
  const html = 
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="refresh" content="0; url=/login" />
        <title>Logging out...</title>
      </head>
      <body>
        <script>
          document.cookie = "masar_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          localStorage.removeItem("masar_logged_in");
          window.location.href = "/login";
        </script>
      </body>
    </html>
  ;
  const response = new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html' }
  });
  response.cookies.set('masar_session', '', { maxAge: 0, expires: new Date(0), path: '/', secure: true, sameSite: 'lax', httpOnly: true });
  return response;
}

