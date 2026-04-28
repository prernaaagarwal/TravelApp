import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "lib/mock-data");
const RAW_DIR = path.join(DATA_DIR, "raw");

// City name in intel-cards → city name in Excel (handle mismatches)
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
};

function parseINR(val: string): number {
  if (!val) return 0;
  // Take the lower bound of ranges like "2,500–3,500" or "2,500-3,500"
  const clean = val.replace(/,/g, "").split(/[–-]/)[0].replace(/[^\d]/g, "");
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
  const rows: string[][] = raw["Master Scam List"].rows;
  return rows
    .filter((r) => r[3] && r[3].toLowerCase().includes(cityName.toLowerCase()))
    .slice(0, 8) // cap at 8 per city
    .map((r) => ({
      title: r[1],
      severity: severityMap(r[6] ?? ""),
      where: r[3],
      what: r[4],
      avoid: r[7],
    }));
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

function main() {
  const cardsPath = path.join(DATA_DIR, "intel-cards.json");
  const cards = JSON.parse(fs.readFileSync(cardsPath, "utf8"));

  let enriched = 0;
  const updated = cards.map((card: Record<string, unknown>) => {
    const dest = card.destination as string;
    const excelCity = CITY_MAP[dest];

    if (!excelCity) {
      console.log(`  skip (no Excel data): ${dest}`);
      return card;
    }

    const scams = loadScams(excelCity);
    const gems = loadGems(excelCity);
    const budget = loadBudget(excelCity);

    if (scams.length > 0) card.scams = scams;
    if (gems.length > 0) card.hiddenGems = gems;
    if (budget) card.estimatedDailyBudget = budget;

    console.log(
      `  enriched: ${dest} — ${scams.length} scams, ${gems.length} gems, budget: ${budget ? "yes" : "no"}`
    );
    enriched++;
    return card;
  });

  fs.writeFileSync(cardsPath, JSON.stringify(updated, null, 2));
  console.log(`\nDone. ${enriched}/${cards.length} cards enriched.`);
}

main();
