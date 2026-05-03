"use server";

import { createClient } from "@/lib/supabase/server";
import { verifyStaySchema } from "@/lib/schemas";
import { analyzeStay } from "@/lib/claude";

const PLATFORM_MAP: Record<string, string> = {
  "airbnb.com": "airbnb",
  "booking.com": "booking",
  "agoda.com": "agoda",
  "makemytrip.com": "makemytrip",
  "hostelworld.com": "hostelworld",
  "vrbo.com": "vrbo",
  "homeaway.com": "vrbo",
  "hotels.com": "hotels",
  "expedia.com": "expedia",
  "goibibo.com": "goibibo",
};

function detectPlatform(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    for (const [domain, platform] of Object.entries(PLATFORM_MAP)) {
      if (hostname.includes(domain)) return platform;
    }
  } catch {
    // invalid URL handled by schema
  }
  return "unknown";
}

function extractOgMeta(html: string, property: string): string | null {
  const match = html.match(
    new RegExp(`<meta[^>]+property=["']og:${property}["'][^>]+content=["']([^"']+)["']`, "i")
  ) ?? html.match(
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${property}["']`, "i")
  );
  return match?.[1] ?? null;
}

function extractTitle(html: string): string | null {
  return html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? null;
}

async function fetchPageMeta(url: string): Promise<{ propertyName: string | null; ogDescription: string | null }> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; WanderWomenBot/1.0; +https://wanderwomen.in)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { propertyName: null, ogDescription: null };
    const html = await res.text();
    const propertyName = extractOgMeta(html, "title") ?? extractTitle(html);
    const ogDescription = extractOgMeta(html, "description");
    return { propertyName, ogDescription };
  } catch {
    return { propertyName: null, ogDescription: null };
  }
}

export async function submitStayVerification(
  formData: FormData
): Promise<{ error?: string; id?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in to verify a stay." };

  const raw = formData.get("booking_url") as string;
  const result = verifyStaySchema.safeParse({ booking_url: raw?.trim() });
  if (!result.success) return { error: result.error.issues[0].message };

  const { booking_url } = result.data;

  // Check monthly usage limit (free users: 3/month)
  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_tier")
    .eq("id", user.id)
    .single();

  const isPro = profile?.membership_tier === "pro" || profile?.membership_tier === "founding";

  if (!isPro) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("stay_verifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfMonth.toISOString());

    if ((count ?? 0) >= 3) {
      return { error: "You've used your 3 free verifications this month. Upgrade to Pro for unlimited." };
    }
  }

  const platform = detectPlatform(booking_url);

  // Insert the row first so we have an ID to redirect to
  const { data: row, error: insertError } = await supabase
    .from("stay_verifications")
    .insert({
      user_id: user.id,
      booking_url,
      platform,
      status: "analyzing",
    })
    .select("id")
    .single();

  if (insertError || !row) {
    return { error: "Failed to start verification. Please try again." };
  }

  const id = row.id;

  // Fetch page metadata (best-effort, 8s timeout)
  const { propertyName, ogDescription } = await fetchPageMeta(booking_url);

  // Attempt AI analysis
  try {
    const analysis = await analyzeStay({
      url: booking_url,
      platform,
      propertyName,
      city: null,
      ogDescription,
    });

    await supabase
      .from("stay_verifications")
      .update({
        status: "complete",
        risk_level: analysis.risk_level,
        property_name: propertyName,
        analysis_json: analysis,
        completed_at: new Date().toISOString(),
      })
      .eq("id", id);
  } catch {
    await supabase
      .from("stay_verifications")
      .update({ status: "failed" })
      .eq("id", id);
    return { id, error: undefined };
  }

  return { id };
}
