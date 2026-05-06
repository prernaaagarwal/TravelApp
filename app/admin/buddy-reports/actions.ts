"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { sendBuddyReportResolved } from "@/lib/email";
import { env, requireEnv } from "@/lib/config";

async function assertAdmin(): Promise<{ supabase: SupabaseClient; adminId: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || !["moderator", "admin"].includes(profile.role ?? "")) {
    throw new Error("Unauthorized");
  }
  return { supabase, adminId: user.id };
}

function adminSupabase() {
  return createSupabaseClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

async function getEmail(userId: string): Promise<string | null> {
  const admin = adminSupabase();
  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error || !data.user?.email) return null;
  return data.user.email;
}

async function notifyAllReporters(
  supabase: SupabaseClient,
  reportedUserId: string,
  outcome: "actioned" | "dismissed",
) {
  const { data: reports } = await supabase
    .from("buddy_profile_reports")
    .select("reporter_id")
    .eq("reported_user_id", reportedUserId);
  for (const r of reports ?? []) {
    const email = await getEmail(r.reporter_id);
    if (email) {
      try {
        await sendBuddyReportResolved(email, outcome);
      } catch {
        // ignore
      }
    }
  }
}

// False positive — restore the profile, mark all open reports dismissed.
export async function restoreFromPause(reportedUserId: string) {
  const { supabase, adminId } = await assertAdmin();

  await supabase
    .from("profiles")
    .update({ is_paused: false, paused_at: null })
    .eq("id", reportedUserId);

  await supabase
    .from("buddy_profile_reports")
    .update({
      status: "dismissed",
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("reported_user_id", reportedUserId)
    .eq("status", "pending");

  await supabase.from("moderation_audit_log").insert({
    actor_id: adminId,
    action: "restore",
    target_type: "buddy_profile",
    target_id: reportedUserId,
  });

  await notifyAllReporters(supabase, reportedUserId, "dismissed");
  revalidatePath("/admin/buddy-reports");
}

// Confirmed bad actor — ban + mark all open reports actioned.
export async function confirmPauseAndBan(reportedUserId: string, reason: string) {
  const { supabase, adminId } = await assertAdmin();

  await supabase
    .from("profiles")
    .update({
      is_banned: true,
      banned_at: new Date().toISOString(),
      ban_reason: reason || "Buddy report confirmed",
      banned_by: adminId,
      // leave is_paused as-is; ban supersedes
    })
    .eq("id", reportedUserId);

  await supabase
    .from("buddy_profile_reports")
    .update({
      status: "actioned",
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("reported_user_id", reportedUserId)
    .eq("status", "pending");

  await supabase.from("moderation_audit_log").insert({
    actor_id: adminId,
    action: "confirm_pause",
    target_type: "buddy_profile",
    target_id: reportedUserId,
    reason: reason || null,
  });

  await notifyAllReporters(supabase, reportedUserId, "actioned");
  revalidatePath("/admin/buddy-reports");
}
