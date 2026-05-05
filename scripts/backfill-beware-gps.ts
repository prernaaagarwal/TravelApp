/**
 * Backfills gps_lat / gps_lng on beware_reports rows that have a text
 * `location` but no coordinates yet.
 *
 * Geocoder selection (auto):
 *   - GOOGLE_MAPS_API_KEY set in .env.local → Google Geocoding API
 *     (recommended: better quality on fuzzy locations, $200/mo free credit
 *     on every Google Cloud account = 40,000 free requests/month)
 *   - Otherwise → Nominatim (OpenStreetMap, free, no signup, slower)
 *
 * Skips rows whose location is area-level ("city-wide", "online",
 * "all villages...") since those shouldn't appear as map pins anyway —
 * they still surface in the Beware Board feed.
 *
 * Idempotent: only processes rows where gps_lat IS NULL. Safe to re-run
 * after every new seed migration. Run any time, no Claude Code required.
 *
 * Usage:
 *   npx tsx scripts/backfill-beware-gps.ts
 *
 *   # Preview without writing to DB:
 *   npx tsx scripts/backfill-beware-gps.ts --dry-run
 *
 *   # Force a specific provider:
 *   npx tsx scripts/backfill-beware-gps.ts --provider=nominatim
 *   npx tsx scripts/backfill-beware-gps.ts --provider=google
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Make sure .env.local is present and populated.",
  );
  process.exit(1);
}

const dryRun = process.argv.includes("--dry-run");
const supabase = createClient(url, key);

// ─── Provider selection ───────────────────────────────────────────────────────
type Provider = "google" | "nominatim";
const providerFlag = process.argv.find((a) => a.startsWith("--provider="));
const forcedProvider = providerFlag?.split("=")[1] as Provider | undefined;
const googleKey = process.env.GOOGLE_MAPS_API_KEY;

const provider: Provider =
  forcedProvider ?? (googleKey ? "google" : "nominatim");

if (provider === "google" && !googleKey) {
  console.error(
    "Provider 'google' was requested but GOOGLE_MAPS_API_KEY is not set in .env.local.",
  );
  process.exit(1);
}

// ─── Area-level patterns: skip these, never pin them ──────────────────────────
// These describe regions/online/abstract scopes, not pinable points.
const AREA_LEVEL_PATTERNS = [
  /\bcity-wide\b/i,
  /\bonline\b/i,
  /\bdigital\s*\//i,
  /\ball\s+villages\b/i,
  /\ball\s+road\s+(sections|approaches)\b/i,
  /\bvalley-wide\b/i,
  /\ball\s+major\s+road/i,
  /\bapplies\s+to\s+day\s+trips\b/i,
  /\bvarious\s+street/i,
  /^street-level\s+tour\s+operators/i,
  /^budget\s+guesthouses/i,
];

// ─── Destination slug → "City, Country" context for disambiguation ────────────
// Hardcoded so the geocoder has the country hint without us guessing the parser.
const SLUG_CONTEXT: Record<string, string> = {
  "bangkok-thailand": "Bangkok, Thailand",
  "paris-france": "Paris, France",
  "udaipur-india": "Udaipur, India",
  "spiti-valley-india": "Spiti Valley, India",
  "seoul-south-korea": "Seoul, South Korea",
  "varanasi-india": "Varanasi, India",
  "goa-india": "Goa, India",
  "rishikesh-india": "Rishikesh, India",
  "tokyo-japan": "Tokyo, Japan",
  "delhi-india": "Delhi, India",
  "mumbai-india": "Mumbai, India",
  "jaipur-india": "Jaipur, India",
  "agra-india": "Agra, India",
  "bangalore-india": "Bangalore, India",
  "chennai-india": "Chennai, India",
  "kolkata-india": "Kolkata, India",
  "manali-india": "Manali, India",
  "kochi-india": "Kochi, India",
  "hampi-india": "Hampi, India",
  "kasol-india": "Kasol, India",
  "hanoi-vietnam": "Hanoi, Vietnam",
  "dubai-uae": "Dubai, UAE",
};

// Take the first comma-delimited part of the location text — usually the most
// specific landmark. e.g. "Grand Palace entrance, Wat Pho, Wat Arun" → "Grand Palace entrance"
function extractPrimary(location: string): string {
  return location.split(",")[0].trim();
}

function isAreaLevel(location: string): boolean {
  return AREA_LEVEL_PATTERNS.some((p) => p.test(location));
}

// ─── Unified geocoder result ──────────────────────────────────────────────────
interface GeocodeResult {
  lat: number;
  lng: number;
  type: string; // for logging + coarseness check
  confidence: number; // 0-1 normalised across providers
  display: string; // human-readable formatted result
}

// ─── Nominatim provider ───────────────────────────────────────────────────────
interface NominatimResult {
  lat: string;
  lon: string;
  importance?: number;
  type?: string;
  addresstype?: string;
  display_name?: string;
}

async function geocodeNominatim(query: string): Promise<GeocodeResult | null> {
  const u = new URL("https://nominatim.openstreetmap.org/search");
  u.searchParams.set("q", query);
  u.searchParams.set("format", "json");
  u.searchParams.set("limit", "1");
  u.searchParams.set("addressdetails", "1");

  const res = await fetch(u, {
    headers: {
      // Nominatim policy requires a unique, identifiable User-Agent
      "User-Agent": "WanderWomen-BewareGeocoder/1.0 (+https://wanderwomen.in)",
      "Accept-Language": "en",
    },
  });

  if (!res.ok) {
    console.warn(`  ⚠ Nominatim ${res.status}: ${res.statusText}`);
    return null;
  }

  const json = (await res.json()) as NominatimResult[];
  if (!Array.isArray(json) || json.length === 0) return null;

  const r = json[0];
  return {
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
    type: r.type ?? r.addresstype ?? "",
    confidence: r.importance ?? 0,
    display: r.display_name ?? "",
  };
}

// ─── Google provider ──────────────────────────────────────────────────────────
interface GoogleResult {
  geometry: {
    location: { lat: number; lng: number };
    location_type: string; // ROOFTOP | RANGE_INTERPOLATED | GEOMETRIC_CENTER | APPROXIMATE
  };
  formatted_address: string;
  types: string[];
  partial_match?: boolean;
}

interface GoogleResponse {
  status: string; // OK | ZERO_RESULTS | OVER_QUERY_LIMIT | REQUEST_DENIED | INVALID_REQUEST
  results: GoogleResult[];
  error_message?: string;
}

// Map Google's location_type to a 0-1 confidence score
const GOOGLE_LOCATION_TYPE_CONFIDENCE: Record<string, number> = {
  ROOFTOP: 1.0,
  RANGE_INTERPOLATED: 0.75,
  GEOMETRIC_CENTER: 0.6,
  APPROXIMATE: 0.4,
};

async function geocodeGoogle(query: string): Promise<GeocodeResult | null> {
  const u = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  u.searchParams.set("address", query);
  u.searchParams.set("key", googleKey!);

  const res = await fetch(u);
  if (!res.ok) {
    console.warn(`  ⚠ Google ${res.status}: ${res.statusText}`);
    return null;
  }

  const json = (await res.json()) as GoogleResponse;

  if (json.status === "OVER_QUERY_LIMIT" || json.status === "REQUEST_DENIED") {
    console.error(`  ⚠ Google API: ${json.status} — ${json.error_message ?? "(no message)"}`);
    return null;
  }
  if (json.status !== "OK" || json.results.length === 0) return null;

  const r = json.results[0];
  let confidence = GOOGLE_LOCATION_TYPE_CONFIDENCE[r.geometry.location_type] ?? 0.4;
  // Penalise partial matches (Google found something but it's a fuzzy guess)
  if (r.partial_match) confidence *= 0.7;

  // Pick the most specific type (first non-generic)
  const generic = new Set(["political", "geocode"]);
  const primaryType = r.types.find((t) => !generic.has(t)) ?? r.types[0] ?? "";

  return {
    lat: r.geometry.location.lat,
    lng: r.geometry.location.lng,
    type: primaryType,
    confidence,
    display: r.formatted_address,
  };
}

async function geocode(query: string): Promise<GeocodeResult | null> {
  return provider === "google" ? geocodeGoogle(query) : geocodeNominatim(query);
}

// Reject too-coarse results (countries, states, etc.) — these mean the
// geocoder didn't find the specific landmark and fell back to a region.
const COARSE_TYPES = new Set([
  // Nominatim
  "country",
  "state",
  "province",
  "region",
  "boundary",
  "continent",
  "country_code",
  // Google (administrative area types)
  "administrative_area_level_1",
  "administrative_area_level_2",
  "locality", // city-level — usually too coarse for our purpose
]);

const MIN_CONFIDENCE = 0.3;

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function main(): Promise<void> {
  console.log(`${dryRun ? "DRY RUN — " : ""}Backfilling beware_reports.gps_lat/gps_lng…`);
  console.log(`Provider: ${provider}${provider === "nominatim" ? " (set GOOGLE_MAPS_API_KEY for higher quality)" : ""}\n`);

  const { data: rows, error } = await supabase
    .from("beware_reports")
    .select("id, destination_slug, city, location, title")
    .is("gps_lat", null)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch rows:", error.message);
    process.exit(1);
  }

  if (!rows || rows.length === 0) {
    console.log("Nothing to do — all approved beware_reports already have coordinates.");
    return;
  }

  console.log(`Found ${rows.length} rows missing coordinates.\n`);

  let updated = 0;
  let skippedArea = 0;
  let notFound = 0;
  let lowConfidence = 0;
  let errors = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const idShort = String(row.id).slice(0, 8);
    const titleShort = (row.title ?? "").slice(0, 60);
    const prefix = `[${i + 1}/${rows.length}] ${idShort} ${titleShort}`;

    if (!row.location) {
      console.log(`${prefix}\n  ✗ skipped: no location text`);
      skippedArea++;
      continue;
    }

    if (isAreaLevel(row.location)) {
      console.log(`${prefix}\n  ✗ skipped (area-level): "${row.location}"`);
      skippedArea++;
      continue;
    }

    const primary = extractPrimary(row.location);
    const context = SLUG_CONTEXT[row.destination_slug ?? ""] ?? row.city ?? "";
    const query = context ? `${primary}, ${context}` : primary;

    console.log(`${prefix}\n  → "${query}"`);

    try {
      const result = await geocode(query);

      if (!result) {
        console.log(`  ✗ no result`);
        notFound++;
      } else if (result.confidence < MIN_CONFIDENCE) {
        console.log(`  ✗ low confidence (${result.confidence.toFixed(2)})`);
        lowConfidence++;
      } else if (COARSE_TYPES.has(result.type)) {
        console.log(`  ✗ too coarse (type=${result.type})`);
        lowConfidence++;
      } else {
        console.log(
          `  ✓ ${result.lat.toFixed(5)},${result.lng.toFixed(5)} (${result.type}, conf=${result.confidence.toFixed(2)})`,
        );

        if (!dryRun) {
          const { error: updateErr } = await supabase
            .from("beware_reports")
            .update({ gps_lat: result.lat, gps_lng: result.lng })
            .eq("id", row.id);

          if (updateErr) {
            console.warn(`  ⚠ DB update failed: ${updateErr.message}`);
            errors++;
          } else {
            updated++;
          }
        } else {
          updated++; // count as would-be-updated for the dry-run summary
        }
      }
    } catch (e) {
      console.warn(`  ⚠ exception: ${(e as Error).message}`);
      errors++;
    }

    // Nominatim policy is max 1 req/second. Google has no equivalent strict
    // limit (just QPS quotas), so we throttle less aggressively there.
    if (i < rows.length - 1) {
      await sleep(provider === "nominatim" ? 1100 : 100);
    }
  }

  console.log("\n─── Summary ───");
  console.log(`Updated:        ${updated}${dryRun ? " (dry run — no DB writes)" : ""}`);
  console.log(`Skipped area:   ${skippedArea}`);
  console.log(`Not found:      ${notFound}`);
  console.log(`Low confidence: ${lowConfidence}`);
  console.log(`Errors:         ${errors}`);

  if (lowConfidence > 0 || notFound > 0) {
    console.log(
      "\nTip: rows that were skipped/not-found stay with gps_lat=NULL and won't appear " +
        "as map pins — they'll still show in the Beware Board feed. Re-run after editing " +
        "the `location` text for any specific rows you want pinned.",
    );
  }
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
