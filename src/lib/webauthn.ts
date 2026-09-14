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

// ---- Registration (مرحلة تسجيل البصمة) ----

export async function generatePasskeyRegistrationOptions(
  studentId: string,
  studentName: string,
  rpId: string,
  existingCredentialIds: string[] = []
) {
  const options = await generateRegistrationOptions({
    rpName: "مسار — Masar",
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
  expectedChallenge: string,
  rpId: string,
  origin: string
) {
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
  rpId: string,
  allowCredentialIds?: string[],
  transportsMap?: Record<string, string | null>
) {
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
  credentialCounter: bigint,
  rpId: string,
  origin: string
) {
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
