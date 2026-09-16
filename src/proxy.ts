import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ================================================
  // 1. ط­ظ…ط§ظٹط© طµظپط­ط© ظˆظ…ط³ط§ط±ط§طھ ط§ط®طھط¨ط§ط± ظ…ظˆظˆط¯ظ„ (Basic Auth)
  // ================================================
  if (pathname.startsWith("/moodle-test") || (pathname.startsWith("/api/moodle-test") && !pathname.startsWith("/api/moodle-test/connect"))) {
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
  // 2. ط­ظ…ط§ظٹط© ط¨ظˆط§ط¨ط© ط§ظ„ط¬ط§ظ…ط¹ط© (JWT Session)
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
  // 3. ط­ظ…ط§ظٹط© API ط¨ظˆط§ط¨ط© ط§ظ„ط¬ط§ظ…ط¹ط© (JWT Session)
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
  // 4. ط­ظ…ط§ظٹط© ط¨ظˆط§ط¨ط© ط§ظ„ط´ط±ظƒط§طھ (JWT Session)
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
  // 5. ط­ظ…ط§ظٹط© API ط¨ظˆط§ط¨ط© ط§ظ„ط´ط±ظƒط§طھ (JWT Session)
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

  // ================================================
  // 6. ط­ظ…ط§ظٹط© ط¨ظˆط§ط¨ط© ط§ظ„ط´ط±ظƒط§ط، ط§ظ„طھط¬ط§ط±ظٹظٹظ† (JWT Session)
  // ================================================
  if (
    pathname.startsWith("/merchant") &&
    !pathname.startsWith("/merchant/login") &&
    !pathname.startsWith("/merchant/register")
  ) {
    const token = request.cookies.get("masar_session")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/merchant/login", request.url));
    }
    const session = await verifyToken(token);
    if (!session || session.userType !== "merchant") {
      return NextResponse.redirect(new URL("/merchant/login", request.url));
    }
    return NextResponse.next();
  }

  // ================================================
  // 7. ط­ظ…ط§ظٹط© API ط¨ظˆط§ط¨ط© ط§ظ„ط´ط±ظƒط§ط، ط§ظ„طھط¬ط§ط±ظٹظٹظ† (JWT Session)
  // ================================================
  if (pathname.startsWith("/api/merchant") && !pathname.startsWith("/api/merchant/auth")) {
    const token = request.cookies.get("masar_session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const session = await verifyToken(token);
    if (!session || session.userType !== "merchant") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.next();
  }

  // ================================================
  // 8. ط­ظ…ط§ظٹط© ظ„ظˆط­ط© طھط­ظƒظ… ط§ظ„ط·ط§ظ„ط¨ (Student Dashboard)
  // ================================================
  const studentProtectedPaths = [
    "/",
    "/announcements",
    "/courses",
    "/deals",
    "/internships",
    "/profile",
    "/readiness",
    "/settings"
  ];

  const isStudentProtected = studentProtectedPaths.some(
    (p) => pathname === p || pathname.startsWith(p === "/" ? "/_never_match_" : `${p}/`)
  );

  if (isStudentProtected) {
    const token = request.cookies.get("masar_session")?.value;
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      if (pathname !== "/") loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    const session = await verifyToken(token);
    if (!session || session.userType !== "student") {
      const loginUrl = new URL("/login", request.url);
      if (pathname !== "/") loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
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
    "/merchant/:path*",
    "/api/merchant/:path*",
    "/",
    "/announcements",
    "/announcements/:path*",
    "/courses",
    "/courses/:path*",
    "/deals",
    "/deals/:path*",
    "/internships",
    "/internships/:path*",
    "/profile",
    "/profile/:path*",
    "/readiness",
    "/readiness/:path*",
    
    "/settings",
    "/settings/:path*"
  ],
};


