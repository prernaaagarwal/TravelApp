"use server";

import { createClient } from "@/lib/supabase/server";

export async function joinWaitlist(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const email = (formData.get("email") as string)?.trim();
  if (!email) return { error: "Email is required" };

  const { error } = await supabase.from("founding_membership_waitlist").insert({
    user_id: user?.id ?? null,
    email,
    phone: (formData.get("phone") as string) || null,
    city: (formData.get("city") as string) || null,
    instagram: (formData.get("instagram") as string) || null,
  });

  if (error) return { error: error.message };

  // Mark the user's profile as a founding member. The page-level auth gate
  // on /account/membership guarantees `user` is set, but we null-check
  // defensively. RLS allows users to update their own profile row, so this
  // doesn't need the service role.
  if (user) {
    await supabase
      .from("profiles")
      .update({ membership_tier: "founding" })
      .eq("id", user.id);
  }

  // No custom transactional email — Supabase Auth's magic-link confirmation
  // (sent during signup) already proves the address works, and the actual
  // human follow-up happens via WhatsApp per the success-state copy. We can
  // wire Resend back in once we have a verified sending domain.

  return { success: true };
}
