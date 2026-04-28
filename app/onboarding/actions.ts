"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateSegment(segment: {
  tripCount: string;
  destination: string;
  worries: string[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("profiles")
    .update({ segment: { ...segment, completedAt: new Date().toISOString() } })
    .eq("id", user.id);
}
