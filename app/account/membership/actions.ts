"use server";

import { createClient } from "@/lib/supabase/server";

export async function joinWaitlist(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  if (!email) return { error: "Email is required" };

  const { error } = await supabase.from("founding_membership_waitlist").insert({
    email,
    phone: (formData.get("phone") as string) || null,
    city: (formData.get("city") as string) || null,
    instagram: (formData.get("instagram") as string) || null,
  });

  if (error) return { error: error.message };
  return { success: true };
}
