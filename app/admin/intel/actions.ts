"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!user || !adminEmail || user.email !== adminEmail) {
    throw new Error("Unauthorized");
  }
  return supabase;
}

function parseJson(raw: FormDataEntryValue | null, fallback: unknown = []) {
  if (!raw || typeof raw !== "string" || raw.trim() === "") return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

export async function upsertIntelCard(
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await assertAdmin();

  const slug = (formData.get("slug") as string)?.trim().toLowerCase();
  if (!slug) return { error: "Slug is required" };

  const payload = {
    slug,
    destination:           (formData.get("destination")      as string)?.trim() || null,
    country:               (formData.get("country")          as string)?.trim() || null,
    audience:              (formData.get("audience")         as string) || "both",
    contributor_slug:      (formData.get("contributor_slug") as string)?.trim() || null,
    last_updated:          (formData.get("last_updated")     as string) || null,
    verified_by_count:     parseInt(formData.get("verified_by_count") as string) || 0,
    hero_image_url:        (formData.get("hero_image_url")   as string)?.trim() || null,
    is_premium:            formData.get("is_premium") === "true",
    premium_preview:       (formData.get("premium_preview")  as string)?.trim() || null,
    tldr:                  parseJson(formData.get("tldr"),              []),
    neighborhoods:         parseJson(formData.get("neighborhoods"),     []),
    scams:                 parseJson(formData.get("scams"),             []),
    transport:             parseJson(formData.get("transport"),         []),
    hidden_gems:           parseJson(formData.get("hidden_gems"),       []),
    pre_book_checklist:    parseJson(formData.get("pre_book_checklist"),[]),
    dos_and_donts:         parseJson(formData.get("dos_and_donts"),     { do: [], dont: [] }),
    estimated_daily_budget:parseJson(formData.get("estimated_daily_budget"), {}),
    emergency_numbers:     parseJson(formData.get("emergency_numbers"), []),
    affiliate_links:       parseJson(formData.get("affiliate_links"),   {}),
  };

  const { error } = await supabase.from("intel_cards").upsert(payload, { onConflict: "slug" });
  if (error) return { error: error.message };

  revalidatePath("/explore");
  revalidatePath(`/intel/${slug}`);
  revalidatePath("/admin/intel");
  redirect("/admin/intel");
}

export async function deleteIntelCard(slug: string): Promise<{ error?: string }> {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("intel_cards").delete().eq("slug", slug);
  if (error) return { error: error.message };
  revalidatePath("/explore");
  revalidatePath("/admin/intel");
  return {};
}
