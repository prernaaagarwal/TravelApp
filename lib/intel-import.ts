import { intelCardImportSchema, type IntelCardImport } from "@/lib/intel-card-schema";

export const MAX_CARDS_PER_IMPORT = 100;
export const MAX_PAYLOAD_BYTES    = 5 * 1024 * 1024; // 5 MB

export interface ImportRowError {
  index:  number;          // 0-based position in the input array
  slug:   string | null;   // best-effort slug for display
  message: string;
}

export interface ParseResult {
  ok:      boolean;
  cards:   IntelCardImport[];
  errors:  ImportRowError[];
  /** A top-level message — only set when ok is false AND we couldn't reach row-level parsing. */
  fatal?:  string;
}

/**
 * Parse a JSON string into an array of validated IntelCardImport objects.
 * Returns `ok: false` plus row-level errors if any individual row failed.
 * Top-level errors (invalid JSON, wrong shape, oversize) come back as `fatal`.
 */
export function parseImport(raw: string): ParseResult {
  if (raw.length > MAX_PAYLOAD_BYTES) {
    return { ok: false, cards: [], errors: [], fatal: `Payload too large (max ${MAX_PAYLOAD_BYTES / 1024 / 1024} MB).` };
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (err) {
    return {
      ok: false, cards: [], errors: [],
      fatal: `Invalid JSON: ${err instanceof Error ? err.message : "could not parse"}`,
    };
  }

  if (!Array.isArray(json)) {
    return { ok: false, cards: [], errors: [], fatal: "Top-level value must be a JSON array of intel-card objects." };
  }

  if (json.length === 0) {
    return { ok: false, cards: [], errors: [], fatal: "Array is empty — nothing to import." };
  }

  if (json.length > MAX_CARDS_PER_IMPORT) {
    return {
      ok: false, cards: [], errors: [],
      fatal: `Too many cards (${json.length}). Max ${MAX_CARDS_PER_IMPORT} per batch — split into smaller files.`,
    };
  }

  // Detect duplicate slugs *within the file* itself.
  const seenSlugs    = new Set<string>();
  const duplicateIdx = new Set<number>();
  json.forEach((row, i) => {
    if (row && typeof row === "object" && "slug" in row && typeof (row as { slug: unknown }).slug === "string") {
      const s = (row as { slug: string }).slug;
      if (seenSlugs.has(s)) duplicateIdx.add(i);
      else seenSlugs.add(s);
    }
  });

  const cards:  IntelCardImport[] = [];
  const errors: ImportRowError[]  = [];

  json.forEach((row, i) => {
    const rawSlug = (row as { slug?: unknown })?.slug;
    const slug    = typeof rawSlug === "string" ? rawSlug : null;

    if (duplicateIdx.has(i)) {
      errors.push({ index: i, slug, message: `Duplicate slug "${slug ?? "?"}" earlier in this file.` });
      return;
    }

    const result = intelCardImportSchema.safeParse(row);
    if (!result.success) {
      const issue = result.error.issues[0];
      const path  = issue.path.length > 0 ? issue.path.join(".") + ": " : "";
      errors.push({ index: i, slug, message: path + issue.message });
      return;
    }

    cards.push(result.data);
  });

  return { ok: errors.length === 0, cards, errors };
}
