"use server";

import { createClient } from "@/lib/supabase/server";
import { sendFoundingMembershipConfirmation } from "@/lib/email";

export async function joinWaitlist(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const email = (formData.get("email") as string)?.trim();
  if (!email) return { error: "Email is required" };

  const { error } = await supabase.from("founding_membership_waitlist").insert({
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

  // Fire the confirmation email — non-blocking. If RESEND_API_KEY is unset
  // (dev / CI) the helper no-ops; if Resend errors we still return success
  // because the waitlist row is the source of truth.
  try {
    await sendFoundingMembershipConfirmation(email);
  } catch {
    // swallow — the user is on the list either way
  }

  return { success: true };
}
