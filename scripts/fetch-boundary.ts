/**
 * fetch-boundary.ts
 *
 * Pre-fetches a city boundary from Nominatim and saves it as a local JSON
 * file so the beware map loads instantly without a runtime API call.
 *
 * Usage:
 *   npx ts-node scripts/fetch-boundary.ts <city-slug>
 *   npx ts-node scripts/fetch-boundary.ts barcelona-spain
 *
 * The slug must already exist in lib/beware-cities-data.json.
 * Optionally add its OSM relation ID to BOUNDARY_OSM_ID_BY_SLUG in
 * lib/beware-cities.ts first for maximum precision.
 */

import fs from "fs";
import path from "path";
import https from "https";

// Inline the config we need so this script runs without Next.js context
const BOUNDARY_OSM_ID_BY_SLUG: Record<string, string> = {
  "goa-india":          "R1263478",
  "delhi-india":        "R1942586",
  "mumbai-india":       "R7888990",
  "jaipur-india":       "R1278173",
  "agra-india":         "R1278716",
  "bangalore-india":    "R1277806",
  "chennai-india":      "R1278274",
  "kolkata-india":      "R1278011",
  "varanasi-india":     "R1278771",
  "udaipur-india":      "R1278946",
  "manali-india":       "R1267327",
  "kochi-india":        "R1278721",
  "tokyo-japan":        "R1543125",
  "bangkok-thailand":   "R1809197",
  "hanoi-vietnam":      "R1903588",
  "dubai-uae":          "R3374080",
  "seoul-south-korea":  "R2297418",
  "paris-france":       "R71525",
};

const COUNTRY_BY_SUFFIX: Record<string, string> = {
  india: "IN", japan: "JP", thailand: "TH", vietnam: "VN",
  "south-korea": "KR", china: "CN", indonesia: "ID", malaysia: "MY",
  philippines: "PH", singapore: "SG", taiwan: "TW", nepal: "NP",
  "sri-lanka": "LK", cambodia: "KH", myanmar: "MM", laos: "LA",
  bangladesh: "BD", pakistan: "PK", australia: "AU", "new-zealand": "NZ",
  uae: "AE", israel: "IL", jordan: "JO", turkey: "TR", egypt: "EG",
  qatar: "QA", bahrain: "BH", kuwait: "KW", oman: "OM",
  france: "FR", germany: "DE", spain: "ES", italy: "IT", portugal: "PT",
  "united-kingdom": "GB", uk: "GB", netherlands: "NL", belgium: "BE",
  switzerland: "CH", austria: "AT", greece: "GR", sweden: "SE",
  norway: "NO", denmark: "DK", finland: "FI", poland: "PL",
  "czech-republic": "CZ", hungary: "HU", croatia: "HR",
  usa: "US", mexico: "MX", brazil: "BR", argentina: "AR", colombia: "CO",
  peru: "PE", chile: "CL", canada: "CA",
  morocco: "MA", kenya: "KE", "south-africa": "ZA", ghana: "GH",
  tanzania: "TZ", ethiopia: "ET",
};

function deriveCountry(slug: string): string {
  const suffix = slug.split("-").slice(1).join("-");
  return COUNTRY_BY_SUFFIX[suffix] ?? "";
}

function deriveCityName(slug: string): string {
  return slug.split("-")[0].replace(/^./, (c) => c.toUpperCase());
}

function decimateRing(ring: number[][], target = 800): number[][] {
  if (ring.length <= target) return ring;
  const step = Math.ceil(ring.length / target);
  const dec = ring.filter((_, i) => i % step === 0);
  if (dec[0][0] !== dec[dec.length - 1][0] || dec[0][1] !== dec[dec.length - 1][1]) {
    dec.push(dec[0]);
  }
  return dec;
}

