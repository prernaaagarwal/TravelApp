import data from "./beware-cities-data.json";
import { GOA_DEMO_REPORTS } from "./beware-goa-demo";

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
};

type CityEntry = { config: CityConfig; reports: MapReport[] };

const COUNTRY_BY_SUFFIX: Record<string, string> = {
  india: "IN",
  japan: "JP",
  thailand: "TH",
  vietnam: "VN",
  uae: "AE",
  "south-korea": "KR",
  france: "FR",
};

function deriveCountry(slug: string): string {
  const suffix = slug.split("-").slice(1).join("-");
  return COUNTRY_BY_SUFFIX[suffix] ?? "IN";
}

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

// JSON loses tuple/literal types — narrow at runtime
const generated: Record<string, CityEntry> = Object.fromEntries(
  Object.entries(data as Record<string, { config: { slug: string; name: string; center: number[]; zoom: number }; reports: (Omit<MapReport, "type"> & { type: string })[] }>).map(([slug, entry]) => [
    slug,
    {
      config: {
        slug: entry.config.slug,
        name: entry.config.name,
        center: [entry.config.center[0], entry.config.center[1]] as [number, number],
        zoom: entry.config.zoom,
        country: deriveCountry(entry.config.slug),
        neighbourhoods: NEIGHBOURHOODS_BY_SLUG[entry.config.slug] ?? [],
      },
      reports: entry.reports.map((r) => ({ ...r, type: r.type as MapReport["type"] })),
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
  },
  reports: GOA_DEMO_REPORTS,
};

export const BEWARE_CITIES: Record<string, CityEntry> = {
  "goa-india": goa,
  ...generated,
};

export const SUPPORTED_BEWARE_CITIES = new Set(Object.keys(BEWARE_CITIES));
