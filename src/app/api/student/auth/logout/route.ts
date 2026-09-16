export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('masar_session');
  return NextResponse.json({ success: true });
}

export async function GET(request) {
  const cookieStore = await cookies();
  cookieStore.delete('masar_session');

  const html = `<!DOCTYPE html>
<html>
  <head>
    <title>Logging out...</title>
  </head>
  <body>
    <p>Logging out, please wait...</p>
    <script>
      localStorage.clear();
      sessionStorage.clear();
      document.cookie = "masar_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "masar_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname + ";";
      
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          for(let registration of registrations) {
            registration.unregister();
          }
        });
      }
      setTimeout(function() {
        window.location.href = "/login";
      }, 300);
    </script>
  </body>
</html>`;

  const response = new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html' }
  });
  
  response.headers.append('Set-Cookie', 'masar_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax');
  response.headers.append('Set-Cookie', 'masar_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax');
  
  return response;
}