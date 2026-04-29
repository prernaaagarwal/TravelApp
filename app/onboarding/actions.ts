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
