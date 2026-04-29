"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateNotificationPref(key: string, value: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const allowed = [
    "new_beware_in_saved_destinations",
    "buddy_match_found",
    "community_reply_to_my_post",
    "platform_updates",
    "whatsapp_enabled",
    "email_enabled",
  ];
  if (!allowed.includes(key)) return;

  await supabase.from("notification_preferences").upsert(
    { user_id: user.id, [key]: value, updated_at: new Date().toISOString() },
    { onConflict: "user_id" }
  );
}

export async function updateEmail(formData: FormData) {
  const supabase = await createClient();
  const email = (formData.get("email") as string)?.trim();
  if (!email) return;
  await supabase.auth.updateUser({ email });
  revalidatePath("/settings");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function deleteAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Soft delete — mark as deleted, sign out
  await supabase
    .from("profiles")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", user.id);
  await supabase.auth.signOut();
  redirect("/");
}
