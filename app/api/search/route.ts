import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { searchAll } from "@/lib/search";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_QUERY_LENGTH = 100;

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";

  if (q.length > MAX_QUERY_LENGTH) {
    return NextResponse.json(
      { error: "Query too long" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const results = await searchAll(supabase, q);

  return NextResponse.json(
    { results },
    {
      headers: {
        // 30s cache for identical queries — search is read-only and a typo or
        // repeated keystroke shouldn't hit Postgres twice in the same window.
        "Cache-Control": "private, max-age=30",
      },
    }
  );
}
