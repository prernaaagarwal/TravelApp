"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function registerBuddyTrip(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  const destinationSlug = formData.get("destination_slug") as string;
  const firstName = formData.get("first_name") as string;
  if (!destinationSlug || !firstName) return { error: "Destination and name are required" };

  const styles = formData.getAll("style") as string[];

  const { error } = await supabase.from("buddy_matches").upsert({
    user_id: user.id,
    first_name: firstName,
    age_range: (formData.get("age_range") as string) || null,
    home_city: (formData.get("home_city") as string) || null,
    destination_slug: destinationSlug,
    travel_start: (formData.get("travel_start") as string) || null,
    travel_end: (formData.get("travel_end") as string) || null,
    budget_range: (formData.get("budget_range") as string) || null,
    travel_style: styles,
    instagram_verified: false,
  }, { onConflict: "user_id" });

  if (error) return { error: error.message };
  revalidatePath("/buddy");
  return { success: true };
}

export async function sendConnection(matchId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  const { error } = await supabase.from("buddy_connections").insert({
    from_user_id: user.id,
    to_match_id: matchId,
    status: "pending",
  });

  if (error && error.code !== "23505") return { error: error.message };
  revalidatePath("/buddy");
  return { success: true };
}
