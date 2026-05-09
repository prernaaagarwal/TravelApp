import { createClient } from "@/lib/supabase/server";
import { PlannerClient } from "./PlannerClient";
import { safeQuery } from "@/lib/safe-query";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: "Plan My Trip — Solo Female Travel Planner",
    description:
      "Get personalized day-by-day itineraries for solo female travel in India. Real budgets, safety tips, and women's advice for 15 destinations.",
    alternates: { canonical: "/feed" },
    robots: { index: true, follow: true },
  };
}

type SavedTrip = {
  id: string;
  destination: string;
  days: number;
  budget: number;
  month: string | null;
  notes: string | null;
  matched_itinerary_id: string | null;
  created_at: string;
};

export default async function FeedPage() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch saved trips if user is logged in
  let savedTrips: SavedTrip[] = [];
  if (user) {
    savedTrips = await safeQuery<SavedTrip[]>(
      supabase
        .from("saved_trips")
        .select("id, destination, days, budget, month, notes, matched_itinerary_id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      [],
      1500,
      "feed.saved_trips"
    );
  }

  return <PlannerClient user={user} savedTrips={savedTrips} />;
}
