import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

const EXCEL_DIR = path.join(process.cwd(), "excel files");
const DATA_DIR = path.join(process.cwd(), "lib/mock-data");
const RAW_DIR = path.join(DATA_DIR, "raw");

// ── helpers ───────────────────────────────────────────────────────────────────

function severityMap(raw: string): string {
  const s = (raw ?? "").toUpperCase().trim();
  if (s === "CRITICAL") return "critical";
  if (s === "HIGH") return "high";
  if (s === "MEDIUM" || s === "MODERATE") return "medium";
  return "low";
}

function parseUSD(val: string): number {
  if (!val) return 0;
  const clean = String(val).replace(/\$/g, "").replace(/,/g, "").split(/[–\-]/)[0].trim();
  return parseInt(clean, 10) || 0;
}

function getDataRows(sheet: XLSX.WorkSheet): unknown[][] {
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1 });
  const hdrIdx = rows.findIndex((r) => (r as unknown[])[0] === "#");
  if (hdrIdx === -1) return [];
  return (rows.slice(hdrIdx + 1) as unknown[][]).filter(
    (r) => typeof (r as unknown[])[0] === "number" && (r as unknown[])[1]
  );
}

function parseScams(wb: XLSX.WorkBook) {
  const rows = getDataRows(wb.Sheets["Master Scam List"]);
  return rows.map((r) => ({
    title: String(r[1]),
    severity: severityMap(String(r[2] ?? "")),
    where: String(r[3] ?? ""),
    what: String(r[4] ?? ""),
    avoid: String(r[5] ?? ""),
  }));
}

function parseBudget(wb: XLSX.WorkBook, currency: "USD" | "EUR") {
  const rows = XLSX.utils.sheet_to_json<unknown[]>(wb.Sheets["Money Hacks"], { header: 1 });
  const tiers = ["Backpacker", "Mid-range", "Comfortable"];
  const result: Record<string, number | string> = { currency };
  const keys = ["backpacker", "midRange", "comfortable"];
  tiers.forEach((tier, i) => {
    const row = rows.find((r) => String((r as unknown[])[0]).startsWith(tier)) as unknown[] | undefined;
    result[keys[i]] = row ? parseUSD(String(row[1] ?? "0")) : 0;
  });
  return result;
}

function parseWomenSafety(wb: XLSX.WorkBook) {
  const sheet = wb.Sheets["Women's Safety"];
  if (!sheet) return [];
  const rows = getDataRows(sheet);
  return rows
    .filter((r) => r[2] && String(r[2]).toUpperCase() !== "—")
    .map((r) => ({
      title: String(r[1]),
      severity: severityMap(String(r[2] ?? "")),
      where: "Throughout",
      what: String(r[3] ?? ""),
      avoid: String(r[4] ?? ""),
    }));
}

// ── destination definitions ───────────────────────────────────────────────────

interface DestDef {
  file: string;
  slug: string;
  destination: string;
  country: string;
  currency: "USD" | "EUR";
  heroImageUrl: string;
  tldrSummary: string;
  emergencyNumbers: Record<string, string>;
}

const DESTINATIONS: DestDef[] = [
  {
    file: "Japan_Travel_Safety_Money.xlsx",
    slug: "tokyo-japan",
    destination: "Tokyo",
    country: "Japan",
    currency: "USD",
    heroImageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
    tldrSummary: "One of the safest cities on Earth for solo women. Real risks are nightlife touts in Roppongi/Kabukicho and train groping at rush hour. Cash economy — carry yen always.",
    emergencyNumbers: { Police: "110", Ambulance: "119", "Tourist Helpline": "03-3201-3331", "JNTO Hotline": "050-3816-2787" },
  },
  {
    file: "Thailand_Travel_Safety_Money.xlsx",
    slug: "bangkok-thailand",
    destination: "Bangkok",
    country: "Thailand",
    currency: "USD",
    heroImageUrl: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=80",
    tldrSummary: "High-energy city with a well-worn tourist trail. Tuk-tuk gem scams and Grand Palace closure lies are a daily ritual. Ride Grab, not taxis. Dress modestly at temples.",
    emergencyNumbers: { Police: "191", Ambulance: "1669", "Tourist Police": "1155", "Bangkok Helpline": "02-356-0700" },
  },
  {
    file: "Vietnam_Travel_Safety_Money.xlsx",
    slug: "hanoi-vietnam",
    destination: "Hanoi",
    country: "Vietnam",
    currency: "USD",
    heroImageUrl: "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=1200&q=80",
    tldrSummary: "Chaotic and wonderful. Street food scams and motorbike grab-thefts are the main risks. Carry bags on your left (away from traffic). Negotiate fares before getting in anything.",
    emergencyNumbers: { Police: "113", Ambulance: "115", Fire: "114", "Tourist Helpline": "1800-599-920" },
  },
  {
    file: "UAE_Dubai_Travel_Safety_Money.xlsx",
    slug: "dubai-uae",
    destination: "Dubai",
    country: "UAE",
    currency: "USD",
    heroImageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
    tldrSummary: "Extremely safe for solo women but strict laws apply. Dress modestly outside resorts. Public displays of affection are illegal. Only licensed taxis/Careem — never unofficial cabs.",
    emergencyNumbers: { Police: "999", Ambulance: "998", "Dubai Tourism": "800-9999", "Women's Helpline": "800-HOPE (4673)" },
  },
  {
    file: "South_Korea_Travel_Safety_Money.xlsx",
    slug: "seoul-south-korea",
    destination: "Seoul",
    country: "South Korea",
    currency: "USD",
    heroImageUrl: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1200&q=80",
    tldrSummary: "Very safe with world-class transit. Watch for bar overcharging in Itaewon/Hongdae after midnight. T-money card for everything. Download Kakao T for taxis.",
    emergencyNumbers: { Police: "112", Ambulance: "119", "Foreign Helpline": "1330", "Seoul Hotline": "02-120" },
  },
  {
    file: "Europe_Top5_Travel_Safety_Money.xlsx",
    slug: "paris-france",
    destination: "Paris",
    country: "France",
    currency: "EUR",
    heroImageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80",
    tldrSummary: "Beautiful and pickpocket-heavy. 70% of Paris pickpocket victims are women. Metro Line 1 and tourist sites are highest risk. Crossbody bag in front, phone in zipped pocket, always.",
    emergencyNumbers: { Police: "17", Ambulance: "15", Fire: "18", "EU Emergency": "112", "Tourist Police Paris": "+33-1-53-71-53-71" },
  },
];

