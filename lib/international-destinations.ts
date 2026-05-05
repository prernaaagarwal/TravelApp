// Sourced from intel-cards.json. Update when new international cards ship.

export type CountryEntry = {
  slug: string;
  name: string;
  cities: { slug: string; name: string }[];
};

export const INTERNATIONAL_COUNTRIES: CountryEntry[] = [
  { slug: "indonesia", name: "Indonesia", cities: [{ slug: "bali-indonesia", name: "Bali" }] },
  { slug: "japan", name: "Japan", cities: [{ slug: "tokyo-japan", name: "Tokyo" }] },
  {
    slug: "thailand",
    name: "Thailand",
    cities: [
      { slug: "bangkok-thailand", name: "Bangkok" },
      { slug: "chiang-mai-thailand", name: "Chiang Mai" },
    ],
  },
  { slug: "vietnam", name: "Vietnam", cities: [{ slug: "hanoi-vietnam", name: "Hanoi" }] },
  { slug: "uae", name: "UAE", cities: [{ slug: "dubai-uae", name: "Dubai" }] },
  { slug: "south-korea", name: "South Korea", cities: [{ slug: "seoul-south-korea", name: "Seoul" }] },
  { slug: "france", name: "France", cities: [{ slug: "paris-france", name: "Paris" }] },
  { slug: "portugal", name: "Portugal", cities: [{ slug: "lisbon-portugal", name: "Lisbon" }] },
];

export const INTERNATIONAL_CITY_SLUGS = new Set(
  INTERNATIONAL_COUNTRIES.flatMap((c) => c.cities.map((city) => city.slug))
);
