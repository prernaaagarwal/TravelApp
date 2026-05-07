import { createClient } from "@/lib/supabase/server";
import { safeQuery } from "@/lib/safe-query";

/**
 * Shape of the JSONB blob written to `profiles.segment` by the onboarding
 * wizard (see app/onboarding/actions.ts). Every field is optional because
 * a user can complete profile setup before picking a destination, or vice
 * versa.
 */
export type OnboardingSegment = {
  destination?: string;
  need?: string;
  ageGroup?: string;
  tripCount?: string;
  worries?: string[];
  completedAt?: string;
};

type ProfileSegmentRow = { segment: unknown };

/**
 * Read the current viewer's onboarding segment from `profiles.segment`.
 * Returns null when:
 *   - the viewer is signed out
 *   - they've never completed onboarding (no segment row, no destination)
 *   - the read times out (safeQuery 1.5s ceiling)
 *
 * Use the returned `destination` slug to personalise landing copy / pre-fill
 * the Explore filter / etc. — never to gate access to anything safety-sensitive.
 */
export async function getCurrentSegment(): Promise<OnboardingSegment | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const profile = await safeQuery<ProfileSegmentRow | null>(
    supabase.from("profiles").select("segment").eq("id", user.id).single(),
    null,
    1500,
    "segment.profile",
  );

  const segment = (profile?.segment as OnboardingSegment | null) ?? null;
  if (!segment || !segment.destination) return null;
  return segment;
}

/**
 * Derive the default Explore filter from a destination slug.
 * `goa-india` -> "india", `tokyo-japan` -> "international".
 */
export function defaultExploreFilterFor(
  destination: string | null | undefined,
): "all" | "india" | "international" {
  if (!destination) return "all";
  return destination.endsWith("-india") ? "india" : "international";
}
