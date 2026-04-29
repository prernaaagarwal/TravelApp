"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const update: Record<string, unknown> = {
    first_name: (formData.get("first_name") as string) || null,
    home_city:  (formData.get("home_city")  as string) || null,
    instagram:  (formData.get("instagram")  as string) || null,
  };

  const segmentRaw = formData.get("segment") as string | null;
  if (segmentRaw) {
    try {
      update.segment = JSON.parse(segmentRaw);
    } catch {}
  }

  await supabase.from("profiles").update(update).eq("id", user.id);

  revalidatePath("/account/profile");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
