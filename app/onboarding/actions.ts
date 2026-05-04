"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateSegment(segment: {
  destination: string;
  need?: string;
  tripCount?: string;
  worries?: string[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("profiles")
    .update({ segment: { ...segment, completedAt: new Date().toISOString() } })
    .eq("id", user.id);
}

export async function completeProfile(input: {
  firstName: string;
  homeCity: string;
  ageGroup: string;
  instagram?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  const firstName = input.firstName.trim();
  const homeCity = input.homeCity.trim();
  if (!firstName || !homeCity || !input.ageGroup) {
    return { error: "All fields except Instagram are required." };
  }

  // Merge ageGroup into segment, preserve any existing segment fields
  const { data: profile } = await supabase
    .from("profiles")
    .select("segment")
    .eq("id", user.id)
    .single();
  const currentSegment = (profile?.segment as Record<string, unknown>) ?? {};

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: firstName,
      home_city: homeCity,
      instagram: input.instagram?.trim() || null,
      segment: { ...currentSegment, ageGroup: input.ageGroup },
    })
    .eq("id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}
