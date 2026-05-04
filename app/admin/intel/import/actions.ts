"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { parseImport, type ImportRowError } from "@/lib/intel-import";
import type { IntelCardImport } from "@/lib/intel-card-schema";

// ─── Auth ───────────────────────────────────────────────────────────────
async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!user || !adminEmail || user.email !== adminEmail) {
    throw new Error("Unauthorized");
  }
  return { supabase, adminId: user.id };
}

// ─── Preview ────────────────────────────────────────────────────────────
export type RowStatus = "new" | "update" | "blocked" | "error" | "missing_contributor";

export interface PreviewRow {
  index:    number;
  slug:     string;
  destination: string;
  country:  string;
  status:   RowStatus;
  message?: string;
}

export interface PreviewResult {
  ok:               boolean;
  fatal?:           string;
  rows:             PreviewRow[];
  parseErrors:      ImportRowError[];
  /** The validated cards, parallel to rows of status new/update. */
  importableCards:  IntelCardImport[];
  /** Allow caller to know if anything would actually be written. */
  willCreate:       number;
  willUpdate:       number;
  blocked:          number;
}

export async function previewImport(
  rawJson: string,
  overwrite: boolean
): Promise<PreviewResult> {
  const { supabase } = await assertAdmin();

  const parsed = parseImport(rawJson);

  if (parsed.fatal) {
    return {
      ok:               false,
      fatal:            parsed.fatal,
      rows:             [],
      parseErrors:      [],
      importableCards:  [],
      willCreate:       0,
      willUpdate:       0,
      blocked:          0,
    };
  }

  // Look up which slugs already exist + which contributor_slugs are valid.
  const slugs            = parsed.cards.map((c) => c.slug);
  const contributorSlugs = [...new Set(
    parsed.cards
      .map((c) => c.contributor_slug)
      .filter((s): s is string => typeof s === "string" && s.length > 0)
  )];

  const [{ data: existingRows }, { data: validContribs }] = await Promise.all([
    slugs.length > 0
      ? supabase.from("intel_cards").select("slug").in("slug", slugs)
      : Promise.resolve({ data: [] as { slug: string }[] }),
    contributorSlugs.length > 0
      ? supabase.from("contributors").select("slug").in("slug", contributorSlugs)
      : Promise.resolve({ data: [] as { slug: string }[] }),
  ]);

  const existingSet     = new Set((existingRows     ?? []).map((r) => r.slug as string));
  const validContribSet = new Set((validContribs    ?? []).map((r) => r.slug as string));

  const rows:           PreviewRow[]      = [];
  const importableCards: IntelCardImport[] = [];
  let willCreate = 0;
  let willUpdate = 0;
  let blocked    = 0;

  // First, surface row-level parse errors as "error" rows
  for (const err of parsed.errors) {
    rows.push({
      index:       err.index,
      slug:        err.slug ?? "(no slug)",
      destination: "—",
      country:     "—",
      status:      "error",
      message:     err.message,
    });
  }

  // Then validated cards, with status determined by DB lookup
  parsed.cards.forEach((card, i) => {
    // Cross-validation: contributor_slug must exist
    if (card.contributor_slug && !validContribSet.has(card.contributor_slug)) {
      rows.push({
        index:       i,
        slug:        card.slug,
        destination: card.destination,
        country:     card.country,
        status:      "missing_contributor",
        message:     `contributor_slug "${card.contributor_slug}" does not exist. Create the contributor first or remove this field.`,
      });
      return;
    }

    const exists = existingSet.has(card.slug);
    if (exists && !overwrite) {
      rows.push({
        index:       i,
        slug:        card.slug,
        destination: card.destination,
        country:     card.country,
        status:      "blocked",
        message:     `Slug already exists. Tick "Overwrite existing slugs" to update.`,
      });
      blocked++;
      return;
    }

    rows.push({
      index:       i,
      slug:        card.slug,
      destination: card.destination,
      country:     card.country,
      status:      exists ? "update" : "new",
    });
    importableCards.push(card);
    if (exists) willUpdate++;
    else        willCreate++;
  });

  // Sort: errors first (so admin sees problems on top), then updates, then new
  rows.sort((a, b) => statusRank(a.status) - statusRank(b.status));

  return {
    ok:               parsed.errors.length === 0 && blocked === 0,
    rows,
    parseErrors:      parsed.errors,
    importableCards,
    willCreate,
    willUpdate,
    blocked,
  };
}

function statusRank(s: RowStatus): number {
  return s === "error" ? 0
    : s === "missing_contributor" ? 1
    : s === "blocked" ? 2
    : s === "update"  ? 3
    : 4; // new
}

// ─── Execute ────────────────────────────────────────────────────────────
const CHUNK_SIZE = 25;

export interface ExecuteResult {
  ok:        boolean;
  created:   number;
  updated:   number;
  failed:    number;
  errors:    string[];
}

