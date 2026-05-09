"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveTripAction(data: {
  destination: string;
  days: number;
  budget: number;
  month: string | null;
  notes: string | null;
  matched_itinerary_id: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase.from("saved_trips").insert({
    user_id: user.id,
    destination: data.destination,
    days: data.days,
    budget: data.budget,
    month: data.month,
    notes: data.notes,
    matched_itinerary_id: data.matched_itinerary_id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/feed");
  return { success: true };
}
