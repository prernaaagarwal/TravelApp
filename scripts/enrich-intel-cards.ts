import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "lib/mock-data");
const RAW_DIR = path.join(DATA_DIR, "raw");

const CITY_MAP: Record<string, string> = {
  Delhi: "Delhi",
  Agra: "Agra",
  Jaipur: "Jaipur",
  Goa: "Goa",
  Mumbai: "Mumbai",
  Varanasi: "Varanasi",
  Bangalore: "Bangalore",
  Kolkata: "Kolkata",
  Chennai: "Chennai",
  Udaipur: "Udaipur",
  Manali: "Manali",
  Kochi: "Kochi",
  Rishikesh: "Rishikesh",
  Kasol: "Kasol",
  Hampi: "Hampi",
};

// Cities covered by Uber Women-only Bike Rides (launched Dec 2024)
const UBER_WOMEN_CITIES = new Set([
  "Bangalore", "Delhi", "Mumbai", "Kolkata", "Chennai",
]);

function parseINR(val: string): number {
  if (!val) return 0;
  const clean = val.replace(/,/g, "").split(/[–\-]/)[0].replace(/[^\d]/g, "");
  return parseInt(clean, 10) || 0;
}

function severityMap(raw: string): string {
  const s = raw.toUpperCase().trim();
  if (s === "CRITICAL") return "critical";
  if (s === "HIGH") return "high";
  if (s === "MEDIUM" || s === "MODERATE") return "medium";
  return "low";
}

function loadScams(cityName: string) {
  const raw = JSON.parse(
    fs.readFileSync(path.join(RAW_DIR, "india-tourist-scams-top12-cities.json"), "utf8")
  );

  const aliases: Record<string, string[]> = {
    Bangalore: ["bangalore", "bengaluru", "bengaluru/bangalore"],
  };
  const terms = [cityName.toLowerCase(), ...(aliases[cityName] ?? [])];

  // Master Scam List — cross-city scams mentioning this city
  const masterRows: string[][] = raw["Master Scam List"].rows;
  const masterScams = masterRows
    .filter((r) => r[3] && terms.some((t) => r[3].toLowerCase().includes(t)))
    .map((r) => ({
      title: r[1],
      severity: severityMap(r[6] ?? ""),
      where: r[3],
      what: r[4],
      avoid: r[7],
    }));

  // Per-city section — city-specific scam rows (format: [#, Scam, Risk, Description])
  const citySection = raw[cityName];
  const cityScams: typeof masterScams = [];
  if (citySection?.rows) {
    let inData = false;
    for (const r of citySection.rows as string[][]) {
      if (r[0] === "#") { inData = true; continue; }
      if (inData && r[0] && !isNaN(Number(r[0])) && r[1]) {
        cityScams.push({ title: r[1], severity: severityMap(r[2] ?? ""), where: cityName, what: r[3], avoid: r[3] });
      }
      if (inData && r[0] && isNaN(Number(r[0])) && r[0] !== "#") inData = false;
    }
  }

  // City-specific first, then master; deduplicate by title; cap at 8
  const seen = new Set<string>();
  return [...cityScams, ...masterScams].filter((s) => {
    if (seen.has(s.title)) return false;
    seen.add(s.title);
    return true;
  }).slice(0, 8);
}

function loadGems(cityName: string) {
  const raw = JSON.parse(
    fs.readFileSync(path.join(RAW_DIR, "india-hidden-gems-solo-women.json"), "utf8")
  );
  const rows: string[][] = raw["Master Gem List"].rows;
  return rows
    .filter((r) => r[1] === cityName)
    .slice(0, 6)
    .map((r) => ({
      name: r[2],
      type: r[3],
      angle: r[4],
      why: r[5],
      approxCost: r[6],
    }));
}

function loadBudget(cityName: string) {
  const raw = JSON.parse(
    fs.readFileSync(path.join(RAW_DIR, "india-money-hacks-top12-cities.json"), "utf8")
  );
  const rows: string[][] = raw["Daily Budget Templates"].rows;
  const row = rows.find((r) => r[0] === cityName);
  if (!row) return null;
  return {
    backpacker: parseINR(row[1]),
    midRange: parseINR(row[2]),
    comfortable: parseINR(row[3]),
    currency: "INR",
  };
}

