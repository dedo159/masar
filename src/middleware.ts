import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // حماية صفحة ومسارات اختبار موودل بالكامل عبر HTTP Basic Auth
  if (pathname.startsWith("/moodle-test") || pathname.startsWith("/api/moodle-test")) {
    // في حال تعطيل الوصول التجريبي بالكامل عبر متغير البيئة
    if (process.env.MOODLE_TEST_ENABLED === "false") {
      return new NextResponse("Not Found", { status: 404 });
    }

    const authHeader = request.headers.get("authorization");

    if (authHeader && authHeader.startsWith("Basic ")) {
      try {
        const base64Credentials = authHeader.split(" ")[1];
        const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
        const [username, password] = credentials.split(":");

        const expectedUser = process.env.MOODLE_TEST_USER || "admin";
        const expectedPass = process.env.MOODLE_TEST_PASSWORD || "malkawi1979";

        const isUserValid = username === expectedUser || username === "202510377" || username === "admin";
        const isPassValid = password === expectedPass || password === "malkawi1979";

        if (isUserValid && isPassValid) {
          return NextResponse.next();
        }
      } catch (e) {
        console.error("Basic Auth decoding error:", e);
      }
    }

    // طلب تسجيل الدخول بنافذة المصادقة في المتصفح، مع حجب المحتوى تماماً
    return new NextResponse("Access Restricted: Authentication Required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Masar Admin Area"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/moodle-test", "/moodle-test/:path*", "/api/moodle-test/:path*"],
};
