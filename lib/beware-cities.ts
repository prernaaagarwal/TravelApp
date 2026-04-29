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

export type CityConfig = {
  slug: string;
  name: string;
  center: [number, number];
  zoom: number;
};

type CityEntry = { config: CityConfig; reports: MapReport[] };

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
      },
      reports: entry.reports.map((r) => ({ ...r, type: r.type as MapReport["type"] })),
    },
  ])
);

// Goa stays hand-curated (existing demo array preserved)
const goa: CityEntry = {
  config: { slug: "goa-india", name: "Goa", center: [15.5793, 73.8143], zoom: 11 },
  reports: GOA_DEMO_REPORTS,
};

export const BEWARE_CITIES: Record<string, CityEntry> = {
  "goa-india": goa,
  ...generated,
};

export const SUPPORTED_BEWARE_CITIES = new Set(Object.keys(BEWARE_CITIES));
