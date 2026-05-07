import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProfileEditClient } from "./ProfileEditClient";
import { MyReports } from "@/components/profile/MyReports";
import { ReportUserButton } from "@/components/profile/ReportUserButton";
import { CITY_LABELS, WORRY_LABELS, BADGE_META, TRIP_LABELS } from "@/lib/constants";
import type { Segment, Badge, SavedDestRow, IntelCardRow } from "@/types";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: { user: viewer } } = await supabase.auth.getUser();

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(username);
  const lookup = supabase.from("profiles").select("*").is("deleted_at", null);
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
  const nextDestList: string[] =
    segment.destinations ?? (segment.destination ? [segment.destination] : []);

  const [
    { data: badges },
    { data: savedDests },
    { data: intelCards, count: intelCount },
    { count: bewareCount },
    { count: postCount },
    { data: ownReports },
  ] = await Promise.all([
    supabase
      .from("contributor_badges")
      .select("badge_type, destination_slug, awarded_at")
      .eq("user_id", profile.id)
      .order("awarded_at"),
    supabase
      .from("saved_destinations")
      .select("destination_slug, saved_at, intel_cards(destination, country)")
      .eq("user_id", profile.id)
      .order("saved_at", { ascending: false })
      .limit(12),
    supabase
      .from("intel_cards")
      .select("slug, destination, country, hero_image_url, last_updated, verified_by_count", { count: "exact" })
      .eq("contributor_slug", profile.username ?? "__none__")
      .order("last_updated", { ascending: false }),
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
    // Own reports — all statuses — only fetched for profile owner
    isOwner
      ? supabase
          .from("beware_reports")
          .select("id, title, city, severity, status, rejection_reason, created_at, reviewed_at")
          .eq("reported_by_id", profile.id)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: null }),
  ]);

  // Buddy CTA: show only if viewer (non-owner) and viewer's buddy_matches share a destination with profile owner's
  let showBuddyCTA = false;
  if (viewer && !isOwner) {
    const { data: ownerMatches } = await supabase
      .from("buddy_matches")
      .select("destination_slug")
      .eq("user_id", profile.id);
    const ownerDests = new Set(
      (ownerMatches ?? []).map((m) => m.destination_slug).filter(Boolean) as string[]
    );
    if (ownerDests.size > 0) {
      const { data: viewerMatches } = await supabase
        .from("buddy_matches")
        .select("destination_slug")
        .eq("user_id", viewer.id);
      showBuddyCTA = (viewerMatches ?? []).some(
        (m) => m.destination_slug && ownerDests.has(m.destination_slug)
      );
    }
  }

  const intelCountSafe = intelCount ?? 0;
  const bewareCountSafe = bewareCount ?? 0;
  const postCountSafe = postCount ?? 0;
  const hasBadges = (badges?.length ?? 0) > 0;
  const hasSaved = (savedDests?.length ?? 0) > 0;
  const hasIntel = intelCountSafe > 0;
  const hasPrefs =
    segment.travelStyle?.length || segment.travelPreference || segment.tripCount;
  const hasBio = !!profile.instagram;
  const hasNextDest = nextDestList.length > 0;
  const hasWorries = (segment.worries?.length ?? 0) > 0;

  return (
    <main className="min-h-screen bg-sand px-4 py-12">
      <div className="mx-auto max-w-lg space-y-4">
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

        {/* ── Identity ─────────────────────────────────── */}
        <div className="bg-warm-white border border-ww-border rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-rust/20 flex items-center justify-center text-rust text-2xl font-medium">
                {profile.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- CDN URL with cache-bust query param not compatible with next/image domains
                  <img src={profile.photo_url} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  initial
                )}
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

        {/* ── Connect as buddy (non-owner only, if overlap) ─── */}
        {showBuddyCTA && (
          <div className="bg-warm-white border border-ww-border rounded-2xl p-5">
            <Link
              href="/buddy"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-none bg-rust px-4 py-2 font-mono text-sm text-warm-white hover:bg-rust/90"
            >
              Connect as buddy →
            </Link>
          </div>
        )}

        {/* ── Headed next ──────────────────────────────── */}
        {hasNextDest && (
          <div className="bg-warm-white border border-ww-border rounded-2xl p-5">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ww-muted">Headed next</p>
            <div className="flex flex-wrap gap-1.5">
              {nextDestList.map((slug) => (
                <Link
                  key={slug}
                  href={`/intel/${slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-rust/10 px-3 py-1.5 font-mono text-sm text-rust hover:bg-rust/20 transition-colors"
                >
                  📍 {CITY_LABELS[slug] ?? slug}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Watches out for ──────────────────────────── */}
        {hasWorries && (
          <div className="bg-warm-white border border-ww-border rounded-2xl p-5">
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

        {/* ── Contribution stats — always 3 pills ─────── */}
        <div className="bg-warm-white border border-ww-border rounded-2xl p-5">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-ww-muted">
            Community
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <StatPill label="Intel cards" value={intelCountSafe} />
            <StatPill label="Reports filed" value={bewareCountSafe} />
            <StatPill label="Posts" value={postCountSafe} />
          </div>
        </div>

        {/* ── Badges ───────────────────────────────────── */}
        {hasBadges && (
          <div className="bg-warm-white border border-ww-border rounded-2xl p-5">
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

        {/* ── Intel cards contributed ──────────────────── */}
        {hasIntel && (
          <div className="bg-warm-white border border-ww-border rounded-2xl p-5">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-ww-muted">Intel written</p>
            <div className="space-y-2">
              {(intelCards as IntelCardRow[]).map((card) => (
                <Link
                  key={card.slug}
                  href={`/intel/${card.slug}`}
                  className="flex items-center justify-between gap-3 border border-ww-border bg-sand px-3 py-2.5 hover:border-rust transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-sm text-ink truncate">
                      {card.destination}, {card.country}
                    </p>
                    {card.last_updated && (
                      <p className="font-mono text-[10px] text-ww-muted">
                        Updated {new Date(card.last_updated).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 font-mono text-[10px] text-ww-muted">
                    ✓ {card.verified_by_count}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Saved destinations ───────────────────────── */}
        {hasSaved && (
          <div className="bg-warm-white border border-ww-border rounded-2xl p-5">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-ww-muted">Saved destinations</p>
            <div className="flex flex-wrap gap-2">
              {(savedDests as SavedDestRow[]).map((s) => {
                const card = s.intel_cards?.[0];
                const dest = card?.destination ?? CITY_LABELS[s.destination_slug] ?? s.destination_slug;
                const country = card?.country;
                return (
                  <Link
                    key={s.destination_slug}
                    href={`/intel/${s.destination_slug}`}
                    className="border border-ww-border bg-sand px-3 py-1.5 font-mono text-xs text-ink hover:border-rust hover:text-rust transition-colors"
                  >
                    {dest}{country ? `, ${country}` : ""}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Travel preferences (read-only for non-owner) ── */}
        {!isOwner && hasPrefs && (
          <div className="bg-warm-white border border-ww-border rounded-2xl p-5">
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

        {/* ── Bio + Instagram (non-owner) ─────────── */}
        {!isOwner && hasBio && (
          <div className="bg-warm-white border border-ww-border rounded-2xl p-5">
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

        {/* ── Owner: beta feedback CTA ──────────────────── */}
        {isOwner && (
          <div className="rounded-2xl border border-rust/30 bg-rust/[0.04] p-5">
            <p className="mb-1 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-rust">
              <span className="h-1.5 w-1.5 rounded-full bg-rust" />
              Beta · We need your view
            </p>
            <h2 className="mb-2 font-serif text-lg leading-snug text-ink">
              Tell us what&apos;s working and what isn&apos;t.
            </h2>
            <p className="mb-3 font-mono text-xs leading-relaxed text-ww-muted">
              Eight short questions. Every field is optional. Real feedback from
              real users is the difference between this becoming a guidebook for
              women and yet another travel app.
            </p>
            <Link
              href="/feedback"
              className="inline-flex items-center gap-2 bg-rust px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-opacity hover:opacity-90"
            >
              Share feedback
              <span aria-hidden>→</span>
            </Link>
          </div>
        )}

        {/* ── Owner: my reports ────────────────────────── */}
        {isOwner && (
          <div className="rounded-2xl border border-ww-border bg-warm-white p-5">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-ww-muted">
              My reports
            </p>
            <MyReports
              reports={(ownReports ?? []).map((r) => ({
                id: r.id,
                title: r.title,
                city: r.city,
                severity: r.severity,
                status: r.status,
                rejection_reason: r.rejection_reason ?? null,
                created_at: r.created_at,
                reviewed_at: r.reviewed_at ?? null,
              }))}
            />
          </div>
        )}

        {/* ── Report user (non-owner, logged-in only) ──── */}
        {!isOwner && viewer && (
          <div className="flex justify-end px-1">
            <ReportUserButton
              reportedUserId={profile.id}
              reportedName={displayName}
            />
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
