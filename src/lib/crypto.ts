import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

function getEncryptionKey(): Buffer {
  const keyHex = process.env.MOODLE_TOKEN_ENCRYPTION_KEY;
  if (!keyHex) {
    throw new Error("MOODLE_TOKEN_ENCRYPTION_KEY environment variable is not defined");
  }

  // Key must be exactly 32 bytes (64 hex characters)
  const key = Buffer.from(keyHex, "hex");
  if (key.length !== 32) {
    throw new Error("MOODLE_TOKEN_ENCRYPTION_KEY must be a 64-character hex string (32 bytes)");
  }

  return key;
}

/**
 * Encrypts a plaintext Moodle token using AES-256-GCM.
 * Returns formatted string: "iv:authTag:ciphertext" (all in hex).
 */
export function encryptToken(token: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts an encrypted Moodle token string into plaintext.
 * Throws an error if decryption or authentication tag verification fails.
 */
export function decryptToken(encryptedString: string): string {
  const key = getEncryptionKey();
  const parts = encryptedString.split(":");

  if (parts.length !== 3) {
    throw new Error("Invalid encrypted token format");
  }

  const [ivHex, authTagHex, encryptedHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
