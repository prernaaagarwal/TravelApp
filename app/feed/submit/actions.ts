"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { checkRateLimit, LIMITS } from "@/lib/rate-limit";

const schema = z.object({
  destination_slug: z.string().min(1, "Destination required"),
  destination:      z.string().min(2, "Destination name required").max(100),
  trip_start:       z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date"),
  trip_end:         z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid end date"),
  cost_stay:        z.coerce.number().int().min(0),
  cost_food:        z.coerce.number().int().min(0),
  cost_transport:   z.coerce.number().int().min(0),
  cost_activities:  z.coerce.number().int().min(0),
  cost_misc:        z.coerce.number().int().min(0),
  highlight:        z.string().min(10, "Highlight quote too short").max(500),
  notes_raw:        z.string().min(5, "Add at least one note"),
});

export async function submitTripFeed(
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to submit a trip." };

  const limit = await checkRateLimit(supabase, user.id, LIMITS.TRIP_SUBMISSIONS);
  if (!limit.allowed) return { error: limit.message };

  const result = schema.safeParse({
    destination_slug: formData.get("destination_slug"),
    destination:      (formData.get("destination") as string)?.trim(),
    trip_start:       formData.get("trip_start"),
    trip_end:         formData.get("trip_end"),
    cost_stay:        formData.get("cost_stay"),
    cost_food:        formData.get("cost_food"),
    cost_transport:   formData.get("cost_transport"),
    cost_activities:  formData.get("cost_activities"),
    cost_misc:        formData.get("cost_misc"),
    highlight:        (formData.get("highlight") as string)?.trim(),
    notes_raw:        formData.get("notes_raw"),
  });
  if (!result.success) return { error: result.error.issues[0].message };

  const d = result.data;

  const start = new Date(d.trip_start);
  const end   = new Date(d.trip_end);
  if (end <= start) return { error: "End date must be after start date." };
  const dayCount = Math.round((end.getTime() - start.getTime()) / 86_400_000);

  const topNotes = (d.notes_raw as string)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 6);
  if (topNotes.length < 1) return { error: "Add at least one trip note." };

  const totalCostInr =
    d.cost_stay + d.cost_food + d.cost_transport + d.cost_activities + d.cost_misc;
  if (totalCostInr === 0) return { error: "Total cost can't be zero." };
  const totalCostUsd = Math.round(totalCostInr / 84);

  const { error } = await supabase.from("trip_submissions").insert({
    user_id:          user.id,
    destination_slug: d.destination_slug,
    destination:      d.destination,
    trip_start:       d.trip_start,
    trip_end:         d.trip_end,
    day_count:        dayCount,
    total_cost_inr:   totalCostInr,
    total_cost_usd:   totalCostUsd,
    cost_stay:        d.cost_stay,
    cost_food:        d.cost_food,
    cost_transport:   d.cost_transport,
    cost_activities:  d.cost_activities,
    cost_misc:        d.cost_misc,
    top_notes:        topNotes,
    highlight:        d.highlight,
    status:           "pending",
  });

  if (error) return { error: error.message };
  redirect("/feed?submitted=trip");
}
