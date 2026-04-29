import rawData from "./beware-cities-data.json";
import { GOA_DEMO_REPORTS } from "./beware-goa-demo";
import { bewareCitiesDataSchema } from "./schemas";

const dataParseResult = bewareCitiesDataSchema.safeParse(rawData);
if (!dataParseResult.success) {
  // Log at startup so bad JSON is caught immediately in dev/CI.
  console.error("[beware-cities] JSON validation failed:", dataParseResult.error.issues);
}
const data = dataParseResult.success ? dataParseResult.data : {};

export type MapReport = {
  id: string;
  lat: number;
  lng: number;
  type: "scam" | "harassment" | "transport" | "stay" | "safe";
  title: string;
  place: string;
  desc: string;
  date: string;
  confirms: number;
  reporter: string;
  isDemo?: boolean;
  isHelpfulByMe?: boolean;
};

export type Neighbourhood = { name: string; lat: number; lng: number };

export type CityConfig = {
  slug: string;
  name: string;
  center: [number, number];
  zoom: number;
  country: string;            // ISO-3166-1 alpha-2
  neighbourhoods: Neighbourhood[];
  boundaryQuery?: string;     // Nominatim q= override when city name is ambiguous
  boundaryOsmId?: string;     // Nominatim lookup by OSM ID (e.g. "R1942586") — highest precision
};

type CityEntry = { config: CityConfig; reports: MapReport[] };

const COUNTRY_BY_SUFFIX: Record<string, string> = {
  // Asia-Pacific
  india: "IN", japan: "JP", thailand: "TH", vietnam: "VN",
  "south-korea": "KR", china: "CN", indonesia: "ID", malaysia: "MY",
  philippines: "PH", singapore: "SG", taiwan: "TW", nepal: "NP",
  "sri-lanka": "LK", cambodia: "KH", myanmar: "MM", laos: "LA",
  bangladesh: "BD", pakistan: "PK", australia: "AU", "new-zealand": "NZ",
  // Middle East
  uae: "AE", israel: "IL", jordan: "JO", turkey: "TR", egypt: "EG",
  qatar: "QA", bahrain: "BH", kuwait: "KW", oman: "OM",
  // Europe
  france: "FR", germany: "DE", spain: "ES", italy: "IT", portugal: "PT",
  "united-kingdom": "GB", uk: "GB", netherlands: "NL", belgium: "BE",
  switzerland: "CH", austria: "AT", greece: "GR", sweden: "SE",
  norway: "NO", denmark: "DK", finland: "FI", poland: "PL",
  "czech-republic": "CZ", hungary: "HU", croatia: "HR",
  // Americas
  usa: "US", mexico: "MX", brazil: "BR", argentina: "AR", colombia: "CO",
  peru: "PE", chile: "CL", canada: "CA",
  // Africa
  morocco: "MA", kenya: "KE", "south-africa": "ZA", ghana: "GH",
  tanzania: "TZ", ethiopia: "ET",
};

function deriveCountry(slug: string): string {
  const suffix = slug.split("-").slice(1).join("-");
  return COUNTRY_BY_SUFFIX[suffix] ?? "IN";
}

// Per-city OSM relation IDs — used instead of name search for precision
// Lookup via: nominatim.openstreetmap.org/lookup?osm_ids=R{id}&polygon_geojson=1
const BOUNDARY_OSM_ID_BY_SLUG: Record<string, string> = {
  "goa-india":          "R1263478",
  "delhi-india":        "R1942586",  // Delhi NCT administrative boundary, excludes Noida/Gurgaon
  // mumbai: R7888990 resolves to Maharashtra state — omitted; using hand-crafted city polygon
  // jaipur: R1278173 resolves to Rajasthan state — omitted; using hand-crafted city polygon
  // Agra: R1278716 is UP state boundary — omitted; using hand-crafted city polygon instead
  // bangalore: R1277806 resolves to Karnataka state — omitted; using hand-crafted city polygon
  // chennai:   R1278274 resolves to large Tamil Nadu area — omitted; using hand-crafted city polygon
  "kolkata-india":      "R1278011",
  // varanasi:  R1278771 resolves to UP state — omitted; using hand-crafted city polygon
  // udaipur:   R1278946 resolves to Rajasthan state — omitted; using hand-crafted city polygon
  // manali:    R1267327 resolves to Himachal Pradesh state — omitted; using hand-crafted city polygon
  // kochi:     R1278721 resolves to Kerala state area — omitted; using hand-crafted city polygon
  // tokyo:     R1543125 resolves to Ogasawara Island (Pacific), not Tokyo city — omitted; using hand-crafted city polygon
  "bangkok-thailand":   "R1809197",
  "hanoi-vietnam":      "R1903588",
  "dubai-uae":          "R3374080",
  "seoul-south-korea":  "R2297418",
  "paris-france":       "R71525",
};

const NEIGHBOURHOODS_BY_SLUG: Record<string, Neighbourhood[]> = {
  "delhi-india": [
    { name: "Paharganj",       lat: 28.6448, lng: 77.2167 },
    { name: "Connaught Place", lat: 28.6315, lng: 77.2167 },
    { name: "Karol Bagh",      lat: 28.6519, lng: 77.1907 },
    { name: "Lajpat Nagar",    lat: 28.5700, lng: 77.2434 },
    { name: "Hauz Khas",       lat: 28.5494, lng: 77.2001 },
    { name: "Old Delhi",       lat: 28.6562, lng: 77.2410 },
  ],
};

const generated: Record<string, CityEntry> = Object.fromEntries(
  Object.entries(data).map(([slug, entry]) => [
    slug,
    {
      config: {
        slug:           entry.config.slug,
        name:           entry.config.name,
        center:         entry.config.center,
        zoom:           entry.config.zoom,
        country:        deriveCountry(entry.config.slug),
        neighbourhoods: NEIGHBOURHOODS_BY_SLUG[entry.config.slug] ?? [],
        ...(BOUNDARY_OSM_ID_BY_SLUG[entry.config.slug] ? { boundaryOsmId: BOUNDARY_OSM_ID_BY_SLUG[entry.config.slug] } : {}),
      },
      reports: entry.reports,
    },
  ])
);

// Goa stays hand-curated (existing demo array preserved)
const goa: CityEntry = {
  config: {
    slug: "goa-india",
    name: "Goa",
    center: [15.5793, 73.8143],
    zoom: 11,
    country: "IN",
    neighbourhoods: NEIGHBOURHOODS_BY_SLUG["goa-india"] ?? [],
    boundaryOsmId: BOUNDARY_OSM_ID_BY_SLUG["goa-india"],
  },
  reports: GOA_DEMO_REPORTS,
};

export const BEWARE_CITIES: Record<string, CityEntry> = {
  "goa-india": goa,
  ...generated,
};

export function normaliseCategory(raw: string): MapReport["type"] {
  const s = raw.toLowerCase();
  if (s.includes("harass")) return "harassment";
  if (s.includes("transport") || s.includes("taxi") || s.includes("auto") || s.includes("bus")) return "transport";
  if (s.includes("stay") || s.includes("accom") || s.includes("hotel") || s.includes("hostel")) return "stay";
  if (s.includes("safe")) return "safe";
  return "scam";
}

export const SUPPORTED_BEWARE_CITIES = new Set(Object.keys(BEWARE_CITIES));
