import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TravelProfileForm } from "@/components/account/TravelProfileForm";

const CITY_LABELS: Record<string, string> = {
  "goa-india":         "Goa",
  "delhi-india":       "Delhi",
  "mumbai-india":      "Mumbai",
  "jaipur-india":      "Jaipur",
  "manali-india":      "Manali",
  "rishikesh-india":   "Rishikesh",
  "varanasi-india":    "Varanasi",
  "udaipur-india":     "Udaipur",
  "agra-india":        "Agra",
  "bangalore-india":   "Bangalore",
  "kolkata-india":     "Kolkata",
  "chennai-india":     "Chennai",
  "kochi-india":       "Kochi",
  "kasol-india":       "Kasol",
  "hampi-india":       "Hampi",
  "tokyo-japan":       "Tokyo",
  "bangkok-thailand":  "Bangkok",
  "hanoi-vietnam":     "Hanoi",
  "dubai-uae":         "Dubai",
  "seoul-south-korea": "Seoul",
  "paris-france":      "Paris",
};

export const metadata = {
  title: "My profile — Wander Women",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login?next=/account/profile");
  }

  const [{ data: profile }, { count: bewareReportsCount }, { count: postsCount }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase
        .from("beware_reports")
        .select("id", { count: "exact", head: true })
        .eq("reported_by_id", user.id),
      supabase
        .from("community_posts")
        .select("id", { count: "exact", head: true })
        .eq("author_id", user.id),
    ]);

  const displayName = profile?.first_name ?? user.email?.split("@")[0] ?? "W";
  const initial = displayName[0].toUpperCase();

  const segment = (profile?.segment as {
    destination?: string;
    need?: string;
    tripCount?: string;
    travelPreference?: string;
    travelStyle?: string[];
    citiesVisited?: string[];
    languages?: string[];
  } | null) ?? {};

  const visited = segment.citiesVisited ?? [];
  const styles = segment.travelStyle ?? [];

  return (
    <main className="min-h-screen bg-sand px-4 py-12">
      <div className="mx-auto max-w-lg space-y-4">
        <div className="mb-2 flex items-center justify-between">
          <Link href="/" className="text-sm text-ww-muted hover:text-ink">
            ← Home
          </Link>
          <Link
            href="/account/settings"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted hover:text-ink"
          >
            Settings →
          </Link>
        </div>

        {/* Public identity hero */}
        <div className="bg-warm-white border border-ww-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-rust/20 flex items-center justify-center text-rust text-2xl font-medium shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <h1 className="font-serif text-2xl text-ink truncate">{displayName}</h1>
              {profile?.home_city && (
                <p className="font-mono text-xs text-ww-muted">
                  📍 {profile.home_city}
                </p>
              )}
              {profile?.instagram && (
                <p className="font-mono text-[11px] text-ww-muted mt-0.5">
                  {profile.instagram}
                </p>
              )}
            </div>
          </div>

          {/* Inline tag preview of style + visited */}
          {(styles.length > 0 || visited.length > 0) && (
            <div className="mt-4 space-y-2 border-t border-ww-border pt-4">
              {styles.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">Style</span>
                  {styles.map((s) => (
                    <span key={s} className="rounded-full bg-rust/10 text-rust text-[10px] px-2 py-0.5 font-mono">
                      {s}
                    </span>
                  ))}
                </div>
              )}
              {visited.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ww-muted">Solo&apos;d</span>
                  {visited.slice(0, 8).map((slug) => (
                    <span key={slug} className="rounded-full bg-sage/10 text-sage text-[10px] px-2 py-0.5 font-mono">
                      {CITY_LABELS[slug] ?? slug}
                    </span>
                  ))}
                  {visited.length > 8 && (
                    <span className="font-mono text-[10px] text-ww-muted">+{visited.length - 8}</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Community stats */}
        <div className="bg-warm-white border border-ww-border rounded-xl p-5 shadow-sm">
          <p className="mb-3 text-xs uppercase tracking-wider text-ww-muted">Community</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <Stat label="Posts" value={postsCount ?? 0} />
            <Stat label="Reports filed" value={bewareReportsCount ?? 0} />
            <Stat label="Saved" value={0} hint="Soon" />
          </div>
        </div>

        {/* Editable profile */}
        <TravelProfileForm
          firstName={profile?.first_name ?? ""}
          homeCity={profile?.home_city ?? ""}
          instagram={profile?.instagram ?? ""}
          segment={segment}
        />
      </div>
    </main>
  );
}

function Stat({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="border border-ww-border bg-sand py-3">
      <p className="font-serif text-2xl text-ink">{value}</p>
      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-ww-muted">
        {label}
      </p>
      {hint && (
        <p className="mt-0.5 font-mono text-[9px] text-rust">{hint}</p>
      )}
    </div>
  );
}
