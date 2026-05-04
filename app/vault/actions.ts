"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitVaultSignup(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const phone = (formData.get("phone") as string)?.trim();
  const trip_destination = (formData.get("trip_destination") as string)?.trim();
  const travel_start = (formData.get("travel_start") as string) || null;
  const travel_end = (formData.get("travel_end") as string) || null;

  if (!email || !phone || !trip_destination) {
    return { error: "Email, WhatsApp number, and destination are required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (phone.replace(/\D/g, "").length < 7) {
    return { error: "Please enter a valid WhatsApp number." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("vault_signups").insert({
    email,
    phone,
    trip_destination,
    travel_start,
    travel_end,
  });

  if (error) {
    return { error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
