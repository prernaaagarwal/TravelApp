import { OnboardingWizard } from "@/components/intel/OnboardingWizard";

export const metadata = {
  title: "Get Started — Wander Women",
  description:
    "Two questions. We route you to exactly the right feature for your trip.",
};

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ path?: string }>;
}) {
  const { path } = await searchParams;
  const scope: "indian" | "foreign" | "all" =
    path === "indian" ? "indian" : path === "foreign" ? "foreign" : "all";

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8 text-center">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          30 seconds, 2 questions
        </p>
        <h1 className="mb-3 font-serif text-4xl text-ink md:text-5xl">
          Tell us about your trip.
        </h1>
        <p className="font-mono text-sm leading-relaxed text-ww-muted">
          Pick your destination and what you need — we take you straight there.
        </p>
      </div>

      <OnboardingWizard scope={scope} />

      <p className="mt-6 text-center font-mono text-[10px] text-ww-muted">
        Your answers are stored locally on this device. No account needed for V0.
      </p>
    </div>
  );
}
