"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { sendVerificationApproved, sendVerificationRejected } from "@/lib/email";
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

export async function approveVerification(userId: string) {
  const { supabase, adminId } = await assertAdmin();

  const { data: row } = await supabase
    .from("user_verifications")
    .select("id_photo_path")
    .eq("user_id", userId)
    .single();

  // 1. Mark approved
  await supabase
    .from("user_verifications")
    .update({
      status: "approved",
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
      id_photo_path: null,
    })
    .eq("user_id", userId);

  // 2. Flip the verified flag on profile
  await supabase
    .from("profiles")
    .update({ id_verified: true })
    .eq("id", userId);

  // 3. Delete the ID photo from Storage. This is the explicit founder
  //    decision — minimum-data principle, smallest breach blast radius.
  if (row?.id_photo_path) {
    await supabase.storage.from("id-verification").remove([row.id_photo_path]);
  }

  // 4. Audit + notify
  await supabase.from("moderation_audit_log").insert({
    actor_id: adminId,
    action: "verify",
    target_type: "user_verification",
    target_id: userId,
  });

  const email = await getEmail(userId);
  if (email) {
    try {
      await sendVerificationApproved(email);
    } catch {
      // ignore email errors so the action still succeeds
    }
  }

  revalidatePath("/admin/verifications");
}

export async function rejectVerification(userId: string, reason: string) {
  const { supabase, adminId } = await assertAdmin();

  await supabase
    .from("user_verifications")
    .update({
      status: "rejected",
      rejection_reason: reason || null,
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  await supabase.from("moderation_audit_log").insert({
    actor_id: adminId,
    action: "reject_verification",
    target_type: "user_verification",
    target_id: userId,
    reason: reason || null,
  });

  const email = await getEmail(userId);
  if (email) {
    try {
      await sendVerificationRejected(email, reason);
    } catch {
      // ignore
    }
  }

  revalidatePath("/admin/verifications");
}
