import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();

  // Only admins may use this endpoint
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: caller } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (caller?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  if (!q || q.length < 2) {
    return NextResponse.json({ users: [] });
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, first_name, username, role")
    .or(`username.ilike.%${q}%,first_name.ilike.%${q}%`)
    .not("role", "eq", "admin")
    .limit(10);

  const users = (profiles ?? []).map((p) => ({
    id: p.id,
    name: p.first_name ?? p.username ?? "Unknown",
    username: p.username,
    role: p.role ?? "user",
  }));

  return NextResponse.json({ users });
}
