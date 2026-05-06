import { createHmac, timingSafeEqual } from "node:crypto";

// HMAC-signed unsubscribe token. The token is its own auth — no login
// required to honour an unsubscribe click. Per founder direction:
// "safety-first users are especially sensitive to feeling trapped by a
//  product." Tokens have no expiry; once issued, the link works forever.

export type UnsubscribeKind =
  | "digest"            // weekly_digest_enabled
  | "beware-saver"      // new_beware_in_saved_destinations
  | "community-reply"   // community_reply_to_my_post
  | "platform-updates"; // platform_updates

export type UnsubscribePayload = {
  userId: string;
  kind: UnsubscribeKind;
  v: number; // version, currently 1
};

const VERSION = 1;

function getSecret(): string {
  const s = process.env.UNSUBSCRIBE_SECRET;
  if (!s || s.length < 16) {
    // Fallback during local dev only. In production, throwing would be
    // safer, but Resend is also a no-op without an API key, so the email
    // won't actually go out anyway.
    return "ww-dev-only-do-not-use-in-prod-________";
  }
  return s;
}

function b64urlEncode(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64urlDecode(input: string): Buffer {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return Buffer.from(padded + pad, "base64");
}

function hmac(payload: string): string {
  return b64urlEncode(
    createHmac("sha256", getSecret()).update(payload).digest(),
  );
}

export function signUnsubscribeToken(
  payload: Omit<UnsubscribePayload, "v">,
): string {
  const full: UnsubscribePayload = { ...payload, v: VERSION };
  const body = b64urlEncode(JSON.stringify(full));
  const sig = hmac(body);
  return `${body}.${sig}`;
}

export function verifyUnsubscribeToken(
  token: string,
): UnsubscribePayload | null {
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".", 2);
  if (!body || !sig) return null;
  const expected = hmac(body);

  // timingSafeEqual requires equal-length buffers
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return null;
  if (!timingSafeEqual(a, b)) return null;

  try {
    const decoded = JSON.parse(b64urlDecode(body).toString("utf8")) as UnsubscribePayload;
    if (typeof decoded.userId !== "string" || !decoded.userId) return null;
    if (typeof decoded.kind !== "string") return null;
    if (decoded.v !== VERSION) return null;
    return decoded;
  } catch {
    return null;
  }
}

// Map a kind to the column on notification_preferences. Single source of
// truth so the unsubscribe handler doesn't drift from the schema.
export function columnForKind(kind: UnsubscribeKind): string {
  switch (kind) {
    case "digest":            return "weekly_digest_enabled";
    case "beware-saver":      return "new_beware_in_saved_destinations";
    case "community-reply":   return "community_reply_to_my_post";
    case "platform-updates":  return "platform_updates";
  }
}

// Convenience for building the full URL embedded in emails.
export function unsubscribeUrl(
  payload: Omit<UnsubscribePayload, "v">,
  siteUrl: string,
): string {
  const token = signUnsubscribeToken(payload);
  return `${siteUrl}/api/email/unsubscribe?t=${encodeURIComponent(token)}`;
}
