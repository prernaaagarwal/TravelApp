"use server";

import { createClient } from "@/lib/supabase/server";
import {
  createClient as createSupabaseClient,
  type SupabaseClient,
} from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { env, requireEnv } from "@/lib/config";

// DPDP / GDPR data-purge endpoint — "right to erasure".
//
// HOW THIS WORKS (simplified from earlier draft):
//
// The database schema already does most of the work via foreign-key
// cascades from auth.users:
//   - profiles ON DELETE CASCADE        → auto-deleted
//   - user_verifications, saved_destinations, notifications, buddy_*
//     all reference profiles(id) ON DELETE CASCADE → auto-deleted
//   - beware_reports.reported_by_id, community_posts.author_id,
//     community_replies.author_id, intel_card_views.viewer_id all
//     ON DELETE SET NULL → auto-anonymized (rows preserved)
//
// So the action only needs to do what cascades CAN'T:
//   1. Delete storage objects (avatar bucket, id-verification bucket)
//   2. Call admin.auth.admin.deleteUser() — triggers all cascades
//   3. Audit-log the purge
//
// Admin-only (not moderator). Requires literal "PURGE-{userId}"
// confirmation phrase to proceed. One-way.

function adminSupabase(): SupabaseClient {
  // Annotated as bare SupabaseClient so the schema-typed default doesn't
  // narrow writes to `never` (the typed default can't see service-role-
  // bypass writes that don't match a public-table RLS policy).
  return createSupabaseClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

async function assertAdmin(): Promise<{ adminId: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "admin") {
    // Only admin (not moderator) can purge — destructive action.
    throw new Error("Only admins can purge accounts");
  }
  return { adminId: user.id };
}

export type PurgeResult = {
  ok: boolean;
  userId: string;
  steps: { step: string; ok: boolean; detail?: string }[];
  error?: string;
};

export async function purgeUser(formData: FormData): Promise<void> {
  const targetUserId = (formData.get("user_id") as string | null)?.trim();
  const confirmation = (formData.get("confirmation") as string | null)?.trim();
  const reason = (formData.get("reason") as string | null)?.trim() ?? "";

  if (!targetUserId) {
    redirect("/admin/users?error=missing_user_id");
  }

  // Confirmation gate — admin must type "PURGE-{userId}"
  const expectedConfirmation = `PURGE-${targetUserId}`;
  if (confirmation !== expectedConfirmation) {
    redirect(`/admin/users/${targetUserId}/purge?error=bad_confirmation`);
  }

  let adminId: string;
  try {
    ({ adminId } = await assertAdmin());
  } catch {
    redirect(`/admin/users/${targetUserId}/purge?error=unauthorized`);
  }

  // Block self-purge — admin cannot purge themselves
  if (adminId === targetUserId) {
    redirect(`/admin/users/${targetUserId}/purge?error=cannot_self_purge`);
  }

  const result = await runPurge(targetUserId, adminId, reason);

  if (!result.ok) {
    const errMsg = encodeURIComponent(result.error ?? "purge_failed");
    redirect(`/admin/users/${targetUserId}/purge?error=${errMsg}`);
  }

  revalidatePath("/admin/users");
  redirect(`/admin/users?purged=${targetUserId}`);
}

// Exported for the result page to optionally show step detail.
export async function runPurge(
  userId: string,
  adminId: string,
  reason: string,
): Promise<PurgeResult> {
  const admin = adminSupabase();
  const steps: PurgeResult["steps"] = [];

  // ── Step 1. Delete storage objects ────────────────────────────────────
  // Storage cleanup is the only thing the auth.users cascade doesn't do.
  try {
    const { data: avatarFiles } = await admin.storage
      .from("avatars")
      .list(userId, { limit: 100 });
    if (avatarFiles && avatarFiles.length > 0) {
      const paths = avatarFiles.map((f) => `${userId}/${f.name}`);
      await admin.storage.from("avatars").remove(paths);
    }
    steps.push({
      step: "delete_avatar_storage",
      ok: true,
      detail: `${avatarFiles?.length ?? 0} files`,
    });
  } catch (err) {
    steps.push({
      step: "delete_avatar_storage",
      ok: false,
      detail: err instanceof Error ? err.message : "unknown",
    });
  }

  try {
    // ID verification photos (path is `{userId}/<filename>` per submitIdSelfie).
    // For approved verifications these are already deleted on approval; for
    // pending or rejected they may still exist.
    const { data: idFiles } = await admin.storage
      .from("id-verification")
      .list(userId, { limit: 100 });
    if (idFiles && idFiles.length > 0) {
      const paths = idFiles.map((f) => `${userId}/${f.name}`);
      await admin.storage.from("id-verification").remove(paths);
    }
    steps.push({
      step: "delete_id_verification_storage",
      ok: true,
      detail: `${idFiles?.length ?? 0} files`,
    });
  } catch (err) {
    steps.push({
      step: "delete_id_verification_storage",
      ok: false,
      detail: err instanceof Error ? err.message : "unknown",
    });
  }

  // ── Step 2. Delete the auth.users row ─────────────────────────────────
  // This triggers the FK cascades that handle everything else:
  //   - profiles row deleted (ON DELETE CASCADE from auth.users)
  //   - user_verifications, saved_destinations, notifications, buddy_*,
  //     etc. cascade-deleted via profiles
  //   - beware_reports.reported_by_id, community_posts.author_id,
  //     community_replies.author_id, intel_card_views.viewer_id all
  //     auto-anonymized via ON DELETE SET NULL (rows preserved as
  //     platform record, FK nulled)
  try {
    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) {
      steps.push({
        step: "delete_auth_user",
        ok: false,
        detail: error.message,
      });
      return { ok: false, userId, steps, error: error.message };
    }
    steps.push({ step: "delete_auth_user", ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    steps.push({ step: "delete_auth_user", ok: false, detail: msg });
    return { ok: false, userId, steps, error: msg };
  }

  // ── Step 3. Audit-log the purge ───────────────────────────────────────
  // We retain the audit row even though the user is gone — the audit log
  // is the platform's record of WHO purged WHO and WHY.
  // moderation_audit_log allows admin role inserts via RLS; using the
  // typed supabase client (admin-session) here, not the service-role one.
  try {
    const supabase = await createClient();
    await supabase.from("moderation_audit_log").insert({
      actor_id: adminId,
      action: "purge_user",
      target_type: "user",
      target_id: userId,
      reason: reason || "DPDP / GDPR right-to-erasure request",
    });
    steps.push({ step: "audit_log", ok: true });
  } catch (err) {
    // Don't fail the purge if audit-log write fails — user is already gone.
    steps.push({
      step: "audit_log",
      ok: false,
      detail: err instanceof Error ? err.message : "unknown",
    });
  }

  return { ok: true, userId, steps };
}
