import { notFound } from "next/navigation";
import { createClient as buildClient } from "@supabase/supabase-js";
import { ScamMapClient } from "./ScamMapClient";
import { BEWARE_CITIES, type MapReport } from "@/lib/beware-cities";

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

  const supabase = buildClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: rows } = await supabase
    .from("beware_reports")
    .select("id,title,category,severity,description,location,reported_by_name,helpful_count,gps_lat,gps_lng,created_at")
    .eq("destination_slug", city)
    .eq("status", "approved")
    .not("gps_lat", "is", null)
    .order("created_at", { ascending: false });

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
  }));

  return (
    <ScamMapClient
      citySlug={entry.config.slug}
      cityName={entry.config.name}
      center={entry.config.center}
      zoom={entry.config.zoom}
      demoReports={entry.reports}
      dbReports={dbReports}
    />
  );
}

function normaliseCategory(raw: string): MapReport["type"] {
  const s = raw.toLowerCase();
  if (s.includes("harass")) return "harassment";
  if (s.includes("transport") || s.includes("taxi") || s.includes("auto") || s.includes("bus")) return "transport";
  if (s.includes("stay") || s.includes("accom") || s.includes("hotel") || s.includes("hostel")) return "stay";
  if (s.includes("safe")) return "safe";
  return "scam";
}
