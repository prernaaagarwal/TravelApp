import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { buildDigestForUser, formatDigestEmail, isDigestEmpty } from "@/lib/digest";
import { sendWeeklyDigest } from "@/lib/email";
import { unsubscribeUrl } from "@/lib/unsubscribe-token";

// Vercel Cron handler — Sunday 03:00 UTC = 08:30 IST so the email lands in
// IST inboxes by 09:00 local. Schedule lives in vercel.json.
//
// Auth: Vercel adds an `x-vercel-cron` header on real cron invocations. For
// manual testing we also accept `Authorization: Bearer ${CRON_SECRET}`.
//
// The handler is intentionally synchronous-per-recipient and tolerant of
// partial failures: one bad recipient must never block the rest. Resend
// logs failures on its dashboard.

export const maxDuration = 60; // Vercel function timeout (seconds)

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function isAuthedCron(request: Request): boolean {
  if (request.headers.get("x-vercel-cron")) return true;
  const auth = request.headers.get("authorization");
  if (!auth) return false;
  const match = auth.match(/^Bearer\s+(.+)$/i);
  if (!match) return false;
  return match[1] === process.env.CRON_SECRET;
}

function adminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createSupabaseClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function runDigest(): Promise<{
  sent: number;
  skipped: number;
  empty: number;
  errors: number;
}> {
  const admin = adminSupabase();
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Find all opted-in users. Default for both columns is true, but the row
  // may not exist yet for users who never visited /settings — those users
  // are NOT included here (no row = nothing to query). On signup, the
  // settings page creates the row with defaults; we only digest users who
  // have been there at least once.
  const { data: prefs } = await admin
    .from("notification_preferences")
    .select("user_id, weekly_digest_enabled, email_enabled, platform_updates")
    .eq("weekly_digest_enabled", true)
    .eq("email_enabled", true);

  let sent = 0;
  let skipped = 0;
  let empty = 0;
  let errors = 0;

  for (const pref of prefs ?? []) {
    const userId = pref.user_id as string;
    if (!userId) {
      skipped++;
      continue;
    }
    try {
      const payload = await buildDigestForUser(admin, userId, since, {
        includePlatformIntel: !!pref.platform_updates,
      });
      if (isDigestEmpty(payload)) {
        empty++;
        continue;
      }

      const { data, error } = await admin.auth.admin.getUserById(userId);
      const email = data?.user?.email;
      if (error || !email) {
        skipped++;
        continue;
      }

      const unsubUrl = unsubscribeUrl({ userId, kind: "digest" }, SITE_URL);
      const html = formatDigestEmail(payload, unsubUrl);
      await sendWeeklyDigest(email, html, unsubUrl);
      sent++;
    } catch {
      errors++;
      // intentional: one failed recipient mustn't abort the loop
    }
  }

  return { sent, skipped, empty, errors };
}

export async function GET(request: Request) {
  if (!isAuthedCron(request)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const summary = await runDigest();
  return NextResponse.json(summary);
}
