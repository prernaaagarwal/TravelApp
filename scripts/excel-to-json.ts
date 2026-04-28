/**
 * Excel → raw JSON dump.
 *
 * Reads every .xlsx in the project root and writes one JSON per workbook into
 * /lib/mock-data/raw/. Each sheet is dumped as { headers: string[], rows: any[][] }
 * after stripping the leading title/subtitle rows.
 *
 * The Excel files use a non-standard layout:
 *   Row 1 = title banner
 *   Row 2 = subtitle / one-line description
 *   Row 3 = real column headers
 *   Row 4+ = data
 *
 * We auto-detect the header row by walking down until we find a row where every
 * non-empty cell looks like a header (short, no terminal punctuation, not a sentence).
 * Falls back to row index 2 if heuristics fail.
 */

import * as XLSX from "xlsx";
import { readdirSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join, basename, extname } from "node:path";

const root = process.cwd();
const outDir = join(root, "lib", "mock-data", "raw");
mkdirSync(outDir, { recursive: true });

const files = readdirSync(root)
  .filter((f) => f.endsWith(".xlsx") && statSync(join(root, f)).isFile())
  .sort();

/** A "header-like" cell is short (<= 40 chars), not a full sentence, no terminal period. */
function looksLikeHeader(cell: unknown): boolean {
  if (cell == null || cell === "") return true; // blanks allowed
  const s = String(cell).trim();
  if (!s) return true;
  if (s.length > 60) return false;
  if (/[.!?]\s/.test(s)) return false; // mid-sentence punctuation
  if (s.endsWith(".") && s.length > 30) return false;
  if (s.split(" ").length > 8) return false;
  return true;
}

function detectHeaderRow(matrix: unknown[][]): number {
  // Walk rows 0..5, find first row where most non-empty cells look like headers
  // and the next row has different content (i.e. data, not more banner)
  for (let r = 0; r < Math.min(6, matrix.length); r++) {
    const row = matrix[r] ?? [];
    const nonEmpty = row.filter((c) => c != null && String(c).trim() !== "");
    if (nonEmpty.length === 0) continue;
    const headerLike = nonEmpty.every(looksLikeHeader);
    if (headerLike) return r;
  }
  return Math.min(2, matrix.length - 1);
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sheetToStructured(ws: XLSX.WorkSheet) {
  const matrix = XLSX.utils.sheet_to_json<unknown[]>(ws, {
    header: 1,
    defval: "",
    blankrows: false,
  });
  if (matrix.length === 0) {
    return { titleRow: "", subtitleRow: "", headers: [], rows: [] };
  }
  const headerIdx = detectHeaderRow(matrix);
  const titleRow = matrix[0]
    ? String(
        (matrix[0] as unknown[]).find((c) => c != null && String(c).trim()) ??
          ""
      )
    : "";
  const subtitleRow =
    headerIdx >= 1 && matrix[headerIdx - 1]
      ? String(
          (matrix[headerIdx - 1] as unknown[]).find(
            (c) => c != null && String(c).trim()
          ) ?? ""
        )
      : "";
  const headers = (matrix[headerIdx] as unknown[]).map((c) =>
    String(c ?? "").trim()
  );
  const rows = matrix.slice(headerIdx + 1).map((r) => {
    const arr = r as unknown[];
    return headers.map((_, i) => {
      const v = arr[i];
      if (v == null) return "";
      const s = String(v).trim();
      return s;
    });
  });
  // Drop trailing rows that are entirely empty
  while (rows.length > 0 && rows[rows.length - 1].every((c) => c === "")) {
    rows.pop();
  }
  return { titleRow, subtitleRow, headers, rows };
}

for (const file of files) {
  const wb = XLSX.readFile(join(root, file));
  const out: Record<string, unknown> = {};
  for (const sheetName of wb.SheetNames) {
    out[sheetName] = sheetToStructured(wb.Sheets[sheetName]);
  }
  const stem = slugify(basename(file, extname(file)));
  const outPath = join(outDir, `${stem}.json`);
  writeFileSync(outPath, JSON.stringify(out, null, 2));
  const totalRows = Object.values(out).reduce(
    (s, v) => s + ((v as { rows?: unknown[] }).rows?.length ?? 0),
    0
  );
  console.log(
    `${file} → ${outPath.replace(root + "/", "")} (${
      Object.keys(out).length
    } sheets, ${totalRows} data rows)`
  );
}
