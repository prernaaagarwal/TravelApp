/**
 * Backfills gps_lat / gps_lng on beware_reports rows that have a text
 * `location` but no coordinates yet.
 *
 * Uses Nominatim (OpenStreetMap's free geocoding service). Respects the
 * Nominatim usage policy:
 *   - 1 request per second max (we sleep 1.1s between calls)
 *   - Custom User-Agent header (mandatory)
 *   - Suitable for our scale (a few hundred rows max)
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

interface NominatimResult {
  lat: string;
  lon: string;
  importance?: number;
  class?: string;
  type?: string;
  addresstype?: string;
  display_name?: string;
}

async function geocode(query: string): Promise<NominatimResult | null> {
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
  return json[0];
}

// Reject too-coarse results (countries, states, etc.) — these mean the
// geocoder didn't find the specific landmark and fell back to a region.
const COARSE_TYPES = new Set([
  "country",
  "state",
  "province",
  "region",
  "boundary",
  "continent",
  "country_code",
]);

const MIN_IMPORTANCE = 0.3;

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function main(): Promise<void> {
  console.log(`${dryRun ? "DRY RUN — " : ""}Backfilling beware_reports.gps_lat/gps_lng…\n`);

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
      } else {
        const importance = result.importance ?? 0;
        const type = result.type ?? "";
        const addresstype = result.addresstype ?? "";

        if (importance < MIN_IMPORTANCE) {
          console.log(`  ✗ low confidence (importance=${importance.toFixed(2)})`);
          lowConfidence++;
        } else if (COARSE_TYPES.has(type) || COARSE_TYPES.has(addresstype)) {
          console.log(`  ✗ too coarse (type=${type}, addresstype=${addresstype})`);
          lowConfidence++;
        } else {
          const lat = parseFloat(result.lat);
          const lng = parseFloat(result.lon);
          console.log(
            `  ✓ ${lat.toFixed(5)},${lng.toFixed(5)} (${type}, importance=${importance.toFixed(2)})`,
          );

          if (!dryRun) {
            const { error: updateErr } = await supabase
              .from("beware_reports")
              .update({ gps_lat: lat, gps_lng: lng })
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
      }
    } catch (e) {
      console.warn(`  ⚠ exception: ${(e as Error).message}`);
      errors++;
    }

    // Nominatim policy: max 1 request/second. Sleep 1.1s between calls.
    if (i < rows.length - 1) await sleep(1100);
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
