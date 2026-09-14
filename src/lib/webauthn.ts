import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
  AuthenticatorTransport,
} from "@simplewebauthn/server";

// RP (Relying Party) configuration
const RP_NAME = "مسار — Masar";

function getRpId(): string {
  if (process.env.WEBAUTHN_RP_ID) return process.env.WEBAUTHN_RP_ID;
  if (process.env.VERCEL_URL) {
    const url = process.env.VERCEL_URL;
    return url.replace(/^https?:\/\//, "").split(":")[0];
  }
  return "localhost";
}

function getOrigin(): string {
  if (process.env.WEBAUTHN_ORIGIN) return process.env.WEBAUTHN_ORIGIN;
  if (process.env.VERCEL_URL) {
    const url = process.env.VERCEL_URL;
    return url.startsWith("http") ? url : `https://${url}`;
  }
  return "http://localhost:3000";
}

// ---- Registration (مرحلة تسجيل البصمة) ----

export async function generatePasskeyRegistrationOptions(
  studentId: string,
  studentName: string,
  existingCredentialIds: string[] = []
) {
  const rpId = getRpId();

  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: rpId,
    userName: studentId,
    userDisplayName: studentName,
    attestationType: "none",
    excludeCredentials: existingCredentialIds.map((id) => ({
      id,
      transports: ["internal", "hybrid"] as AuthenticatorTransport[],
    })),
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
      authenticatorAttachment: "platform", // Only built-in (fingerprint/face)
    },
  });

  return options;
}

export async function verifyPasskeyRegistration(
  response: RegistrationResponseJSON,
  expectedChallenge: string
) {
  const rpId = getRpId();
  const origin = getOrigin();

  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpId,
  });

  return verification;
}

// ---- Authentication (مرحلة تسجيل الدخول بالبصمة) ----

export async function generatePasskeyLoginOptions(
  allowCredentialIds?: string[],
  transportsMap?: Record<string, string | null>
) {
  const rpId = getRpId();

  const allowCredentials = allowCredentialIds?.map((id) => {
    const rawTransports = transportsMap?.[id];
    let transports: AuthenticatorTransport[] = ["internal", "hybrid"];
    if (rawTransports) {
      try {
        transports = JSON.parse(rawTransports) as AuthenticatorTransport[];
      } catch {
        // keep defaults
      }
    }
    return { id, transports };
  });

  const options = await generateAuthenticationOptions({
    rpID: rpId,
    userVerification: "preferred",
    allowCredentials,
  });

  return options;
}

export async function verifyPasskeyLogin(
  response: AuthenticationResponseJSON,
  expectedChallenge: string,
  credentialPublicKey: Uint8Array | Buffer,
  credentialCounter: bigint
) {
  const rpId = getRpId();
  const origin = getOrigin();
  
  const publicKey = credentialPublicKey instanceof Buffer 
    ? new Uint8Array(credentialPublicKey) 
    : credentialPublicKey;

  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpId,
    credential: {
      id: response.id,
      publicKey: publicKey as any,
      counter: Number(credentialCounter),
    },
  });

  return verification;
}

export type { RegistrationResponseJSON, AuthenticationResponseJSON };