function decimateGeom(geom: { type: string; coordinates: unknown }): void {
  if (geom.type === "Polygon") {
    (geom as { type: string; coordinates: number[][][] }).coordinates =
      (geom as { type: string; coordinates: number[][][] }).coordinates.map((r) =>
        decimateRing(r)
      );
  } else if (geom.type === "MultiPolygon") {
    (geom as { type: string; coordinates: number[][][][] }).coordinates =
      (geom as { type: string; coordinates: number[][][][] }).coordinates.map((poly) =>
        poly.map((r) => decimateRing(r))
      );
  }
}

function countPoints(geom: { type: string; coordinates: unknown }): number {
  if (geom.type === "Polygon") {
    return ((geom as { type: string; coordinates: number[][][] }).coordinates[0] ?? []).length;
  }
  if (geom.type === "MultiPolygon") {
    return (geom as { type: string; coordinates: number[][][][] }).coordinates.reduce(
      (sum, poly) => sum + (poly[0]?.length ?? 0),
      0
    );
  }
  return 0;
}

function fetchJson(url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "WanderWomen/1.0 (wanderwomen.travel)", "Accept-Language": "en" } }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} from ${url}`));
        return;
      }
      let body = "";
      res.on("data", (chunk: string) => (body += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
      });
    }).on("error", reject);
  });
}

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error("Usage: npx ts-node scripts/fetch-boundary.ts <city-slug>");
    console.error("Example: npx ts-node scripts/fetch-boundary.ts barcelona-spain");
    process.exit(1);
  }

  const osmId = BOUNDARY_OSM_ID_BY_SLUG[slug];
  const country = deriveCountry(slug);
  const cityName = deriveCityName(slug);

  let url: string;
  if (osmId) {
    url = `https://nominatim.openstreetmap.org/lookup?osm_ids=${encodeURIComponent(osmId)}&polygon_geojson=1&format=json`;
    console.log(`Fetching boundary for "${slug}" via OSM ID ${osmId}…`);
  } else if (country) {
    url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&country=${encodeURIComponent(country)}&polygon_geojson=1&format=json&limit=1`;
    console.log(`Fetching boundary for "${slug}" via name search (${cityName}, ${country})…`);
    console.log("Tip: add an OSM relation ID to BOUNDARY_OSM_ID_BY_SLUG for a more precise result.");
  } else {
    console.error(`Cannot derive country code for slug "${slug}".`);
    console.error(`Add the suffix to COUNTRY_BY_SUFFIX in lib/beware-cities.ts first.`);
    process.exit(1);
  }

  let data: unknown;
  try {
    data = await fetchJson(url);
  } catch (err) {
    console.error("Network error:", err);
    process.exit(1);
  }

  const results = Array.isArray(data) ? data : [data];
  const first = results[0] as { geojson?: { type: string; coordinates: unknown } } | undefined;
  if (!first?.geojson) {
    console.error(`No boundary polygon returned by Nominatim for "${slug}".`);
    console.error("Try adding/correcting the OSM relation ID in BOUNDARY_OSM_ID_BY_SLUG.");
    process.exit(1);
  }

  const geom = first.geojson;
  const ptsBefore = countPoints(geom);
  if (ptsBefore > 2000) {
    console.log(`  ${ptsBefore} points — decimating to ≤ 800 per ring…`);
    decimateGeom(geom);
  }
  const ptsAfter = countPoints(geom);

  const outDir = path.join(process.cwd(), "lib", "mock-data", "boundaries");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${slug}.json`);
  fs.writeFileSync(outPath, JSON.stringify({ geojson: geom }, null, 0));

  const kb = Math.round(fs.statSync(outPath).size / 1024);
  console.log(`✓ Saved: lib/mock-data/boundaries/${slug}.json`);
  console.log(`  Type: ${geom.type} | Points: ${ptsBefore} → ${ptsAfter} | Size: ${kb}KB`);
  console.log("");
  console.log("Next steps:");
  console.log(`  git add lib/mock-data/boundaries/${slug}.json`);
  console.log(`  git commit -m "data: add boundary for ${slug}"`);
  console.log(`  git push origin main`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
