import { OnboardingWizard } from "@/components/intel/OnboardingWizard";

export const metadata = {
  title: "Get Started — Wander Women",
  description:
    "Three questions. We route you straight to the Trip Intel Card built for your trip.",
};

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8 text-center">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          90 seconds, 3 questions
        </p>
        <h1 className="mb-3 font-serif text-4xl text-ink md:text-5xl">
          Tell us about your trip.
        </h1>
        <p className="font-mono text-sm leading-relaxed text-ww-muted">
          Answer three things — we route you to the Trip Intel Card built for
          your stage of solo travel.
        </p>
      </div>

      <OnboardingWizard />

      <p className="mt-6 text-center font-mono text-[10px] text-ww-muted">
        Your answers are stored locally on this device. No account needed for V0.
      </p>
    </div>
  );
}
