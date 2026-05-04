// A minimal-but-complete sample so admins can see the expected shape
// and edit instead of authoring from scratch. Two cards: one rich,
// one minimal — together they document every field.
const SAMPLE = [
  {
    slug:             "example-rich-city",
    destination:      "Example City",
    country:          "Examplandia",
    audience:         "both",
    contributor_slug: null,
    last_updated:     "2026-01-15",
    hero_image_url:   "https://images.unsplash.com/photo-example.jpg",
    tldr: {
      summary:      "Two-line plain-English overview of the destination for a solo woman.",
      safetyRating: "moderate",
      topTip:       "The single most important thing to know.",
    },
    neighborhoods: [
      {
        name:         "Old Town",
        safetyRating: 8,
        vibe:         "Walkable, lots of cafes, lively until midnight",
        notes:        "Touristy in the day, locals after 10pm. Avoid the alley behind the cathedral after dark.",
        stayHere:     "Best base for first-timers. Hostels around 1500 INR, mid-range hotels 4000+.",
      },
    ],
    scams: [
      {
        title:    "Fake taxi from airport",
        severity: "high",
        where:    "Outside arrivals, drivers approach with 'special rate'",
        what:     "Quote 4x the meter rate, no receipt, route deviation",
        avoid:    "Use the prepaid taxi counter inside the terminal. Insist on the meter.",
      },
    ],
    transport: [
      {
        mode:       "Metro",
        tip:        "Buy a 7-day card for ~₹400 — covers all lines",
        approxCost: "₹40 single ride",
      },
    ],
    hidden_gems: [
      {
        name:       "Local tea house in Old Town",
        why:        "Run by a family for 60 years, no menu — they bring what's fresh",
        type:       "food",
        angle:      "Ask for the chai-with-pakora set, not the tourist set",
        approxCost: "₹250 for a full meal",
      },
    ],
    pre_book_checklist: [
      "Hostel booking confirmed",
      "Travel insurance covering medical evacuation",
      "Offline map downloaded",
      "Local emergency numbers saved",
    ],
    dos_and_donts: {
      do:   ["Carry small change", "Walk on the inside of the pavement"],
      dont: ["Take photos near military sites", "Accept drinks from strangers"],
    },
    estimated_daily_budget: {
      backpacker:  1500,
      midRange:    3500,
      comfortable: 7000,
      currency:    "INR",
    },
    emergency_numbers: [
      { label: "Police",     number: "100" },
      { label: "Ambulance",  number: "108" },
      { label: "Women's helpline", number: "1091" },
    ],
    is_premium: false,
    affiliate_links: {
      booking: "https://www.booking.com/example.html",
    },
  },
  {
    slug:             "example-minimal-city",
    destination:      "Minimal City",
    country:          "Examplandia",
    audience:         "both",
    last_updated:     "2026-01-15",
    hero_image_url:   "/images/intel/example-minimal-city.jpg",
    tldr: {
      summary: "Bare-minimum entry — only required fields.",
    },
    neighborhoods:      [],
    scams:              [],
    transport:          [],
    hidden_gems:        [],
    pre_book_checklist: [],
    dos_and_donts:      { do: [], dont: [] },
    emergency_numbers:  [],
    is_premium:         false,
    affiliate_links:    {},
  },
];

export const TEMPLATE_JSON = JSON.stringify(SAMPLE, null, 2);
