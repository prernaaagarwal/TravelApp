import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  verifyUnsubscribeToken,
  columnForKind,
  type UnsubscribeKind,
} from "@/lib/unsubscribe-token";

// One-click unsubscribe handler — no login required.
//
// Accepts BOTH GET (footer link in the email) and POST (RFC 8058
// List-Unsubscribe-Post: List-Unsubscribe=One-Click — Gmail / Apple Mail
// fire this silently when the inline "Unsubscribe" button is clicked).
//
// Both paths verify the HMAC token, flip the matching column on
// notification_preferences to false, and either redirect (GET) or return
// a tiny 200 (POST).

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function adminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createSupabaseClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function applyUnsubscribe(
  userId: string,
  kind: UnsubscribeKind,
): Promise<boolean> {
  const supabase = adminSupabase();
  const column = columnForKind(kind);

  // Upsert in case the row doesn't exist yet (first-time user who never
  // touched /settings). Idempotent — calling twice is fine.
  const { error } = await supabase
    .from("notification_preferences")
    .upsert(
      { user_id: userId, [column]: false },
      { onConflict: "user_id" },
    );

  return !error;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("t") ?? "";
  const payload = verifyUnsubscribeToken(token);

  if (!payload) {
    // Bad / tampered token. Don't write anything; show a friendly page
    // that points to /settings. No 500, no stack trace.
    return NextResponse.redirect(
      `${SITE_URL}/email/unsubscribed?error=invalid`,
      { status: 303 },
    );
  }

  const ok = await applyUnsubscribe(payload.userId, payload.kind);
  if (!ok) {
    return NextResponse.redirect(
      `${SITE_URL}/email/unsubscribed?error=write`,
      { status: 303 },
    );
  }

  return NextResponse.redirect(
    `${SITE_URL}/email/unsubscribed?kind=${encodeURIComponent(payload.kind)}`,
    { status: 303 },
  );
}

export async function POST(request: Request) {
  // Gmail's RFC 8058 one-click button. Same logic as GET, no redirect.
  const url = new URL(request.url);
  const token = url.searchParams.get("t") ?? "";
  const payload = verifyUnsubscribeToken(token);

  if (!payload) return new NextResponse("Invalid token", { status: 400 });

  const ok = await applyUnsubscribe(payload.userId, payload.kind);
  if (!ok) return new NextResponse("Write failed", { status: 500 });

  return new NextResponse("OK", { status: 200 });
}
