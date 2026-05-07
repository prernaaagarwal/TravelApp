"use server";

/**
 * Cloud-backed pre-book checklist actions. Backs the PreBookChecklist
 * component for logged-in users; logged-out users still use localStorage.
 *
 * Schema lives in supabase/migrations/050_user_checklists.sql.
 *
 * Wire format: client sends the full integer[] of currently-checked indexes
 * on every update (small, simple). The server upserts into user_checklists
 * keyed on (user_id, destination_slug).
 */

import { createClient } from "@/lib/supabase/server";
import { safeQuery } from "@/lib/safe-query";
import { revalidatePath } from "next/cache";

const SLUG_RE = /^[a-z0-9-]{1,80}$/;

function isValidSlug(slug: unknown): slug is string {
  return typeof slug === "string" && SLUG_RE.test(slug);
}

function sanitiseIndexes(input: unknown, max: number): number[] {
  if (!Array.isArray(input)) return [];
  const out = new Set<number>();
  for (const v of input) {
    if (typeof v === "number" && Number.isInteger(v) && v >= 0 && v < max) {
      out.add(v);
    }
  }
  return [...out].sort((a, b) => a - b);
}

/**
 * Server-side reader used by app/intel/[slug]/page.tsx to hydrate the
 * checklist with the user's saved state. Returns [] for signed-out users
 * or DB timeouts — the component falls through to localStorage in that
 * case (or just renders unchecked).
 */
export async function getChecklistState(slug: string): Promise<{
  checkedIndexes: number[];
  shareToken: string | null;
}> {
  if (!isValidSlug(slug)) return { checkedIndexes: [], shareToken: null };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { checkedIndexes: [], shareToken: null };

  const row = await safeQuery<{ checked_indexes: number[]; share_token: string | null } | null>(
    supabase
      .from("user_checklists")
      .select("checked_indexes, share_token")
      .eq("user_id", user.id)
      .eq("destination_slug", slug)
      .maybeSingle(),
    null,
    1500,
    "checklist.get",
  );

  return {
    checkedIndexes: row?.checked_indexes ?? [],
    shareToken: row?.share_token ?? null,
  };
}

/**
 * Persist the full set of checked indexes for a destination. Upserts the
 * row keyed on (user_id, destination_slug). The `total` arg comes from the
 * client and bounds index validation — anything >= total is dropped.
 */
export async function setChecklistState(
  slug: string,
  checkedIndexes: number[],
  total: number,
): Promise<{ error?: string }> {
  if (!isValidSlug(slug)) return { error: "Bad destination" };
  if (typeof total !== "number" || total < 0 || total > 200) {
    return { error: "Bad total" };
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to save your checklist." };

  const sanitised = sanitiseIndexes(checkedIndexes, total);

  const { error } = await supabase
    .from("user_checklists")
    .upsert(
      {
        user_id: user.id,
        destination_slug: slug,
        checked_indexes: sanitised,
      },
      { onConflict: "user_id,destination_slug" },
    );
  if (error) return { error: "Could not save. Try again." };

  // No revalidation needed — checklist UI lives entirely in a client
  // component that already holds the source-of-truth state.
  return {};
}

/**
 * Create (or return the existing) share token for a user's checklist.
 * Returns the token; the client builds /checklist/{token} from it.
 */
export async function createOrGetShareToken(slug: string): Promise<{
  token?: string;
  error?: string;
}> {
  if (!isValidSlug(slug)) return { error: "Bad destination" };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to share." };

  const existing = await safeQuery<{ share_token: string | null } | null>(
    supabase
      .from("user_checklists")
      .select("share_token")
      .eq("user_id", user.id)
      .eq("destination_slug", slug)
      .maybeSingle(),
    null,
    1500,
    "checklist.shareToken.read",
  );
  if (existing?.share_token) return { token: existing.share_token };

  // 32 hex chars (~128 bits) is plenty for an unguessable share URL.
  const token = randomToken(32);

  // Upsert so a share-before-tick flow still creates the row.
  const { error } = await supabase
    .from("user_checklists")
    .upsert(
      {
        user_id: user.id,
        destination_slug: slug,
        share_token: token,
      },
      { onConflict: "user_id,destination_slug" },
    );
  if (error) return { error: "Could not create share link. Try again." };

  revalidatePath(`/intel/${slug}`);
  return { token };
}

function randomToken(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}
