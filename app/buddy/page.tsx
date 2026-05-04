import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { RegisterTripForm } from "@/components/intel/RegisterTripForm";
import { ConnectButton } from "@/components/intel/ConnectButton";
import buddyMatches from "@/lib/mock-data/buddy-matches.json";
import { formatDestinationSlug } from "@/lib/utils";

export const metadata = {
  title: "Find a Travel Buddy — Wander Women",
  description:
    "Match with women going to the same destination on overlapping dates. Verified profiles, no creeps.",
};

export default async function BuddyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // user's own registered trip
  const { data: myTrip } = user
    ? await supabase.from("buddy_matches").select("*").eq("user_id", user.id).single()
    : { data: null };

  // DB matches for user's destination (exclude self)
  const { data: dbMatches } = myTrip
    ? await supabase
        .from("buddy_matches")
        .select("*")
        .eq("destination_slug", myTrip.destination_slug)
        .neq("user_id", user!.id)
        .limit(10)
    : { data: null };

  // connections already sent by user
  const { data: sentConnections } = user
    ? await supabase.from("buddy_connections").select("to_match_id").eq("from_user_id", user.id)
    : { data: null };
  const sentIds = new Set((sentConnections ?? []).map((c) => c.to_match_id));

  // fall back to mock data if no DB matches
  const showMock = !myTrip || !dbMatches || dbMatches.length === 0;

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

      {/* registration / trip status */}
      {user ? (
        myTrip ? (
          <div className="mb-8 border border-sage/30 bg-sage-light/30 px-4 py-3">
            <p className="font-mono text-xs text-sage">
              ✓ Your trip: <strong>{formatDestinationSlug(myTrip.destination_slug)}</strong>
              {myTrip.travel_start && ` · ${myTrip.travel_start}`}
              {myTrip.travel_end && ` → ${myTrip.travel_end}`}
            </p>
            <p className="mt-1 font-mono text-[10px] text-ww-muted">
              Showing women going to the same destination.
            </p>
          </div>
        ) : (
          <RegisterTripForm defaultFirstName={user.email?.split("@")[0]} />
        )
      ) : (
        <div className="mb-8 border border-dashed border-ww-border bg-sand px-4 py-3 flex items-center justify-between">
          <span className="font-mono text-xs text-ww-muted">Register your trip to find real matches</span>
          <Link href="/account/login?next=/buddy" className="font-mono text-[10px] uppercase tracking-widest text-rust hover:underline">
            Sign in →
          </Link>
        </div>
      )}

      {/* match cards */}
      <div className="space-y-5">
        {showMock ? (
          // mock matches
          buddyMatches.slice(0, 3).map((b, i) => (
            <MockBuddyCard key={b.id} buddy={b} rank={i} />
          ))
        ) : (
          dbMatches!.slice(0, 5).map((b) => (
            <article key={b.id} className="border border-ww-border bg-sand p-5">
              <div className="flex flex-wrap items-start gap-4">
                <div className="h-16 w-16 shrink-0 rounded-full bg-rust/20 flex items-center justify-center text-rust text-xl font-medium">
                  {(b.first_name?.[0] ?? "W").toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-2xl text-ink">{b.first_name}</h3>
                  <p className="font-mono text-xs text-ww-muted">
                    {b.age_range && `${b.age_range} · `}{b.home_city && `${b.home_city} · `}
                    {formatDestinationSlug(b.destination_slug)}
                  </p>
                  {(b.travel_start || b.travel_end) && (
                    <p className="mt-1 font-mono text-[10px] text-ww-muted">
                      {b.travel_start} {b.travel_end ? `→ ${b.travel_end}` : ""}
                    </p>
                  )}
                  {b.travel_style && (b.travel_style as string[]).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(b.travel_style as string[]).map((s) => (
                        <span key={s} className="rounded-full bg-blue-light px-2 py-0.5 font-mono text-[10px] text-blue">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-ww-border pt-4">
                {user ? (
                  <ConnectButton matchId={b.id} alreadySent={sentIds.has(b.id)} />
                ) : (
                  <Link
                    href="/account/login?next=/buddy"
                    className="border border-rust bg-rust px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-warm-white hover:bg-rust/90 transition-colors"
                  >
                    Sign in to connect →
                  </Link>
                )}
              </div>
            </article>
          ))
        )}

        {!showMock && dbMatches!.length === 0 && (
          <div className="py-12 text-center border border-ww-border bg-sand">
            <p className="font-mono text-sm text-ww-muted mb-2">No other women registered for this destination yet.</p>
            <p className="font-mono text-[10px] text-ww-muted">Check back soon — we&apos;re growing fast.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MockBuddyCard({ buddy }: { buddy: typeof buddyMatches[0]; rank: number }) {
  return (
    <article className="relative border border-ww-border bg-sand p-5">
      <span className="absolute right-4 top-4 rounded-full bg-sand border border-ww-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
        Demo match
      </span>
      <div className="flex flex-wrap items-start gap-4">
        <Image src={buddy.photoUrl} alt={buddy.firstName}
          width={64} height={64} className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-ww-border" />
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-2xl text-ink">{buddy.firstName}</h3>
          <p className="font-mono text-xs text-ww-muted">
            {buddy.ageRange} · {buddy.homeCity} · {buddy.tripCount} solo trips
          </p>
          <p className="mt-1 font-mono text-[10px] text-ww-muted">
            {buddy.travelDates.start} → {buddy.travelDates.end} · #{formatDestinationSlug(buddy.destinationSlug).toLowerCase().replace(/\s+/g, "")}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {buddy.styleTags.map((tag) => (
              <span key={tag} className="rounded-full bg-sage-light px-2 py-0.5 font-mono text-[10px] text-sage">✓ {tag}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2 border-t border-ww-border pt-4">
        <Link
          href="/account/signup"
          className="border border-rust bg-rust px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-warm-white hover:bg-rust/90 transition-colors"
        >
          Join to connect →
        </Link>
      </div>
    </article>
  );
}
