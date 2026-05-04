"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitLead(
  email: string,
  source: "landing-founding" | "contributor-apply"
): Promise<{ error?: string }> {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  try {
    const supabase = await createClient();
    await supabase.from("leads").insert({ email: email.toLowerCase().trim(), source });
    return {};
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}
