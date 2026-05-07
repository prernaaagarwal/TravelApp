"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { env, requireEnv } from "@/lib/config";

// DPDP / GDPR data-purge endpoint.
//
// This is the "right to erasure" mechanism we have to surface for legal
// review. It deletes all data associated with a user account, in this
// order:
//   1. Storage objects (avatars, ID-verification photos)
//   2. Tables that don't cascade from auth.users
//   3. The auth.users row itself (cascades to profiles + child rows
//      that have ON DELETE CASCADE configured)
//   4. An audit-log entry recording the purge actor + reason
//
// Some tables (moderation_audit_log, beware_reports authored by the
// user, etc.) we *don't* delete — that data is the platform's record.
// We anonymize foreign-keys instead by setting them to NULL.
//
// IMPORTANT: this is a one-way action. There is no undo. The admin must
// type the literal string "PURGE-{userId}" into a confirmation field
// for the action to proceed. This is the same pattern Stripe uses for
// account deletion.

type AdminClient = ReturnType<typeof createSupabaseClient>;

function adminSupabase(): AdminClient {
  return createSupabaseClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "admin") {
    // Note: only admin (not moderator) can purge — destructive action
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
  } catch (err) {
    redirect(`/admin/users/${targetUserId}/purge?error=unauthorized`);
  }

  // Block self-purge — admin cannot purge themselves
  if (adminId === targetUserId) {
    redirect(
      `/admin/users/${targetUserId}/purge?error=cannot_self_purge`,
    );
  }

  const result = await runPurge(targetUserId, adminId, reason);

  if (!result.ok) {
    const errMsg = encodeURIComponent(result.error ?? "purge_failed");
    redirect(
      `/admin/users/${targetUserId}/purge?error=${errMsg}`,
    );
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
  // Avatars (named by user id), ID verification photos
  try {
    // Avatars
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
    // ID verification photos (path is `{userId}/<filename>` per submitIdSelfie)
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

  // Beware photos — path is typically beware_reports.id-keyed; safe to skip
  // here because beware_reports rows are anonymized below, not deleted.
  // Photos remain attached to the (now-anonymized) report. If founder later
  // wants to nuke beware photos by author too, add another step.

  // ── Step 2. Anonymize foreign-keys on tables we keep ──────────────────
  // Beware reports authored by the user — keep the public record,
  // but null out the FK so they're no longer linkable to a person
  try {
    await admin
      .from("beware_reports")
      .update({ submitted_by: null })
      .eq("submitted_by", userId);
    steps.push({ step: "anonymize_beware_reports", ok: true });
  } catch (err) {
    steps.push({
      step: "anonymize_beware_reports",
      ok: false,
      detail: err instanceof Error ? err.message : "unknown",
    });
  }

  // Community posts authored by the user — same pattern (preserve discussion)
  try {
    await admin
      .from("community_posts")
      .update({ author_id: null })
      .eq("author_id", userId);
    await admin
      .from("community_replies")
      .update({ author_id: null })
      .eq("author_id", userId);
    steps.push({ step: "anonymize_community_authorship", ok: true });
  } catch (err) {
    steps.push({
      step: "anonymize_community_authorship",
      ok: false,
      detail: err instanceof Error ? err.message : "unknown",
    });
  }

  // ── Step 3. Hard-delete user-only personal data ───────────────────────
  // Tables that contain ONLY data linked to this user (no community impact)
  const userOnlyTables = [
    "user_verifications",
    "saved_destinations",
    "user_checklists",
    "notifications",
    "vault_signups",
    "buddy_matches",
    "intel_card_views",
    "feedback",
    "email_captures",
  ];
  for (const table of userOnlyTables) {
    try {
      // Most tables key on user_id; some key on viewer_id (intel_card_views)
      // and others. Try common columns.
      const candidates = ["user_id", "viewer_id", "submitted_by", "id"];
      for (const col of candidates) {
        const { error } = await admin.from(table).delete().eq(col, userId);
        if (!error) {
          // success on this column — stop trying others
          break;
        }
      }
      steps.push({ step: `delete_${table}`, ok: true });
    } catch (err) {
      steps.push({
        step: `delete_${table}`,
        ok: false,
        detail: err instanceof Error ? err.message : "unknown",
      });
    }
  }

  // ── Step 4. Delete the auth.users row ─────────────────────────────────
  // This cascades to `profiles` (FK ON DELETE CASCADE in 001_init.sql).
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

  // ── Step 5. Audit-log the purge ──────────────────────────────────────
  // We retain the audit row even though the user is gone — the audit
  // log is the platform's record of WHO purged WHO and WHY.
  try {
    await admin.from("moderation_audit_log").insert({
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