// ── build intel card ──────────────────────────────────────────────────────────

function buildCard(def: DestDef, wb: XLSX.WorkBook) {
  const scams = parseScams(wb);
  const womenSafety = parseWomenSafety(wb);
  const budget = parseBudget(wb, def.currency);

  // Merge women-specific risks into scams (avoid duplicates by title)
  const scamTitles = new Set(scams.map((s) => s.title));
  const extraRisks = womenSafety.filter((w) => !scamTitles.has(w.title));
  const allScams = [...scams, ...extraRisks].slice(0, 10);

  return {
    slug: def.slug,
    destination: def.destination,
    country: def.country,
    audience: "foreign-women",
    contributorSlug: "ananya-mumbai",
    lastUpdated: "2026-04-28",
    verifiedByCount: 5,
    heroImageUrl: def.heroImageUrl,
    tldr: {
      summary: def.tldrSummary,
      safetyRating: allScams.some((s) => s.severity === "critical") ? "moderate" : "high",
      topTip: allScams[0]?.avoid?.slice(0, 120) ?? "",
    },
    neighborhoods: [],
    scams: allScams,
    transport: [],
    hiddenGems: [],
    preBookChecklist: [],
    dosAndDonts: {},
    estimatedDailyBudget: budget,
    emergencyNumbers: def.emergencyNumbers,
    isPremium: false,
    premiumPreview: null,
    affiliateLinks: {},
  };
}

// ── main ─────────────────────────────────────────────────────────────────────

function main() {
  const cardsPath = path.join(DATA_DIR, "intel-cards.json");
  const existing: { slug: string }[] = JSON.parse(fs.readFileSync(cardsPath, "utf8"));
  const existingSlugs = new Set(existing.map((c) => c.slug));

  const newCards: ReturnType<typeof buildCard>[] = [];

  for (const def of DESTINATIONS) {
    const filePath = path.join(EXCEL_DIR, def.file);
    if (!fs.existsSync(filePath)) {
      console.log(`  SKIP (file not found): ${def.file}`);
      continue;
    }

    const wb = XLSX.readFile(filePath);
    const card = buildCard(def, wb);

    // Save raw JSON
    const rawName = def.file.replace(".xlsx", "").toLowerCase().replace(/_/g, "-") + ".json";
    fs.writeFileSync(
      path.join(RAW_DIR, rawName),
      JSON.stringify({ scams: card.scams, budget: card.estimatedDailyBudget }, null, 2)
    );

    if (existingSlugs.has(def.slug)) {
      // Update existing card's scams + budget only
      const idx = existing.findIndex((c) => c.slug === def.slug);
      Object.assign(existing[idx], {
        scams: card.scams,
        estimatedDailyBudget: card.estimatedDailyBudget,
      });
      console.log(`  updated: ${def.slug} — ${card.scams.length} scams`);
    } else {
      newCards.push(card);
      console.log(`  new: ${def.slug} — ${card.scams.length} scams`);
    }
  }

  const updated = [...existing, ...newCards];
  fs.writeFileSync(cardsPath, JSON.stringify(updated, null, 2));
  console.log(`\nDone. ${newCards.length} new cards, ${DESTINATIONS.length - newCards.length} updated. Total: ${updated.length} cards.`);
}

main();
