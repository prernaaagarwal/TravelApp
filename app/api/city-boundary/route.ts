import { NextResponse } from "next/server";

// Server-side proxy to OpenStreetMap Nominatim for city boundary GeoJSON.
// 24h fetch cache — Nominatim's fair-use is ≤1 req/sec; we never hit
// it more than once per (city, country, day).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const osmId = searchParams.get("osmId");   // e.g. "R1942586" — precise lookup
  const q = searchParams.get("q");
  const country = searchParams.get("country");

  if (!osmId && (!q || !country)) {
    return NextResponse.json({ geojson: null }, { status: 400 });
  }

  // OSM ID lookup is more precise than name search — use it when available
  const url = osmId
    ? `https://nominatim.openstreetmap.org/lookup?osm_ids=${encodeURIComponent(osmId)}&polygon_geojson=1&format=json`
    : `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q!)}&country=${encodeURIComponent(country!)}&polygon_geojson=1&format=json&limit=1`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "WanderWomen/1.0 (https://wanderwomen.travel)",
        "Accept-Language": "en",
      },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return NextResponse.json({ geojson: null });

    const data = (await res.json()) as Array<{ geojson?: unknown; boundingbox?: string[] }>;
    const first = data[0];
    if (!first?.geojson) return NextResponse.json({ geojson: null });

    return NextResponse.json(
      { geojson: first.geojson, boundingbox: first.boundingbox ?? null },
      { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400" } },
    );
  } catch {
    return NextResponse.json({ geojson: null });
  }
}
