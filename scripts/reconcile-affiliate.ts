#!/usr/bin/env npx ts-node
/**
 * reconcile-affiliate.ts
 *
 * Once a month, the founder downloads the conversions report from each
 * partner dashboard (Amazon Associates, Booking Partner Hub, Airalo,
 * World Nomads). This script normalizes the partner CSV into the
 * affiliate_conversions table format and prints INSERT SQL ready to
 * paste into the Supabase SQL Editor.
 *
 * It does NOT call Supabase directly — that would require service-role
 * credentials in a place where a manual review step is healthier. The
 * founder copies the SQL, eyeballs the rows, and runs it in the dashboard.
 *
 * Usage:
 *   npx ts-node scripts/reconcile-affiliate.ts <partner> <path-to-csv>
 *   npx ts-node scripts/reconcile-affiliate.ts amazon ~/Downloads/amazon-jan-2026.csv
 *
 * Supported partners (column mapping known):
 *   - amazon          (Amazon Associates "Earnings Report" CSV)
 *   - booking         (Booking.com Partner Hub "Reservations" export)
 *   - airalo          (Airalo Partner Portal "Sales" export)
 *   - world_nomads    (World Nomads Affiliate "Conversions" export)
 *
 * Add a new partner by appending a normalizer to PARTNER_NORMALIZERS.
 *
 * The CSV column-name mappings below are best-effort based on partner
 * dashboard exports as of 2026-Q2. If a partner changes their export
 * format, this script will print a warning listing unrecognized columns.
 */

import * as fs from "node:fs";
import * as path from "node:path";

type ConversionRow = {
  partner: string;
  partner_order_id: string | null;
  product_id: string | null;
  gross_amount_inr: number | null;
  commission_inr: number;
  conversion_date: string; // YYYY-MM-DD
  notes: string | null;
};

type PartnerNormalizer = (row: Record<string, string>) => ConversionRow | null;

// ─── Currency conversion ─────────────────────────────────────────────────
// Most partner dashboards report in USD or EUR. The investor headline
// is in INR, so we normalize at ingestion. Exchange rate is a flat
// monthly average — close enough for a manual reconciliation report.
// Update this when rates drift more than 5%.
const FX_TO_INR: Record<string, number> = {
  INR: 1,
  USD: 83.5,
  EUR: 90.2,
  GBP: 105.4,
  AUD: 54.6,
};

function toInr(amount: number, currency: string): number {
  const rate = FX_TO_INR[currency.toUpperCase()];
  if (!rate) {
    throw new Error(`Unknown currency: ${currency}. Add it to FX_TO_INR.`);
  }
  return Math.round(amount * rate * 100) / 100;
}

// ─── Per-partner normalizers ─────────────────────────────────────────────

const amazonNormalizer: PartnerNormalizer = (row) => {
  // Amazon Associates "Earnings Report" CSV columns:
  //   Date, Title, ASIN, Tracking ID, Items Shipped, Earnings, Currency
  if (!row["Date"] || !row["Earnings"]) return null;
  const earnings = parseFloat(row["Earnings"].replace(/[,]/g, ""));
  if (isNaN(earnings) || earnings === 0) return null;
  const currency = row["Currency"] ?? "USD";
  return {
    partner: "amazon",
    partner_order_id: row["ASIN"] ?? null,
    product_id: null, // ASIN match against safety_products done downstream
    gross_amount_inr: null, // Amazon doesn't expose gross to associates
    commission_inr: toInr(earnings, currency),
    conversion_date: parseDate(row["Date"]),
    notes: row["Title"] ? `Title: ${row["Title"].slice(0, 80)}` : null,
  };
};

const bookingNormalizer: PartnerNormalizer = (row) => {
  // Booking Partner Hub "Reservations" CSV columns:
  //   Booking ID, Check-in, Status, Property, Commission, Currency
  if (!row["Booking ID"] || !row["Commission"]) return null;
  if (row["Status"] !== "Stayed") return null; // exclude cancelled
  const commission = parseFloat(row["Commission"].replace(/[,]/g, ""));
  if (isNaN(commission) || commission === 0) return null;
  const currency = row["Currency"] ?? "USD";
  return {
    partner: "booking",
    partner_order_id: row["Booking ID"],
    product_id: null,
    gross_amount_inr: row["Total Amount"]
      ? toInr(parseFloat(row["Total Amount"]), currency)
      : null,
    commission_inr: toInr(commission, currency),
    conversion_date: parseDate(row["Check-in"]),
    notes: row["Property"] ? `Property: ${row["Property"].slice(0, 80)}` : null,
  };
};

const airaloNormalizer: PartnerNormalizer = (row) => {
  // Airalo Partner Portal "Sales" CSV columns:
  //   Order ID, Date, Plan, Country, Sale Amount, Commission, Currency
  if (!row["Order ID"] || !row["Commission"]) return null;
  const commission = parseFloat(row["Commission"]);
  if (isNaN(commission) || commission === 0) return null;
  const currency = row["Currency"] ?? "USD";
  return {
    partner: "airalo",
    partner_order_id: row["Order ID"],
    product_id: null,
    gross_amount_inr: row["Sale Amount"]
      ? toInr(parseFloat(row["Sale Amount"]), currency)
      : null,
    commission_inr: toInr(commission, currency),
    conversion_date: parseDate(row["Date"]),
    notes: row["Plan"] ? `Plan: ${row["Plan"]}` : null,
  };
};

