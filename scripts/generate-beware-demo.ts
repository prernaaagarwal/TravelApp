import fs from "fs";
import path from "path";

type MapReport = {
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
};

type CityConfig = {
  slug: string;
  name: string;
  center: [number, number];
  zoom: number;
  landmarks: { name: string; lat: number; lng: number }[];
  safeTips: { title: string; place: string; desc: string }[];
};

const CITIES: CityConfig[] = [
  {
    slug: "delhi-india", name: "Delhi", center: [28.6139, 77.2090], zoom: 12,
    landmarks: [
      { name: "IGI Airport T3",        lat: 28.5562, lng: 77.0998 },
      { name: "Connaught Place",       lat: 28.6315, lng: 77.2167 },
      { name: "Paharganj",             lat: 28.6448, lng: 77.2167 },
      { name: "Karol Bagh",            lat: 28.6519, lng: 77.1909 },
      { name: "Chandni Chowk",         lat: 28.6562, lng: 77.2410 },
      { name: "New Delhi Railway Stn", lat: 28.6431, lng: 77.2197 },
      { name: "Khan Market",           lat: 28.5985, lng: 77.2272 },
      { name: "Hauz Khas",             lat: 28.5494, lng: 77.1925 },
    ],
    safeTips: [
      { title: "Sakha — women-only taxis run by women", place: "All Delhi", desc: "Social enterprise; all-women drivers from marginalised communities. >1M safe rides reported. ₹200–600 city rides. Book via app or call." },
      { title: "Delhi Metro is genuinely safe for solo women", place: "All metro stations", desc: "Women-only first coach. CCTV on all platforms. Late-night service 11pm. Avoid sketchy autos by taking metro to closest station." },
    ],
  },
  {
    slug: "mumbai-india", name: "Mumbai", center: [19.0760, 72.8777], zoom: 12,
    landmarks: [
      { name: "CST Station",         lat: 18.9402, lng: 72.8355 },
      { name: "Colaba Causeway",     lat: 18.9067, lng: 72.8147 },
      { name: "Bandra W",            lat: 19.0596, lng: 72.8295 },
      { name: "Andheri E",           lat: 19.1197, lng: 72.8464 },
      { name: "Juhu Beach",          lat: 19.0883, lng: 72.8264 },
      { name: "Dadar",               lat: 19.0176, lng: 72.8442 },
      { name: "Marine Drive",        lat: 18.9442, lng: 72.8237 },
      { name: "Mumbai Airport T2",   lat: 19.0896, lng: 72.8656 },
    ],
    safeTips: [
      { title: "Mumbai Local women-only compartments", place: "Western/Central/Harbour Line", desc: "First-class ladies coach is the safest way to travel. Off-peak hours quietest. Avoid 8–10am and 5–8pm rush in general compartment." },
      { title: "Priyadarshini Taxi — women-driver service", place: "Greater Mumbai", desc: "Verified women drivers. Pre-book via phone or Uber Women-only Bike Rides via app. ₹150–400 typical city ride." },
    ],
  },
  {
    slug: "jaipur-india", name: "Jaipur", center: [26.9124, 75.7873], zoom: 13,
    landmarks: [
      { name: "Hawa Mahal",            lat: 26.9239, lng: 75.8267 },
      { name: "Amber Fort",            lat: 26.9855, lng: 75.8513 },
      { name: "City Palace",           lat: 26.9258, lng: 75.8235 },
      { name: "Jantar Mantar",         lat: 26.9248, lng: 75.8246 },
      { name: "Jaipur Railway Station",lat: 26.9196, lng: 75.7878 },
      { name: "Bapu Bazaar",           lat: 26.9120, lng: 75.8090 },
      { name: "Johari Bazaar",         lat: 26.9203, lng: 75.8278 },
      { name: "Sindhi Camp Bus Stand", lat: 26.9226, lng: 75.7991 },
    ],
    safeTips: [
      { title: "Pink City Rickshaw Co — women drivers", place: "Old City heritage tours", desc: "Women drivers from low-income backgrounds. Heritage walks + day rentals. ₹400–800/day. Book at official kiosk near Hawa Mahal or call." },
    ],
  },
  {
    slug: "agra-india", name: "Agra", center: [27.1767, 78.0081], zoom: 13,
    landmarks: [
      { name: "Taj Mahal East Gate",  lat: 27.1751, lng: 78.0421 },
      { name: "Agra Fort",            lat: 27.1795, lng: 78.0211 },
      { name: "Sadar Bazaar",         lat: 27.1742, lng: 78.0156 },
      { name: "Agra Cantt Station",   lat: 27.1567, lng: 77.9919 },
      { name: "Fatehabad Road",       lat: 27.1691, lng: 78.0253 },
      { name: "Mehtab Bagh",          lat: 27.1837, lng: 78.0419 },
      { name: "Idgah Bus Stand",      lat: 27.1681, lng: 77.9843 },
      { name: "Kinari Bazaar",        lat: 27.1746, lng: 78.0116 },
    ],
    safeTips: [
      { title: "Buy Taj tickets online at asi.payumoney.com", place: "Online before arrival", desc: "Avoids the 200+ touts at the gate selling fake or marked-up tickets. Foreign tourist ₹1,100, India ₹50. QR scan at gate. Skip the queue too." },
    ],
  },
  {
    slug: "bangalore-india", name: "Bangalore", center: [12.9716, 77.5946], zoom: 12,
    landmarks: [
      { name: "MG Road",            lat: 12.9750, lng: 77.6080 },
      { name: "Brigade Road",       lat: 12.9728, lng: 77.6076 },
      { name: "Indiranagar 100ft",  lat: 12.9716, lng: 77.6411 },
      { name: "Koramangala",        lat: 12.9352, lng: 77.6244 },
      { name: "Majestic Bus Stand", lat: 12.9774, lng: 77.5712 },
      { name: "HSR Layout",         lat: 12.9080, lng: 77.6470 },
      { name: "Whitefield",         lat: 12.9698, lng: 77.7500 },
      { name: "Kempegowda Airport", lat: 13.1986, lng: 77.7066 },
    ],
    safeTips: [
      { title: "Uber Women — women drivers, women riders only", place: "All Bangalore", desc: "Launched Dec 2024. Book via Uber app. Women-only driver matched with women-only rider. ₹50–200 typical. Available 24/7 across the city." },
      { title: "Namma Metro is safe — women-only coach", place: "Purple + Green Line", desc: "First coach reserved for women on every train. CCTV throughout. Stations well-lit and staffed until 11pm. Best way to skip evening traffic safely." },
    ],
  },
  {
    slug: "chennai-india", name: "Chennai", center: [13.0827, 80.2707], zoom: 12,
    landmarks: [
      { name: "Marina Beach",        lat: 13.0500, lng: 80.2820 },
      { name: "Chennai Central",     lat: 13.0827, lng: 80.2750 },
      { name: "T. Nagar",            lat: 13.0418, lng: 80.2341 },
      { name: "Mylapore",            lat: 13.0339, lng: 80.2697 },
      { name: "Kapaleeshwarar Temple", lat: 13.0337, lng: 80.2702 },
      { name: "Chennai Airport",     lat: 12.9941, lng: 80.1709 },
      { name: "Anna Salai",          lat: 13.0604, lng: 80.2598 },
      { name: "Adyar",               lat: 13.0067, lng: 80.2562 },
    ],
    safeTips: [
      { title: "Pre-paid taxi counter at Chennai Airport", place: "Inside arrivals hall", desc: "Government counter inside airport gives fixed rates with receipt. Avoids the touts outside. ₹400–600 to most city locations. Show receipt + driver ID match before getting in." },
      { title: "Chennai Metro — clean, safe, women-friendly", place: "Blue + Green Line", desc: "Women-only first coach. CCTV throughout. Late-night service until 11pm. ₹10–50 fare. Way safer + faster than autos for cross-city trips." },
    ],
  },
  {
    slug: "kolkata-india", name: "Kolkata", center: [22.5726, 88.3639], zoom: 12,
    landmarks: [
      { name: "Howrah Station",      lat: 22.5837, lng: 88.3426 },
      { name: "Park Street",         lat: 22.5523, lng: 88.3525 },
      { name: "New Market",          lat: 22.5618, lng: 88.3525 },
      { name: "Victoria Memorial",   lat: 22.5448, lng: 88.3426 },
      { name: "Kalighat",            lat: 22.5224, lng: 88.3434 },
      { name: "Sudder Street",       lat: 22.5604, lng: 88.3508 },
      { name: "Salt Lake City",      lat: 22.5825, lng: 88.4179 },
      { name: "NSCBI Airport",       lat: 22.6520, lng: 88.4463 },
    ],
    safeTips: [
      { title: "Yellow Ambassador taxis run honest meters", place: "All Kolkata", desc: "The iconic yellow taxis here mostly run meters honestly — better than autos. ₹30 base + ₹15/km. Most drivers are decent and Kolkata is generally safe for solo women in daytime." },
      { title: "Kolkata Metro — oldest, cheapest, safest", place: "Blue + Green Line", desc: "₹5–25 fare across the city. Women-only first coach. Crowded at peak hours but safe. Quickest way to avoid Park Street traffic at evenings." },
    ],
  },
  {
    slug: "varanasi-india", name: "Varanasi", center: [25.3176, 82.9739], zoom: 13,
    landmarks: [
      { name: "Dashashwamedh Ghat",   lat: 25.3076, lng: 83.0103 },
      { name: "Manikarnika Ghat",     lat: 25.3104, lng: 83.0148 },
      { name: "Assi Ghat",            lat: 25.2880, lng: 83.0086 },
      { name: "Kashi Vishwanath",     lat: 25.3109, lng: 83.0107 },
      { name: "Varanasi Junction",    lat: 25.3261, lng: 82.9869 },
      { name: "Sarnath",              lat: 25.3811, lng: 83.0214 },
      { name: "Godowlia Crossing",    lat: 25.3057, lng: 83.0099 },
      { name: "Varanasi Airport",     lat: 25.4524, lng: 82.8593 },
    ],
    safeTips: [
      { title: "Stay near Assi Ghat, not Dashashwamedh", place: "South end of ghats", desc: "Quieter, more solo-women friendly, less hustle. Walk north to main ghats during day. Multiple verified women-friendly guesthouses. Avoid alleys after 10pm — they're confusing." },
    ],
  },
  {
    slug: "udaipur-india", name: "Udaipur", center: [24.5854, 73.7125], zoom: 13,
    landmarks: [
      { name: "City Palace",            lat: 24.5764, lng: 73.6835 },
      { name: "Lake Pichola Ghat",      lat: 24.5765, lng: 73.6800 },
      { name: "Bagore-ki-Haveli",       lat: 24.5797, lng: 73.6817 },
      { name: "Jagdish Temple",         lat: 24.5800, lng: 73.6849 },
      { name: "Udaipur Railway Stn",    lat: 24.5712, lng: 73.6858 },
      { name: "Hathi Pol Bazaar",       lat: 24.5840, lng: 73.6864 },
      { name: "Fateh Sagar Lake",       lat: 24.6017, lng: 73.6823 },
      { name: "Udaipur Airport",        lat: 24.6177, lng: 73.8961 },
    ],
    safeTips: [
      { title: "Udaipur is the safest big tourist city in India", place: "Old city + lake area", desc: "Consistently rated safest big tourist city for solo women. Walking the Old City alone after dark is fine. Locals genuinely helpful, not pushy. Stay near Lake Pichola for best experience." },
    ],
  },
  {
    slug: "manali-india", name: "Manali", center: [32.2396, 77.1887], zoom: 13,
    landmarks: [
      { name: "Mall Road",            lat: 32.2447, lng: 77.1854 },
      { name: "Hadimba Temple",       lat: 32.2497, lng: 77.1764 },
      { name: "Old Manali",           lat: 32.2570, lng: 77.1849 },
      { name: "Vashisht Temple",      lat: 32.2674, lng: 77.1880 },
      { name: "Solang Valley",        lat: 32.3179, lng: 77.1576 },
      { name: "Manali Bus Stand",     lat: 32.2390, lng: 77.1900 },
      { name: "Mall Restaurant Strip",lat: 32.2455, lng: 77.1845 },
      { name: "Vashisht Hot Springs", lat: 32.2674, lng: 77.1880 },
    ],
    safeTips: [
      { title: "Old Manali is the solo-traveller hub", place: "Across the river from Mall Road", desc: "Cafe culture, hostels with solo women travellers, walking-friendly. Way safer than the touristy Mall Road. Stay at Hosteller / Zostel / Madpackers — all women-friendly chains." },
    ],
  },
  {
    slug: "kochi-india", name: "Kochi", center: [9.9312, 76.2673], zoom: 12,
    landmarks: [
      { name: "Fort Kochi",           lat: 9.9647, lng: 76.2391 },
      { name: "Mattancherry Palace",  lat: 9.9583, lng: 76.2580 },
      { name: "Marine Drive Kochi",   lat: 9.9774, lng: 76.2727 },
      { name: "Ernakulam Junction",   lat: 9.9682, lng: 76.2814 },
      { name: "Lulu Mall",            lat: 10.0273, lng: 76.3083 },
      { name: "Cherai Beach",         lat: 10.1417, lng: 76.1819 },
      { name: "Jew Town",             lat: 9.9573, lng: 76.2602 },
      { name: "Kochi Airport",        lat: 10.1556, lng: 76.4019 },
    ],
    safeTips: [
      { title: "Kochi Metro + ferry combo for safe travel", place: "Across Ernakulam + Fort Kochi", desc: "Metro covers Ernakulam side. Public ferry to Fort Kochi from High Court Junction is ₹4 + safe + scenic. Avoids touristy auto overcharging by 5–10x." },
      { title: "Fort Kochi homestays are safest accommodation", place: "Fort Kochi area", desc: "Verified women-friendly homestays in colonial heritage area. Owner-run, walking distance to all sights, ₹1,500–3,500/night. Way better than the mainland hotels for solo women." },
    ],
  },
];

