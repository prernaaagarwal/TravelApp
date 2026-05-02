// Sourced from intel-cards.json. Update when new international cards ship.

export type CountryEntry = {
  slug: string;
  name: string;
  cities: { slug: string; name: string }[];
};

export const INTERNATIONAL_COUNTRIES: CountryEntry[] = [
  { slug: "japan", name: "Japan", cities: [{ slug: "tokyo-japan", name: "Tokyo" }] },
  { slug: "thailand", name: "Thailand", cities: [{ slug: "bangkok-thailand", name: "Bangkok" }] },
  { slug: "vietnam", name: "Vietnam", cities: [{ slug: "hanoi-vietnam", name: "Hanoi" }] },
  { slug: "uae", name: "UAE", cities: [{ slug: "dubai-uae", name: "Dubai" }] },
  { slug: "south-korea", name: "South Korea", cities: [{ slug: "seoul-south-korea", name: "Seoul" }] },
  { slug: "france", name: "France", cities: [{ slug: "paris-france", name: "Paris" }] },
];

export const INTERNATIONAL_CITY_SLUGS = new Set(
  INTERNATIONAL_COUNTRIES.flatMap((c) => c.cities.map((city) => city.slug))
);
