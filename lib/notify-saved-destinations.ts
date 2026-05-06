import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { CITY_LABELS } from "@/lib/constants";
import { sendBewareAlertToSaver } from "@/lib/email";

// Service-role client. We need to read auth.users for emails and bypass RLS
// on saved_destinations / notification_preferences for users other than the
// caller (the admin approving the report).
function adminSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function destinationLabel(slug: string): string {
  if (CITY_LABELS[slug]) return CITY_LABELS[slug];
  // Fallback: last segment is the country, drop it and title-case the rest.
  const parts = slug.split("-");
  parts.pop();
  return parts
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export type BewareAlertPayload = {
  destinationSlug: string;
  reportTitle: string;
  reportSeverity: string | null;
  reportLocation: string | null;
  // The user who submitted the report — never emailed even if they saved
  // the same destination (they already know).
  excludeUserId: string | null;
};

// Severities that fire the real-time alert. Mediums and lows are deferred
// to the weekly digest so opted-in users aren't blasted with marginal
// reports — only critical/high warrant interrupting their day.
const REALTIME_SEVERITIES = new Set(["critical", "high"]);

// Find every user who has saved this destination AND has opted in to beware
// alerts AND has email notifications enabled, then send one alert email per
// user. Errors per-recipient don't abort the loop — we want a partial send
// over no send. Caller should not await the result on the request path:
// this is safe to fire-and-forget.
export async function notifySaversOfBewareReport(
  payload: BewareAlertPayload,
): Promise<{ sent: number; skipped: number; deferredToDigest?: boolean }> {
  // Severity gate: only critical + high go out instantly. Anything else
  // waits for the Sunday digest cron (app/api/cron/weekly-digest).
  const sev = (payload.reportSeverity ?? "").toLowerCase();
  if (!REALTIME_SEVERITIES.has(sev)) {
    return { sent: 0, skipped: 0, deferredToDigest: true };
  }

  const admin = adminSupabase();
  if (!admin) return { sent: 0, skipped: 0 };

  // 1) All users who have this destination saved.
  const { data: saves, error: savesErr } = await admin
    .from("saved_destinations")
    .select("user_id")
    .eq("destination_slug", payload.destinationSlug);

  if (savesErr || !saves || saves.length === 0) {
    return { sent: 0, skipped: 0 };
  }

  let candidateIds = saves
    .map((s) => s.user_id as string)
    .filter((id): id is string => !!id);

  if (payload.excludeUserId) {
    candidateIds = candidateIds.filter((id) => id !== payload.excludeUserId);
  }
  if (candidateIds.length === 0) return { sent: 0, skipped: 0 };

  // 2) Filter by notification preference. Default is opted-in (per the
  //    notification_preferences default), so users with no row also receive.
  const { data: prefs } = await admin
    .from("notification_preferences")
    .select("user_id, new_beware_in_saved_destinations, email_enabled")
    .in("user_id", candidateIds);

  const prefsByUser = new Map<string, { onBeware: boolean; onEmail: boolean }>();
  for (const p of prefs ?? []) {
    prefsByUser.set(p.user_id as string, {
      onBeware: !!p.new_beware_in_saved_destinations,
      onEmail:  !!p.email_enabled,
    });
  }

  const optedIn = candidateIds.filter((id) => {
    const p = prefsByUser.get(id);
    if (!p) return true; // no row yet → defaults are on
    return p.onBeware && p.onEmail;
  });

  if (optedIn.length === 0) return { sent: 0, skipped: candidateIds.length };

  const label = destinationLabel(payload.destinationSlug);

  let sent = 0;
  let skipped = 0;

  // 3) Resolve emails one user at a time and send. The Supabase admin SDK
  //    doesn't support batched email lookup, so we pay one round-trip per
  //    recipient. Acceptable for V0 — beware approvals are low-volume.
  for (const userId of optedIn) {
    try {
      const { data, error } = await admin.auth.admin.getUserById(userId);
      const email = data?.user?.email;
      if (error || !email) {
        skipped++;
        continue;
      }
      await sendBewareAlertToSaver(email, {
        destinationLabel: label,
        destinationSlug:  payload.destinationSlug,
        reportTitle:      payload.reportTitle,
        reportSeverity:   payload.reportSeverity ?? "",
        reportLocation:   payload.reportLocation,
      });
      sent++;
    } catch {
      skipped++;
      // One bad recipient must not block the rest. Errors are intentionally
      // swallowed — Resend logs failures on its dashboard.
    }
  }

  return { sent, skipped };
}