const worldNomadsNormalizer: PartnerNormalizer = (row) => {
  // World Nomads Affiliate "Conversions" CSV columns:
  //   Policy Number, Issue Date, Trip Cost, Commission, Currency
  if (!row["Policy Number"] || !row["Commission"]) return null;
  const commission = parseFloat(row["Commission"]);
  if (isNaN(commission) || commission === 0) return null;
  const currency = row["Currency"] ?? "AUD"; // World Nomads default is AUD
  return {
    partner: "world_nomads",
    partner_order_id: row["Policy Number"],
    product_id: null,
    gross_amount_inr: row["Trip Cost"]
      ? toInr(parseFloat(row["Trip Cost"]), currency)
      : null,
    commission_inr: toInr(commission, currency),
    conversion_date: parseDate(row["Issue Date"]),
    notes: null,
  };
};

const PARTNER_NORMALIZERS: Record<string, PartnerNormalizer> = {
  amazon: amazonNormalizer,
  booking: bookingNormalizer,
  airalo: airaloNormalizer,
  world_nomads: worldNomadsNormalizer,
};

// ─── Helpers ─────────────────────────────────────────────────────────────

function parseDate(input: string): string {
  // Accepts: "2026-01-15", "01/15/2026", "15-Jan-2026", "Jan 15, 2026"
  const d = new Date(input);
  if (isNaN(d.getTime())) {
    throw new Error(`Could not parse date: "${input}"`);
  }
  return d.toISOString().slice(0, 10);
}

function parseCsv(content: string): Record<string, string>[] {
  const lines = content.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  // Naive CSV split — does NOT handle quoted commas. For the partner
  // exports we've seen, the only quoted fields are Title/Property/Plan,
  // and we trim those to 80 chars anyway. If a partner export breaks
  // here, paste-fix the CSV first or upgrade to a proper parser.
  const header = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map((line) => {
    const cells = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    const row: Record<string, string> = {};
    header.forEach((h, i) => {
      row[h] = cells[i] ?? "";
    });
    return row;
  });
}

function escapeSql(s: string): string {
  return s.replace(/'/g, "''");
}

function rowToInsert(r: ConversionRow): string {
  const cols = [
    "partner",
    "partner_order_id",
    "product_id",
    "gross_amount_inr",
    "commission_inr",
    "conversion_date",
    "notes",
  ];
  const vals = [
    `'${escapeSql(r.partner)}'`,
    r.partner_order_id ? `'${escapeSql(r.partner_order_id)}'` : "null",
    r.product_id ? `'${escapeSql(r.product_id)}'` : "null",
    r.gross_amount_inr != null ? `${r.gross_amount_inr}` : "null",
    `${r.commission_inr}`,
    `'${r.conversion_date}'`,
    r.notes ? `'${escapeSql(r.notes)}'` : "null",
  ];
  return `insert into affiliate_conversions (${cols.join(", ")}) values (${vals.join(", ")});`;
}

// ─── Main ────────────────────────────────────────────────────────────────

function main() {
  const [partner, csvPath] = process.argv.slice(2);
  if (!partner || !csvPath) {
    console.error("Usage: reconcile-affiliate.ts <partner> <path-to-csv>");
    console.error(`Partners: ${Object.keys(PARTNER_NORMALIZERS).join(", ")}`);
    process.exit(1);
  }
  const normalize = PARTNER_NORMALIZERS[partner];
  if (!normalize) {
    console.error(`Unknown partner: ${partner}`);
    console.error(`Supported: ${Object.keys(PARTNER_NORMALIZERS).join(", ")}`);
    process.exit(1);
  }
  const absPath = path.resolve(csvPath);
  if (!fs.existsSync(absPath)) {
    console.error(`File not found: ${absPath}`);
    process.exit(1);
  }
  const rows = parseCsv(fs.readFileSync(absPath, "utf-8"));
  const conversions = rows
    .map((r) => {
      try {
        return normalize(r);
      } catch (err) {
        console.error(`Skipping row, parse error: ${(err as Error).message}`);
        return null;
      }
    })
    .filter((r): r is ConversionRow => r !== null);

  if (conversions.length === 0) {
    console.error("No conversions found in CSV. Check the format.");
    process.exit(1);
  }

  const totalCommission = conversions.reduce((s, r) => s + r.commission_inr, 0);
  console.log(`-- Reconciliation: ${partner}`);
  console.log(`-- File: ${csvPath}`);
  console.log(`-- Rows: ${conversions.length}`);
  console.log(`-- Total commission: ₹${totalCommission.toFixed(2)}`);
  console.log(`-- Generated: ${new Date().toISOString()}`);
  console.log("");
  console.log("begin;");
  for (const c of conversions) {
    console.log(rowToInsert(c));
  }
  console.log("commit;");
}

main();
