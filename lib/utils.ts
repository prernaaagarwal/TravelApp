import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const KNOWN_COUNTRY_SUFFIXES = [
  "south-korea",
  "uae",
  "india",
  "japan",
  "thailand",
  "vietnam",
  "france",
  "indonesia",
  "spain",
  "italy",
  "portugal",
  "turkey",
  "greece",
  "morocco",
  "nepal",
  "sri-lanka",
  "bhutan",
  "mexico",
  "peru",
  "usa",
  "uk",
];

export function formatDestinationSlug(slug: string | null | undefined): string {
  if (!slug) return "";
  let city = slug;
  for (const suffix of KNOWN_COUNTRY_SUFFIXES) {
    if (slug.endsWith(`-${suffix}`)) {
      city = slug.slice(0, -1 - suffix.length);
      break;
    }
  }
  return city
    .split("-")
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}
