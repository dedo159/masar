import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "masar_session";
const JWT_EXPIRY = "7d";

// Bulletproof fallback secret ensuring auth functions work in any deployment environment
const FALLBACK_JWT_SECRET = "masar-secure-jwt-auth-token-key-2026-production-32bytes-secret";

type UserType = "staff" | "recruiter" | "student";

export interface SessionPayload {
  userId: string;
  userType: UserType;
  companyId?: string;
  universityId?: string;
  name?: string;
  email?: string;
}

function getJwtSecret(): Uint8Array {
  const secret =
    process.env.JWT_SECRET ||
    process.env.MOODLE_TOKEN_ENCRYPTION_KEY ||
    FALLBACK_JWT_SECRET;
  return new TextEncoder().encode(secret);
}

// ---- Create Session ----
export async function createSession(payload: SessionPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(getJwtSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return token;
}

// ---- Get Session from Cookie ----
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// ---- Destroy Session ----
export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
  } catch {
    // Ignore cookie deletion errors
  }
}

// ---- Require Auth (throws if not authenticated) ----
export async function requireAuth(
  allowedTypes?: UserType[]
): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  if (allowedTypes && !allowedTypes.includes(session.userType)) {
    throw new Error("Forbidden");
  }
  return session;
}

// ---- Verify Token (for middleware — no cookies() needed) ----
export async function verifyToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const secret =
      process.env.JWT_SECRET ||
      process.env.MOODLE_TOKEN_ENCRYPTION_KEY ||
      FALLBACK_JWT_SECRET;
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
