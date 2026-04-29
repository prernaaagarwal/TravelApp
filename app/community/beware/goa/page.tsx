import { createClient as buildClient } from "@supabase/supabase-js";
import { ScamMapClient, type MapReport } from "./ScamMapClient";

export const metadata = {
  title: "Goa Scam Map — Wander Women",
  description:
    "Live map of scams, harassment hotspots, and safe tips in Goa — reported by solo women travellers.",
};

export default async function GoaScamMapPage() {
  const supabase = buildClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: rows } = await supabase
    .from("beware_reports")
    .select("id,title,category,severity,description,location,reported_by_name,helpful_count,gps_lat,gps_lng,created_at")
    .eq("destination_slug", "goa-india")
    .eq("status", "approved")
    .not("gps_lat", "is", null)
    .order("created_at", { ascending: false });

  const dbReports: MapReport[] = (rows ?? []).map((r) => ({
    id: String(r.id),
    lat: r.gps_lat as number,
    lng: r.gps_lng as number,
    type: normaliseCategory(r.category ?? "scam"),
    title: r.title,
    place: r.location ?? "Goa",
    desc: r.description,
    date: new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    confirms: r.helpful_count ?? 0,
    reporter: r.reported_by_name ?? "Anonymous",
  }));

  return <ScamMapClient dbReports={dbReports} />;
}

function normaliseCategory(raw: string): MapReport["type"] {
  const s = raw.toLowerCase();
  if (s.includes("harass")) return "harassment";
  if (s.includes("transport") || s.includes("taxi") || s.includes("auto") || s.includes("bus")) return "transport";
  if (s.includes("stay") || s.includes("accom") || s.includes("hotel") || s.includes("hostel")) return "stay";
  if (s.includes("safe")) return "safe";
  return "scam";
}
