import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ScamMapClient } from "./ScamMapClient";
import { BEWARE_CITIES, normaliseCategory, type MapReport } from "@/lib/beware-cities";
import { BewareModerationBanner } from "@/components/community/BewareModerationBanner";

export async function generateStaticParams() {
  return Object.keys(BEWARE_CITIES).map((city) => ({ city }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const entry = BEWARE_CITIES[city];
  if (!entry) return { title: "Not found" };
  return {
    title: `${entry.config.name} Scam Map — Wander Women`,
    description: `Live map of scams, harassment hotspots, and safe tips in ${entry.config.name} — reported by solo women travellers.`,
  };
}

export default async function CityScamMapPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const entry = BEWARE_CITIES[city];
  if (!entry) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: rows } = await supabase
    .from("beware_reports")
    .select("id,title,category,severity,description,location,reported_by_name,helpful_count,gps_lat,gps_lng,created_at")
    .eq("destination_slug", city)
    .eq("status", "approved")
    .not("gps_lat", "is", null)
    .order("created_at", { ascending: false });

  let helpfulIds = new Set<string>();
  if (user) {
    const { data: hp } = await supabase
      .from("beware_helpful")
      .select("report_id")
      .eq("user_id", user.id);
    helpfulIds = new Set((hp ?? []).map((r) => String(r.report_id)));
  }

  const dbReports: MapReport[] = (rows ?? []).map((r) => ({
    id: String(r.id),
    lat: r.gps_lat as number,
    lng: r.gps_lng as number,
    type: normaliseCategory(r.category ?? "scam"),
    title: r.title,
    place: r.location ?? entry.config.name,
    desc: r.description,
    date: new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    confirms: r.helpful_count ?? 0,
    reporter: r.reported_by_name ?? "Anonymous",
    isDemo: false,
    isHelpfulByMe: helpfulIds.has(String(r.id)),
  }));

  const demoReports: MapReport[] = entry.reports.map((r) => ({
    ...r,
    isDemo: true,
    isHelpfulByMe: false,
  }));

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-6">
        <BewareModerationBanner />
      </div>
      <ScamMapClient
        citySlug={entry.config.slug}
        cityName={entry.config.name}
        center={entry.config.center}
        zoom={entry.config.zoom}
        country={entry.config.country}
        boundaryQuery={entry.config.boundaryQuery}
        boundaryOsmId={entry.config.boundaryOsmId}
        neighbourhoods={entry.config.neighbourhoods}
        demoReports={demoReports}
        dbReports={dbReports}
        isLoggedIn={!!user}
      />
    </>
  );
}
