"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAdmin(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/account/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/admin");

  return user.id;
}

export async function promoteToModerator(targetUserId: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ role: "moderator" })
    .eq("id", targetUserId)
    .eq("role", "user");

  if (error) return { error: error.message };
  revalidatePath("/admin/team");
  return;
}

export async function deactivateUser(targetUserId: string) {
  const callerId = await requireAdmin();
  if (targetUserId === callerId) return { error: "Cannot deactivate your own account." };

  const supabase = await createClient();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("profiles")
    .update({ deleted_at: now })
    .eq("id", targetUserId);

  if (error) return { error: error.message };

  // Mark all their pending flags as reviewed
  await supabase
    .from("user_reports")
    .update({ status: "reviewed", reviewed_by: callerId, reviewed_at: now })
    .eq("reported_user_id", targetUserId)
    .eq("status", "pending");

  revalidatePath("/admin");
  return {};
}

export async function dismissUserFlags(targetUserId: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  await supabase
    .from("user_reports")
    .update({ status: "dismissed", reviewed_by: user!.id, reviewed_at: new Date().toISOString() })
    .eq("reported_user_id", targetUserId)
    .eq("status", "pending");

  revalidatePath("/admin");
  return {};
}

export async function revokeRole(targetUserId: string) {
  const callerId = await requireAdmin();

  // Prevent admin from revoking their own role
  if (targetUserId === callerId) {
    return { error: "You cannot revoke your own admin role." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ role: "user" })
    .eq("id", targetUserId)
    .in("role", ["moderator", "admin"]);

  if (error) return { error: error.message };
  revalidatePath("/admin/team");
  return {};
}
