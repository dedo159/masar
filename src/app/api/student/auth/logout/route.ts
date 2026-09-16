export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('masar_session');
  
  const response = NextResponse.json({ success: true });
  response.cookies.delete('masar_session');
  return response;
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete('masar_session');

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
  response.cookies.delete('masar_session');
  return response;
}