export async function executeImport(
  cards:     IntelCardImport[],
  overwrite: boolean
): Promise<ExecuteResult> {
  const { supabase, adminId } = await assertAdmin();

  if (cards.length === 0) {
    return { ok: false, created: 0, updated: 0, failed: 0, errors: ["No importable cards in payload."] };
  }

  // Re-check existence at execute time. Defends against another admin
  // creating the same slug between preview and confirm.
  const { data: preExisting } = await supabase
    .from("intel_cards")
    .select("slug")
    .in("slug", cards.map((c) => c.slug));

  const existingSet = new Set((preExisting ?? []).map((r) => r.slug as string));

  // Split into two groups so we can distinguish creates from updates with
  // certainty. In overwrite=false mode, anything that became existing
  // between preview and confirm is silently skipped (and reported in errors).
  const toCreate: IntelCardImport[] = [];
  const toUpdate: IntelCardImport[] = [];
  const skipped:  string[]          = [];

  for (const c of cards) {
    if (existingSet.has(c.slug)) {
      if (overwrite) toUpdate.push(c);
      else           skipped.push(c.slug);
    } else {
      toCreate.push(c);
    }
  }

  let created = 0;
  let updated = 0;
  let failed  = 0;
  const errors: string[] = [];

  if (skipped.length > 0) {
    errors.push(
      `${skipped.length} slug(s) created since preview and skipped because overwrite is off: ${skipped.slice(0, 5).join(", ")}${skipped.length > 5 ? "…" : ""}`
    );
  }

  // Inserts (chunked)
  for (let i = 0; i < toCreate.length; i += CHUNK_SIZE) {
    const chunk = toCreate.slice(i, i + CHUNK_SIZE).map(toDbRow);
    const { error, data } = await supabase.from("intel_cards").insert(chunk).select("slug");
    if (error) {
      failed += chunk.length;
      errors.push(`Insert chunk ${i / CHUNK_SIZE + 1}: ${error.message}`);
    } else {
      created += data?.length ?? 0;
    }
  }

  // Updates (chunked, via upsert with onConflict so we don't have to N+1)
  for (let i = 0; i < toUpdate.length; i += CHUNK_SIZE) {
    const chunk = toUpdate.slice(i, i + CHUNK_SIZE).map(toDbRow);
    const { error, data } = await supabase
      .from("intel_cards")
      .upsert(chunk, { onConflict: "slug" })
      .select("slug");
    if (error) {
      failed += chunk.length;
      errors.push(`Update chunk ${i / CHUNK_SIZE + 1}: ${error.message}`);
    } else {
      updated += data?.length ?? 0;
    }
  }

  // Audit log — one row per actually-written card
  const auditRows = [
    ...toCreate.map((c) => ({
      actor_id:    adminId,
      action:      "import_create",
      target_type: "intel_card",
      target_id:   c.slug,
      reason:      `Bulk import (${overwrite ? "overwrite mode" : "insert-only"})`,
    })),
    ...toUpdate.map((c) => ({
      actor_id:    adminId,
      action:      "import_update",
      target_type: "intel_card",
      target_id:   c.slug,
      reason:      "Bulk import (overwrite mode)",
    })),
  ];

  if (auditRows.length > 0) {
    await supabase.from("moderation_audit_log").insert(auditRows);
  }

  revalidatePath("/admin/intel");
  revalidatePath("/explore");

  return {
    ok:      failed === 0 && skipped.length === 0,
    created,
    updated,
    failed,
    errors,
  };
}

// Map import shape → DB row shape (preserves column names exactly)
function toDbRow(c: IntelCardImport) {
  return {
    slug:                   c.slug,
    destination:            c.destination,
    country:                c.country,
    audience:               c.audience,
    contributor_slug:       c.contributor_slug ?? null,
    last_updated:           c.last_updated,
    hero_image_url:         c.hero_image_url,
    tldr:                   c.tldr,
    neighborhoods:          c.neighborhoods,
    scams:                  c.scams,
    transport:              c.transport,
    hidden_gems:            c.hidden_gems,
    pre_book_checklist:     c.pre_book_checklist,
    dos_and_donts:          c.dos_and_donts,
    estimated_daily_budget: c.estimated_daily_budget ?? null,
    emergency_numbers:      c.emergency_numbers,
    is_premium:             c.is_premium,
    premium_preview:        c.premium_preview ?? null,
    affiliate_links:        c.affiliate_links,
  };
}

// ─── Export ─────────────────────────────────────────────────────────────
export async function exportAllCards(): Promise<string> {
  const { supabase } = await assertAdmin();

  const { data, error } = await supabase
    .from("intel_cards")
    .select(
      "slug,destination,country,audience,contributor_slug,last_updated," +
      "hero_image_url,tldr,neighborhoods,scams,transport,hidden_gems," +
      "pre_book_checklist,dos_and_donts,estimated_daily_budget,emergency_numbers," +
      "is_premium,premium_preview,affiliate_links"
    )
    .order("slug");

  if (error) throw new Error(`Export failed: ${error.message}`);

  return JSON.stringify(data ?? [], null, 2);
}
