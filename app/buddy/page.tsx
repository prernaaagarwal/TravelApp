import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { RegisterTripForm } from "@/components/intel/RegisterTripForm";
import { ConnectButton } from "@/components/intel/ConnectButton";
import { ReportBuddyButton } from "@/components/buddy/ReportBuddyButton";
import { BuddyVerifiedBadge } from "@/components/buddy/BuddyVerifiedBadge";
import { VerificationMethodology } from "@/components/account/VerificationMethodology";
import { getVerificationStatus } from "@/lib/buddy-verification";
import buddyMatches from "@/lib/mock-data/buddy-matches.json";
import { formatDestinationSlug } from "@/lib/utils";

export const metadata = {
  title: "Find a Solo Female Travel Buddy — Verified Matches by Destination",
  description:
    "Solo female travel buddy matching: find women going where you're going on overlapping dates. Buddy profiles are phone + ID verified by our team.",
};

export default async function BuddyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const status = await getVerificationStatus();

  // user's own registered trip
  const { data: myTrip } = user
    ? await supabase.from("buddy_matches").select("*").eq("user_id", user.id).single()
    : { data: null };

  // DB matches for user's destination (exclude self + paused profiles)
  let dbMatches: Array<Record<string, unknown>> | null = null;
  if (myTrip && user) {
    const { data: rawMatches } = await supabase
      .from("buddy_matches")
      .select("*")
      .eq("destination_slug", myTrip.destination_slug)
      .neq("user_id", user.id)
      .limit(20);

    if (rawMatches && rawMatches.length > 0) {
      const matchUserIds = rawMatches.map((m) => m.user_id);
      const { data: profileFlags } = await supabase
        .from("profiles")
        .select("id, id_verified, is_paused")
        .in("id", matchUserIds);
      const flagsByUser = new Map(
        (profileFlags ?? []).map((p) => [p.id, p]),
      );
      // Drop paused profiles entirely; surface verified flag on the row
      dbMatches = rawMatches
        .filter((m) => !flagsByUser.get(m.user_id)?.is_paused)
        .map((m) => ({
          ...m,
          id_verified: flagsByUser.get(m.user_id)?.id_verified ?? false,
        }))
        .slice(0, 10);
    } else {
      dbMatches = [];
    }
  }

  // connections already sent by user
  const { data: sentConnections } = user
    ? await supabase.from("buddy_connections").select("to_match_id").eq("from_user_id", user.id)
    : { data: null };
  const sentIds = new Set((sentConnections ?? []).map((c) => c.to_match_id));

  // fall back to mock data if no DB matches
  const showMock = !myTrip || !dbMatches || dbMatches.length === 0;
  const viewerVerified = status?.idVerified ?? false;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-6">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          Solo female travel buddy match
        </p>
        <h1 className="mb-3 font-serif text-4xl text-ink md:text-5xl">
          Solo, but not alone.
        </h1>
        <p className="font-mono text-sm leading-relaxed text-ww-muted">
          Match with women going where you&apos;re going on dates that actually
          overlap. Buddy profiles are phone + ID verified by our team — see
          below for exactly what that means.
        </p>
      </div>

      <div className="mb-6">
        <VerificationMethodology compact />
      </div>

      {user && !viewerVerified && !status?.isBanned && (
        <div className="mb-6 flex flex-col gap-3 rounded-lg border border-rust/40 bg-rust/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs leading-relaxed text-ink">
            <span className="font-semibold">Verify your account to send hellos.</span>{" "}
            You can browse profiles now — sending a connection requires phone +
            ID verification first.
          </p>
          <Link
            href="/account/verify"
            className="shrink-0 border border-rust bg-rust px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-warm-white hover:bg-rust/90"
          >
            Verify now →
          </Link>
        </div>
      )}

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
          dbMatches!.slice(0, 5).map((b) => {
            const buddy = b as {
              id: string;
              user_id: string;
              first_name?: string;
              age_range?: string;
              home_city?: string;
              destination_slug: string;
              travel_start?: string;
              travel_end?: string;
              travel_style?: string[];
              id_verified?: boolean;
            };
            return (
              <article key={buddy.id} className="border border-ww-border bg-sand p-5">
                <div className="flex flex-wrap items-start gap-4">
                  <div className="h-16 w-16 shrink-0 rounded-full bg-rust/20 flex items-center justify-center text-rust text-xl font-medium">
                    {(buddy.first_name?.[0] ?? "W").toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <h3 className="font-serif text-2xl text-ink">{buddy.first_name}</h3>
                      {buddy.id_verified && <BuddyVerifiedBadge />}
                    </div>
                    <p className="font-mono text-xs text-ww-muted">
                      {buddy.age_range && `${buddy.age_range} · `}{buddy.home_city && `${buddy.home_city} · `}
                      {formatDestinationSlug(buddy.destination_slug)}
                    </p>
                    {(buddy.travel_start || buddy.travel_end) && (
                      <p className="mt-1 font-mono text-[10px] text-ww-muted">
                        {buddy.travel_start} {buddy.travel_end ? `→ ${buddy.travel_end}` : ""}
                      </p>
                    )}
                    {buddy.travel_style && buddy.travel_style.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {buddy.travel_style.map((s) => (
                          <span key={s} className="rounded-full bg-blue-light px-2 py-0.5 font-mono text-[10px] text-blue">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-ww-border pt-4">
                  {user ? (
                    <>
                      <ConnectButton
                        matchId={buddy.id}
                        alreadySent={sentIds.has(buddy.id)}
                        viewerVerified={viewerVerified}
                      />
                      <ReportBuddyButton reportedUserId={buddy.user_id} />
                    </>
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
            );
          })
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
          <div className="flex flex-wrap items-baseline gap-2">
            <h3 className="font-serif text-2xl text-ink">{buddy.firstName}</h3>
            {buddy.idVerified && <BuddyVerifiedBadge />}
          </div>
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
