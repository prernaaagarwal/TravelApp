import { BuddyMatcher } from "@/components/intel/BuddyMatcher";
import buddyMatches from "@/lib/mock-data/buddy-matches.json";

export const metadata = {
  title: "Find a Travel Buddy — Wander Women",
  description:
    "Match with women going to the same destination on overlapping dates. Verified profiles, no creeps.",
};

export default function BuddyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-10">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          Travel buddy match
        </p>
        <h1 className="mb-3 font-serif text-4xl text-ink md:text-5xl">
          Solo, but not alone.
        </h1>
        <p className="font-mono text-sm leading-relaxed text-ww-muted">
          Match with women going where you&apos;re going on dates that actually
          overlap. Verified by Instagram, vouched for by other women in the
          community.
        </p>
      </div>

      <BuddyMatcher buddies={buddyMatches} />
    </div>
  );
}
