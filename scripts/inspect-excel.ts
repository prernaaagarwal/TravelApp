import * as XLSX from "xlsx";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const files = readdirSync(root)
  .filter((f) => f.endsWith(".xlsx") && statSync(join(root, f)).isFile())
  .sort();

for (const file of files) {
  console.log(`\n========== ${file} ==========`);
  const wb = XLSX.readFile(join(root, file));
  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    // Try header on row 2 (Excel files put title banner in row 1)
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
      defval: "",
      range: 1,
    });
    console.log(`\n  --- Sheet: "${sheetName}" (${rows.length} data rows after row-1 banner) ---`);
    if (rows.length === 0) {
      console.log("    (empty)");
      continue;
    }
    const headers = Object.keys(rows[0]);
    console.log(`  Columns: ${headers.join(" | ")}`);
    // Show first 2 sample rows for each sheet
    for (let i = 0; i < Math.min(2, rows.length); i++) {
      console.log(`  Row ${i + 1}:`);
      for (const h of headers) {
        const v = String(rows[i][h] ?? "").slice(0, 200);
        if (v) console.log(`    ${h}: ${v}`);
      }
    }
  }
}
