import { NextResponse, type NextRequest } from "next/server";
import { createHash } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Salt the fingerprint with a stable server-only secret so two independent
// attackers can't pre-compute hashes of likely IPs to identify viewers.
// Prefer a dedicated FINGERPRINT_SALT; fall back to UNSUBSCRIBE_SECRET (which
// is already required for HMAC tokens) so a single env var covers both. If
// neither is set, skip the anonymous fingerprint entirely — degrading view
// dedup is far better than burning a hardcoded literal salt into source.
const FP_SALT = env.FINGERPRINT_SALT ?? env.UNSUBSCRIBE_SECRET ?? null;
const SLUG_RE = /^[a-z0-9-]{2,80}$/;

export async function POST(req: NextRequest) {
  let slug: string;
  try {
    const body = (await req.json()) as { slug?: unknown };
    if (typeof body.slug !== "string" || !SLUG_RE.test(body.slug)) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }
    slug = body.slug;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let fingerprint: string | null = null;
  if (!user && FP_SALT) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      ?? req.headers.get("x-real-ip")
      ?? "0.0.0.0";
    const ua = req.headers.get("user-agent") ?? "unknown";
    fingerprint = createHash("sha256")
      .update(`${ip}|${ua}|${FP_SALT}`)
      .digest("hex")
      .slice(0, 32);
  }

  await supabase.rpc("record_intel_view", {
    p_slug:        slug,
    p_viewer_id:   user?.id ?? null,
    p_fingerprint: fingerprint,
  });

  return NextResponse.json({ recorded: true });
}
