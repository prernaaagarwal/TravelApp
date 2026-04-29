"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfileField(field: string, value: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const allowed = ["first_name", "home_city", "instagram", "username"];
  if (!allowed.includes(field)) return;

  await supabase.from("profiles").update({ [field]: value || null }).eq("id", user.id);
  revalidatePath("/profile");
}

export async function updateSegmentField(patch: Record<string, unknown>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("segment")
    .eq("id", user.id)
    .single();

  const current = (profile?.segment as Record<string, unknown>) ?? {};
  await supabase
    .from("profiles")
    .update({ segment: { ...current, ...patch } })
    .eq("id", user.id);

  revalidatePath("/profile");
}

export async function toggleSavedDestination(slug: string, currentlySaved: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  if (currentlySaved) {
    await supabase
      .from("saved_destinations")
      .delete()
      .eq("user_id", user.id)
      .eq("destination_slug", slug);
  } else {
    await supabase
      .from("saved_destinations")
      .insert({ user_id: user.id, destination_slug: slug });
  }
  revalidatePath("/profile");
  return {};
}
