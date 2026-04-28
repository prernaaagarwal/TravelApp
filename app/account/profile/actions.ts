"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("profiles")
    .update({
      first_name: (formData.get("first_name") as string) || null,
      home_city: (formData.get("home_city") as string) || null,
      instagram: (formData.get("instagram") as string) || null,
      phone: (formData.get("phone") as string) || null,
    })
    .eq("id", user.id);

  revalidatePath("/account/profile");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
