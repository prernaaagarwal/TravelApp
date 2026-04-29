export type Segment = {
  tripCount?: string;
  travelPreference?: string;
  travelStyle?: string[];
  citiesVisited?: string[];
  languages?: string[];
  destination?: string;
  destinations?: string[];
  need?: string;
  worries?: string[];
  ageGroup?: string;
};

export type Badge = {
  badge_type: string;
  destination_slug: string | null;
  awarded_at: string;
};

export type SavedDestRow = {
  destination_slug: string;
  saved_at: string;
  intel_cards: { destination: string; country: string }[] | null;
};

export type IntelCardRow = {
  slug: string;
  destination: string;
  country: string;
  hero_image_url: string | null;
  last_updated: string | null;
  verified_by_count: number;
};