// Skip rows with unconfirmed/do-not-list flags
function isConfirmed(notes: string): boolean {
  if (!notes) return true;
  const lower = notes.toLowerCase();
  return !lower.includes("do not list") && !lower.includes("unconfirmed") && !lower.includes("cannot confirm");
}

function loadWomenTransport(cityName: string) {
  const raw = JSON.parse(
    fs.readFileSync(path.join(RAW_DIR, "women-only-travel-services-india-updated-1.json"), "utf8")
  );
  const rows: string[][] = raw["Transport"].rows;

  const services = rows
    .filter((r) => {
      if (!r[0] || r[0] === "Name") return false;
      const cities = (r[1] ?? "").toLowerCase();
      const notes = r[11] ?? "";
      return cities.includes(cityName.toLowerCase()) && isConfirmed(notes);
    })
    .map((r) => ({
      mode: r[0],
      tip: r[6] ?? r[11] ?? "",
      approxCost: r[10] ?? "",
      bookingMethod: r[9] ?? "",
    }));

  // Add Uber Women-only Bike if city is covered
  if (UBER_WOMEN_CITIES.has(cityName)) {
    services.push({
      mode: "Uber Women-only Bike Rides",
      tip: "Book via Uber app. Women-only ride with women drivers. Launched Dec 2024, expanding across major cities.",
      approxCost: "₹50–200",
      bookingMethod: "Uber app",
    });
  }

  return services;
}

function loadSafeStays(cityName: string) {
  const raw = JSON.parse(
    fs.readFileSync(path.join(RAW_DIR, "women-safe-stays-india-updated-1.json"), "utf8")
  );
  const rows: string[][] = raw["Sheet1"].rows;

  // Also include multi-city chains for all cities
  const chains = ["The Hosteller", "Zostel", "Madpackers", "Stops Hostels"];

  return rows
    .filter((r) => {
      if (!r[0] || r[0] === "Name") return false;
      const city = (r[1] ?? "").toLowerCase();
      const isThisCity = city.includes(cityName.toLowerCase());
      const isMultiCity = city.includes("multiple");
      const isChain = chains.some((c) => r[0].includes(c));
      const price = r[10] ?? "";
      const hasPrice = price && !price.toLowerCase().includes("unconfirmed");
      return (isThisCity || (isMultiCity && isChain)) && hasPrice;
    })
    .slice(0, 4)
    .map((r) => ({
      name: r[0],
      type: r[3] ?? "Women-friendly stay",
      angle: r[5] === "Women only" ? "FO — Women Only" : "VS — Verified Safe",
      why: r[11] ?? `${r[4] ?? ""} in ${r[1]}. ${r[5] ?? ""}`.trim(),
      approxCost: r[10] ?? "",
    }));
}

function main() {
  const cardsPath = path.join(DATA_DIR, "intel-cards.json");
  const cards = JSON.parse(fs.readFileSync(cardsPath, "utf8"));

  let enriched = 0;
  const updated = cards.map((card: Record<string, unknown>) => {
    const dest = card.destination as string;
    const excelCity = CITY_MAP[dest];

    if (!excelCity) {
      console.log(`  skip (no city map): ${dest}`);
      return card;
    }

    const scams = loadScams(excelCity);
    const gems = loadGems(excelCity);
    const budget = loadBudget(excelCity);
    const womenTransport = loadWomenTransport(excelCity);
    const safeStays = loadSafeStays(excelCity);

    if (scams.length > 0) card.scams = scams;
    if (budget) card.estimatedDailyBudget = budget;

    // Merge gems + safe stays into hiddenGems (stays appended after gems)
    const allGems = [
      ...gems,
      ...safeStays.map((s) => ({ ...s, _source: "stay" })),
    ].slice(0, 8);
    if (allGems.length > 0) card.hiddenGems = allGems;

    // Prepend women-only transport to existing transport array
    if (womenTransport.length > 0) {
      const existing = (card.transport as unknown[]) ?? [];
      card.transport = [...womenTransport, ...existing].slice(0, 8);
    }

    console.log(
      `  ${dest} — ${scams.length} scams, ${allGems.length} gems+stays, ` +
      `${womenTransport.length} women-transport, budget: ${budget ? "yes" : "no"}`
    );
    enriched++;
    return card;
  });

  fs.writeFileSync(cardsPath, JSON.stringify(updated, null, 2));
  console.log(`\nDone. ${enriched}/${cards.length} cards enriched.`);
}

main();
