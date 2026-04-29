import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProfileEditClient } from "./ProfileEditClient";

const CITY_LABELS: Record<string, string> = {
  "goa-india": "Goa", "delhi-india": "Delhi", "mumbai-india": "Mumbai",
  "jaipur-india": "Jaipur", "manali-india": "Manali", "rishikesh-india": "Rishikesh",
  "varanasi-india": "Varanasi", "udaipur-india": "Udaipur", "agra-india": "Agra",
  "bangalore-india": "Bangalore", "kolkata-india": "Kolkata", "chennai-india": "Chennai",
  "kochi-india": "Kochi", "kasol-india": "Kasol", "hampi-india": "Hampi",
  "tokyo-japan": "Tokyo", "bangkok-thailand": "Bangkok", "hanoi-vietnam": "Hanoi",
  "dubai-uae": "Dubai", "seoul-south-korea": "Seoul", "paris-france": "Paris",
};

const WORRY_LABELS: Record<string, string> = {
  scams:       "🎭 Scams",
  harassment:  "🛡️ Harassment",
  transport:   "🚌 Transport",
  health:      "🏥 Health",
  solo_nights: "🌙 Solo nights",
  language:    "💬 Language",
};

const BADGE_META: Record<string, { icon: string; label: string }> = {
  founding_contributor: { icon: "🌟", label: "Founding Contributor" },
  intel_writer:         { icon: "✍️", label: "Intel Writer" },
  beware_reporter:      { icon: "🛡️", label: "Safety Reporter" },
  community_helper:     { icon: "💬", label: "Community Helper" },
  local_sister:         { icon: "📍", label: "Local Sister" },
};

const TRIP_LABELS: Record<string, string> = {
  "0": "First solo trip", "1-2": "1–2 trips", "3-5": "3–5 trips", "6+": "6+ trips",
};

type Segment = {
  tripCount?: string;
  travelPreference?: string;
  travelStyle?: string[];
  citiesVisited?: string[];
  languages?: string[];
  destination?: string;
  need?: string;
  worries?: string[];
  ageGroup?: string;
};

type Badge = {
  badge_type: string;
  destination_slug: string | null;
  awarded_at: string;
};