// Map enriched scam severity → MapReport type. Most go to "scam".
// Special cases: title contains harassment/transport/stay keyword.
function inferType(title: string, what: string): MapReport["type"] {
  const t = `${title} ${what}`.toLowerCase();
  if (/harass|grope|stalk|catcall|follow|stare|inappropriate touch/.test(t)) return "harassment";
  if (/taxi|auto|uber|ola|driver|rickshaw|bus|metro|train|airport pickup/.test(t)) return "transport";
  if (/hotel|hostel|guesthouse|booking\.com|airbnb|stay|room|villa/.test(t)) return "stay";
  return "scam";
}

const RECENT_DATES = ["2 days ago", "5 days ago", "1 week ago", "2 weeks ago", "3 days ago", "6 days ago", "4 days ago", "10 days ago"];
const NAMES = ["Ananya M.", "Sara K.", "Riya S.", "Maya R.", "Priya N.", "Devika P.", "Sneha T.", "Anonymous", "Divya K.", "Aisha B."];

function generate() {
  const cardsPath = path.join(process.cwd(), "lib/mock-data/intel-cards.json");
  const cards = JSON.parse(fs.readFileSync(cardsPath, "utf8"));

  const output: Record<string, { config: Omit<CityConfig, "landmarks" | "safeTips">; reports: MapReport[] }> = {};

  for (const city of CITIES) {
    const card = cards.find((c: { slug: string }) => c.slug === city.slug);
    if (!card) {
      console.log(`  skip ${city.slug} — no intel card`);
      continue;
    }

    const scams = (card.scams ?? []) as { title: string; severity: string; what: string; avoid: string }[];
    const reports: MapReport[] = [];

    // Scam pins — rotate through landmarks
    scams.slice(0, 8).forEach((s, i) => {
      const lm = city.landmarks[i % city.landmarks.length];
      const truncTitle = s.title.length > 60 ? s.title.slice(0, 57) + "…" : s.title;
      const desc = s.what.length > 280 ? s.what.slice(0, 277) + "…" : s.what;
      reports.push({
        id: `${city.slug}-s${i}`,
        lat: lm.lat + (Math.random() - 0.5) * 0.004,
        lng: lm.lng + (Math.random() - 0.5) * 0.004,
        type: inferType(s.title, s.what),
        title: truncTitle,
        place: lm.name,
        desc,
        date: RECENT_DATES[i % RECENT_DATES.length],
        confirms: 5 + Math.floor(Math.random() * 35),
        reporter: NAMES[i % NAMES.length],
      });
    });

    // Safe tips at random landmarks
    city.safeTips.forEach((t, i) => {
      const lm = city.landmarks[(scams.length + i) % city.landmarks.length];
      reports.push({
        id: `${city.slug}-safe${i}`,
        lat: lm.lat + (Math.random() - 0.5) * 0.004,
        lng: lm.lng + (Math.random() - 0.5) * 0.004,
        type: "safe",
        title: t.title,
        place: t.place,
        desc: t.desc,
        date: RECENT_DATES[(scams.length + i) % RECENT_DATES.length],
        confirms: 30 + Math.floor(Math.random() * 50),
        reporter: NAMES[(scams.length + i) % NAMES.length],
      });
    });

    output[city.slug] = {
      config: { slug: city.slug, name: city.name, center: city.center, zoom: city.zoom },
      reports,
    };
    console.log(`  ${city.slug} — ${reports.length} reports`);
  }

  const outPath = path.join(process.cwd(), "lib/beware-cities-data.json");
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`\nWrote ${Object.keys(output).length} cities to ${outPath}`);
}

generate();
