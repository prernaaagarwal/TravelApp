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

export async function upsertContributor(
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await assertAdmin();

  const slug = (formData.get("slug") as string)?.trim().toLowerCase();
  if (!slug) return { error: "Slug is required" };

  const payload = {
    slug,
    name:                    (formData.get("name")          as string)?.trim() || null,
    full_name:               (formData.get("full_name")     as string)?.trim() || null,
    home_city:               (formData.get("home_city")     as string)?.trim() || null,
    age_range:               (formData.get("age_range")     as string)?.trim() || null,
    tagline:                 (formData.get("tagline")       as string)?.trim() || null,
    bio:                     (formData.get("bio")           as string)?.trim() || null,
    photo_url:               (formData.get("photo_url")     as string)?.trim() || null,
    instagram:               (formData.get("instagram")     as string)?.trim() || null,
    joined_date:             (formData.get("joined_date")   as string) || null,
    trip_count:              parseInt(formData.get("trip_count")              as string) || 0,
    total_contributions:     parseInt(formData.get("total_contributions")     as string) || 0,
    answers_in_community:    parseInt(formData.get("answers_in_community")    as string) || 0,
    earnings_this_month:     parseInt(formData.get("earnings_this_month")     as string) || 0,
    badges:                  parseJson(formData.get("badges"),                []),
    destinations_contributed:parseJson(formData.get("destinations_contributed"), []),
  };

  const { error } = await supabase
    .from("contributors")
    .upsert(payload, { onConflict: "slug" });
  if (error) return { error: error.message };

  revalidatePath("/explore");
  revalidatePath(`/contributor/${slug}`);
  revalidatePath("/admin/contributors");
  redirect("/admin/contributors");
}

export async function deleteContributor(slug: string): Promise<{ error?: string }> {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("contributors").delete().eq("slug", slug);
  if (error) return { error: error.message };
  revalidatePath("/explore");
  revalidatePath("/admin/contributors");
  return {};
}
