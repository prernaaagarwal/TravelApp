"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendBuddyReportAcknowledged } from "@/lib/email";

const VALID_REASONS = [
  "Profile is not a woman",
  "Inappropriate message after match",
  "Suspicious profile photo (catfish)",
  "Other",
] as const;

// Threshold for auto-pause. Two distinct reporters causes the profile to
// disappear from /buddy until a moderator reviews. The unique constraint on
// (reported_user_id, reporter_id) ensures a single bad actor can't trip it.
const AUTO_PAUSE_THRESHOLD = 2;

export async function reportBuddyProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in to report." };

  const reportedUserId = (formData.get("reported_user_id") as string | null)?.trim();
  const reason = (formData.get("reason") as string | null)?.trim();
  const details = (formData.get("details") as string | null)?.trim() || null;

  if (!reportedUserId) return { error: "Missing target." };
  if (reportedUserId === user.id) return { error: "You can't report yourself." };
  if (!reason || !VALID_REASONS.includes(reason as (typeof VALID_REASONS)[number])) {
    return { error: "Pick a reason." };
  }

  // Insert the report. The unique constraint silently rejects duplicate
  // reports from the same reporter on the same target — we treat that as
  // success (UX shows "thanks" either way).
  const { error: insertError } = await supabase
    .from("buddy_profile_reports")
    .insert({
      reported_user_id: reportedUserId,
      reporter_id: user.id,
      reason,
      details,
    });
  if (insertError && insertError.code !== "23505") {
    return { error: insertError.message };
  }

  // Re-count distinct pending reporters for this target.
  const { count } = await supabase
    .from("buddy_profile_reports")
    .select("*", { count: "exact", head: true })
    .eq("reported_user_id", reportedUserId)
    .eq("status", "pending");

  if ((count ?? 0) >= AUTO_PAUSE_THRESHOLD) {
    await supabase
      .from("profiles")
      .update({ is_paused: true, paused_at: new Date().toISOString() })
      .eq("id", reportedUserId)
      .eq("is_paused", false); // don't bump paused_at on subsequent reports

    await supabase.from("moderation_audit_log").insert({
      actor_id: user.id,
      action: "auto_pause",
      target_type: "buddy_profile",
      target_id: reportedUserId,
      reason: `Auto-pause after ${count} community flags`,
    });
  }

  // Acknowledge the reporter (fire-and-forget; don't fail the action if email
  // env isn't configured locally).
  if (user.email) {
    try {
      await sendBuddyReportAcknowledged(user.email);
    } catch {
      // ignore
    }
  }

  revalidatePath("/buddy");
  return { success: true };
}
