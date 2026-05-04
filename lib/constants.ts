export const CITY_LABELS: Record<string, string> = {
  "goa-india": "Goa", "delhi-india": "Delhi", "mumbai-india": "Mumbai",
  "jaipur-india": "Jaipur", "manali-india": "Manali", "rishikesh-india": "Rishikesh",
  "varanasi-india": "Varanasi", "udaipur-india": "Udaipur", "agra-india": "Agra",
  "bangalore-india": "Bangalore", "kolkata-india": "Kolkata", "chennai-india": "Chennai",
  "kochi-india": "Kochi", "kasol-india": "Kasol", "hampi-india": "Hampi",
  "tokyo-japan": "Tokyo", "bangkok-thailand": "Bangkok", "hanoi-vietnam": "Hanoi",
  "dubai-uae": "Dubai", "seoul-south-korea": "Seoul", "paris-france": "Paris",
};

export const WORRY_LABELS: Record<string, string> = {
  scams:       "🎭 Scams",
  harassment:  "🛡️ Harassment",
  transport:   "🚌 Transport",
  health:      "🏥 Health",
  solo_nights: "🌙 Solo nights",
  language:    "💬 Language",
};

export const BADGE_META: Record<string, { icon: string; label: string }> = {
  founding_contributor: { icon: "🌟", label: "Founding Contributor" },
  intel_writer:         { icon: "✍️", label: "Intel Writer" },
  beware_reporter:      { icon: "🛡️", label: "Safety Reporter" },
  community_helper:     { icon: "💬", label: "Community Helper" },
  local_sister:         { icon: "📍", label: "Local Sister" },
};

export const TRIP_LABELS: Record<string, string> = {
  "0": "First solo trip", "1-2": "1–2 trips", "3-5": "3–5 trips", "6+": "6+ trips",
};

export const AGE_OPTIONS: { value: string; label: string }[] = [
  { value: "18-24", label: "18–24" },
  { value: "25-32", label: "25–32" },
  { value: "33-40", label: "33–40" },
  { value: "40+",   label: "40+" },
];
