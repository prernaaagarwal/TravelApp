"use server";

import { createClient } from "@/lib/supabase/server";

type LeadSource = "landing-founding" | "contributor-apply" | "destination-waitlist";

export async function submitLead(
  email: string,
  source: LeadSource,
  // For destination-waitlist: the destination string the user searched for.
  // Encoded into the source column as `destination-waitlist:<query>` so we
  // can group by destination in SQL without a schema migration.
  meta?: string,
): Promise<{ error?: string }> {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const sourceWithMeta = meta
    ? `${source}:${meta.toLowerCase().trim().slice(0, 80)}`
    : source;

  try {
    const supabase = await createClient();
    await supabase.from("leads").insert({
      email:  email.toLowerCase().trim(),
      source: sourceWithMeta,
    });
    return {};
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}
