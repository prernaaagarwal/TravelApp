import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_HOSTS = ["www.amazon.in", "amazon.in", "amzn.in", "www.amazon.com", "amazon.com"];

function isSafeDestination(raw: string): boolean {
  try {
    const url = new URL(raw);
    return url.protocol === "https:" && ALLOWED_HOSTS.includes(url.hostname);
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("id");
  const destination = searchParams.get("url");

  if (!destination || !isSafeDestination(destination)) {
    return NextResponse.json({ error: "Invalid or missing url" }, { status: 400 });
  }

  // fire-and-forget — don't block the redirect on DB write
  if (productId) {
    createClient().then(async (supabase) => {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("affiliate_clicks").insert({
        product_id: productId,
        user_id: user?.id ?? null,
      });
    }).catch(() => {});
  }

  return NextResponse.redirect(destination);
}
