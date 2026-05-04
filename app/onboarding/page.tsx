import { OnboardingWizard } from "@/components/intel/OnboardingWizard";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Get Started — Wander Women",
  description:
    "Two questions. We route you to exactly the right feature for your trip.",
};

type Region = "india" | "foreign" | "all";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const { region: regionParam } = await searchParams;
  const region: Region =
    regionParam === "india" ? "india" : regionParam === "foreign" ? "foreign" : "all";

  const supabase = await createClient();

  // Fetch destinations from intel_cards (source of truth) and user state in parallel
  const [{ data: cards }, { data: { user } }] = await Promise.all([
    supabase
      .from("intel_cards")
      .select("slug, destination, country")
      .order("destination"),
    supabase.auth.getUser(),
  ]);

  const destinations = (cards ?? []).map((c) => ({
    slug: c.slug,
    label: c.destination,
    country: c.country,
  }));

  // Detect whether profile setup is needed (only for logged-in users)
  let needsProfileSetup = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, home_city, segment")
      .eq("id", user.id)
      .single();
    const segment = (profile?.segment as Record<string, unknown>) ?? {};
    needsProfileSetup =
      !profile?.first_name || !profile?.home_city || !segment.ageGroup;
  }

  const stepCount = needsProfileSetup ? 3 : 2;

  const heading = needsProfileSetup
    ? "Welcome to Wander Women."
    : region === "india"
    ? "Where in India?"
    : region === "foreign"
    ? "Which country?"
    : "Tell us about your trip.";

  const subtext = needsProfileSetup
    ? "Three quick questions and we'll route you to exactly what you need."
    : region === "india"
    ? "Pick your Indian destination — we pull the safety intel, scams, and hidden gems."
    : region === "foreign"
    ? "Pick your destination outside India — women-only stays, transit safety, local intel."
    : "Pick your destination and what you need — we take you straight there.";

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8 text-center">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          {stepCount === 3 ? "1 minute · 3 quick steps" : "30 seconds · 2 questions"}
        </p>
        <h1 className="mb-3 font-serif text-4xl text-ink md:text-5xl">
          {heading}
        </h1>
        <p className="font-mono text-sm leading-relaxed text-ww-muted">
          {subtext}
        </p>
      </div>

      <OnboardingWizard
        needsProfileSetup={needsProfileSetup}
        region={region}
        destinations={destinations}
      />
    </div>
  );
}