type SavedDest = {
  destination_slug: string;
  saved_at: string;
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  // Viewer identity
  const { data: { user: viewer } } = await supabase.auth.getUser();

  // Resolve profile by username OR uuid (fallback for users without username yet)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(username);
  const lookup = supabase
    .from("profiles")
    .select("*")
    .is("deleted_at", null);
  const { data: profile } = isUuid
    ? await lookup.eq("id", username).single()
    : await lookup.eq("username", username).single();

  if (!profile) notFound();

  const isOwner = viewer?.id === profile.id;
  const displayName = profile.first_name ?? profile.username ?? profile.email?.split("@")[0] ?? "W";
  const initial = displayName[0].toUpperCase();
  const memberSince = new Date(profile.created_at).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const segment = (profile.segment as Segment | null) ?? {};

  // Parallel data fetches
  const [
    { data: badges },
    { data: savedDests },
    { count: bewareCount },
    { count: postCount },
  ] = await Promise.all([
    supabase
      .from("contributor_badges")
      .select("badge_type, destination_slug, awarded_at")
      .eq("user_id", profile.id)
      .order("awarded_at"),
    supabase
      .from("saved_destinations")
      .select("destination_slug, saved_at")
      .eq("user_id", profile.id)
      .order("saved_at", { ascending: false })
      .limit(12),
    supabase
      .from("beware_reports")
      .select("id", { count: "exact", head: true })
      .eq("reported_by_id", profile.id)
      .eq("status", "approved"),
    supabase
      .from("community_posts")
      .select("id", { count: "exact", head: true })
      .eq("author_id", profile.id)
      .eq("status", "approved"),
  ]);

  const totalContribs = (bewareCount ?? 0) + (postCount ?? 0);
  const hasStats = totalContribs > 0;
  const hasBadges = (badges?.length ?? 0) > 0;
  const hasSaved = (savedDests?.length ?? 0) > 0;
  const hasPrefs =
    segment.travelStyle?.length || segment.travelPreference || segment.tripCount;
  const hasBio = !!profile.instagram;
  const hasNextDest = !!segment.destination;
  const hasWorries = (segment.worries?.length ?? 0) > 0;

  return (
    <main className="min-h-screen bg-sand px-4 py-12">
      <div className="mx-auto max-w-lg space-y-4">
        {/* Back + settings link */}
        <div className="mb-2 flex items-center justify-between">
          <Link href="/" className="text-sm text-ww-muted hover:text-ink">
            ← Home
          </Link>
          {isOwner && (
            <Link
              href="/settings"
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted hover:text-ink"
            >
              Account settings →
            </Link>
          )}
        </div>

        {/* ── 1. Identity block ────────────────────────── */}
        <div className="bg-warm-white border border-ww-border rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 shrink-0 rounded-full bg-rust/20 flex items-center justify-center text-rust text-2xl font-medium">
                {initial}
              </div>
              <div className="min-w-0">
                <h1 className="font-serif text-2xl text-ink truncate">{displayName}</h1>
                {profile.username && (
                  <p className="font-mono text-[11px] text-ww-muted">@{profile.username}</p>
                )}
                {profile.home_city && (
                  <p className="font-mono text-xs text-ww-muted">📍 {profile.home_city}</p>
                )}
                <p className="font-mono text-[10px] text-ww-muted">Member since {memberSince}</p>
                {segment.ageGroup && (
                  <p className="font-mono text-[10px] text-ww-muted">{segment.ageGroup} yrs</p>
                )}
              </div>
            </div>
            {profile.membership_tier === "founding" && (
              <span className="shrink-0 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 font-mono text-[10px] text-gold">
                Founding member
              </span>
            )}
          </div>

          {/* Tag preview for public view */}
          {!isOwner && (
            <div className="mt-4 space-y-2 border-t border-ww-border pt-4">
              {(segment.travelStyle?.length ?? 0) > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">Style</span>
                  {segment.travelStyle!.map((s) => (
                    <span key={s} className="rounded-full bg-rust/10 text-rust text-[10px] px-2 py-0.5 font-mono">{s}</span>
                  ))}
                </div>
              )}
              {(segment.citiesVisited?.length ?? 0) > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">Solo&apos;d</span>
                  {segment.citiesVisited!.slice(0, 6).map((slug) => (
                    <span key={slug} className="rounded-full bg-sage/10 text-sage text-[10px] px-2 py-0.5 font-mono">
                      {CITY_LABELS[slug] ?? slug}
                    </span>
                  ))}
                  {segment.citiesVisited!.length > 6 && (
                    <span className="font-mono text-[10px] text-ww-muted">+{segment.citiesVisited!.length - 6}</span>
                  )}
                </div>
              )}
              {profile.instagram && (
                <p className="font-mono text-[11px] text-ww-muted">{profile.instagram}</p>
              )}
            </div>
          )}
        </div>

        {/* ── 2. Headed next ───────────────────────────── */}
        {hasNextDest && (
          <div className="bg-warm-white border border-ww-border rounded-xl p-5 shadow-sm">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ww-muted">Headed next</p>
            <Link
              href={`/intel/${segment.destination}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-rust/10 px-3 py-1.5 font-mono text-sm text-rust hover:bg-rust/20 transition-colors"
            >
              📍 {CITY_LABELS[segment.destination!] ?? segment.destination} →
            </Link>
          </div>
        )}

        {/* ── 3. Watches out for ───────────────────────── */}
        {hasWorries && (
          <div className="bg-warm-white border border-ww-border rounded-xl p-5 shadow-sm">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ww-muted">Watches out for</p>
            <div className="flex flex-wrap gap-1.5">
              {segment.worries!.map((w) => (
                <span
                  key={w}
                  className="rounded-full bg-gold/10 px-2.5 py-1 font-mono text-[10px] text-gold"
                >
                  {WORRY_LABELS[w] ?? w}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── 4. Contribution stats ─────────────────────── */}
        {hasStats && (
          <div className="bg-warm-white border border-ww-border rounded-xl p-5 shadow-sm">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-ww-muted">
              Community
            </p>
            <div className="grid grid-cols-2 gap-3 text-center">
              {(postCount ?? 0) > 0 && <StatPill label="Posts" value={postCount!} />}
              {(bewareCount ?? 0) > 0 && <StatPill label="Reports filed" value={bewareCount!} />}
            </div>
          </div>
        )}

        {/* ── 3. Badges ────────────────────────────────── */}
        {hasBadges && (
          <div className="bg-warm-white border border-ww-border rounded-xl p-5 shadow-sm">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-ww-muted">Badges</p>
            <div className="flex flex-wrap gap-2">
              {(badges as Badge[]).map((b) => {
                const meta = BADGE_META[b.badge_type];
                if (!meta) return null;
                const destLabel = b.destination_slug ? ` · ${CITY_LABELS[b.destination_slug] ?? b.destination_slug}` : "";
                return (
                  <span
                    key={`${b.badge_type}-${b.destination_slug}`}
                    className="flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-mono text-[10px] text-gold"
                  >
                    {meta.icon} {meta.label}{destLabel}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 4. Saved destinations ────────────────────── */}
        {hasSaved && (
          <div className="bg-warm-white border border-ww-border rounded-xl p-5 shadow-sm">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-ww-muted">Saved destinations</p>
            <div className="flex flex-wrap gap-2">
              {(savedDests as SavedDest[]).map((s) => (
                <Link
                  key={s.destination_slug}
                  href={`/intel/${s.destination_slug}`}
                  className="border border-ww-border bg-sand px-3 py-1.5 font-mono text-xs text-ink hover:border-rust hover:text-rust transition-colors"
                >
                  {CITY_LABELS[s.destination_slug] ?? s.destination_slug}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── 5. Travel preferences (read-only for non-owner) ── */}
        {!isOwner && hasPrefs && (
          <div className="bg-warm-white border border-ww-border rounded-xl p-5 shadow-sm">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-ww-muted">
              Travel preferences
            </p>
            <div className="space-y-2 text-sm">
              {segment.tripCount && (
                <div className="flex justify-between">
                  <span className="text-ww-muted">Experience</span>
                  <span className="text-ink">{TRIP_LABELS[segment.tripCount] ?? segment.tripCount}</span>
                </div>
              )}
              {segment.travelPreference && (
                <div className="flex justify-between">
                  <span className="text-ww-muted">Travel style</span>
                  <span className="capitalize text-ink">{segment.travelPreference}</span>
                </div>
              )}
              {(segment.languages?.length ?? 0) > 0 && (
                <div className="flex items-start justify-between gap-2">
                  <span className="shrink-0 text-ww-muted">Languages</span>
                  <span className="text-right text-ink">{segment.languages!.join(", ")}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 7. Bio + Instagram (non-owner) ─────────── */}
        {!isOwner && hasBio && (
          <div className="bg-warm-white border border-ww-border rounded-xl p-5 shadow-sm">
            {profile.instagram && (
              <a
                href={`https://instagram.com/${profile.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-rust hover:underline"
              >
                {profile.instagram}
              </a>
            )}
          </div>
        )}

        {/* ── Intel written (owner) ───────────────────── */}
        {isOwner && (
          <div className="bg-warm-white border border-ww-border rounded-xl p-5 shadow-sm">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ww-muted">Intel written</p>
            <p className="font-mono text-xs text-ww-muted">Coming soon — your published intel cards will appear here.</p>
          </div>
        )}

        {/* ── Owner: inline edit form ─────────────────── */}
        {isOwner && (
          <ProfileEditClient
            firstName={profile.first_name ?? ""}
            homeCity={profile.home_city ?? ""}
            instagram={profile.instagram ?? ""}
            username={profile.username ?? ""}
            segment={segment}
          />
        )}
      </div>
    </main>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-ww-border bg-sand py-3">
      <p className="font-serif text-2xl text-ink">{value}</p>
      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted">{label}</p>
    </div>
  );
}
