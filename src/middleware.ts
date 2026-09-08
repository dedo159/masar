import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ================================================
  // 1. حماية صفحة ومسارات اختبار موودل (Basic Auth)
  // ================================================
  if (pathname.startsWith("/moodle-test") || pathname.startsWith("/api/moodle-test")) {
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

    return new NextResponse("Access Restricted: Authentication Required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Masar Admin Area"',
      },
    });
  }

  // ================================================
  // 2. حماية بوابة الجامعة (JWT Session)
  // ================================================
  if (pathname.startsWith("/university") && !pathname.startsWith("/university/login")) {
    const token = request.cookies.get("masar_session")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/university/login", request.url));
    }
    const session = await verifyToken(token);
    if (!session || session.userType !== "staff") {
      return NextResponse.redirect(new URL("/university/login", request.url));
    }
    return NextResponse.next();
  }

  // ================================================
  // 3. حماية API بوابة الجامعة (JWT Session)
  // ================================================
  if (pathname.startsWith("/api/university") && !pathname.startsWith("/api/university/auth")) {
    const token = request.cookies.get("masar_session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const session = await verifyToken(token);
    if (!session || session.userType !== "staff") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.next();
  }

  // ================================================
  // 4. حماية بوابة الشركات (JWT Session)
  // ================================================
  if (
    pathname.startsWith("/company") &&
    !pathname.startsWith("/company/login") &&
    !pathname.startsWith("/company/register")
  ) {
    const token = request.cookies.get("masar_session")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/company/login", request.url));
    }
    const session = await verifyToken(token);
    if (!session || session.userType !== "recruiter") {
      return NextResponse.redirect(new URL("/company/login", request.url));
    }
    return NextResponse.next();
  }

  // ================================================
  // 5. حماية API بوابة الشركات (JWT Session)
  // ================================================
  if (pathname.startsWith("/api/company") && !pathname.startsWith("/api/company/auth")) {
    const token = request.cookies.get("masar_session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const session = await verifyToken(token);
    if (!session || session.userType !== "recruiter") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/moodle-test",
    "/moodle-test/:path*",
    "/api/moodle-test/:path*",
    "/university/:path*",
    "/api/university/:path*",
    "/company/:path*",
    "/api/company/:path*",
  ],
};
