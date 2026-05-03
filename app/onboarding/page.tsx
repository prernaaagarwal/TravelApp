import { OnboardingWizard } from "@/components/intel/OnboardingWizard";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Get Started — Wander Women",
  description:
    "Two questions. We route you to exactly the right feature for your trip.",
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8 text-center">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          {stepCount === 3 ? "1 minute · 3 quick steps" : "30 seconds · 2 questions"}
        </p>
        <h1 className="mb-3 font-serif text-4xl text-ink md:text-5xl">
          {needsProfileSetup ? "Welcome to Wander Women." : "Tell us about your trip."}
        </h1>
        <p className="font-mono text-sm leading-relaxed text-ww-muted">
          {needsProfileSetup
            ? "Three quick questions and we'll route you to exactly what you need."
            : "Pick your destination and what you need — we take you straight there."}
        </p>
      </div>

      <OnboardingWizard needsProfileSetup={needsProfileSetup} />
    </div>
  );
}
