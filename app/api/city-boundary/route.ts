import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Boundary data priority:
//   1. Pre-bundled local file in /lib/mock-data/boundaries/{slug}.json  — always fast, no network
//   2. Nominatim live fetch                                              — dev fallback only
const CACHE_HEADER = { "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400" };

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug   = searchParams.get("slug");
  const osmId  = searchParams.get("osmId");
  const q      = searchParams.get("q");
  const country = searchParams.get("country");

  // 1. Try bundled local file first (zero network, works in all environments)
  if (slug) {
    try {
      const filePath = path.join(process.cwd(), "lib", "mock-data", "boundaries", `${slug}.json`);
      const raw = await fs.readFile(filePath, "utf-8");
      const data = JSON.parse(raw) as { geojson?: unknown };
      if (data?.geojson) {
        return NextResponse.json(data, { headers: CACHE_HEADER });
      }
    } catch {
      // File not found for this city — fall through to Nominatim
    }
  }

  // 2. Nominatim fallback (for cities without a bundled boundary file)
  if (!osmId && (!q || !country)) {
    return NextResponse.json({ geojson: null }, { status: 400 });
  }

  const url = osmId
    ? `https://nominatim.openstreetmap.org/lookup?osm_ids=${encodeURIComponent(osmId!)}&polygon_geojson=1&format=json`
    : `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q!)}&country=${encodeURIComponent(country!)}&polygon_geojson=1&format=json&limit=1`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "WanderWomen/1.0 (wanderwomen.travel)",
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
      { headers: CACHE_HEADER },
    );
  } catch {
    return NextResponse.json({ geojson: null });
  }
}
