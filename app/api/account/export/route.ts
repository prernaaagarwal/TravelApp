import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GDPR Article 20 / DPDPA Section 12 — right to data portability.
// Returns every Supabase row scoped to the signed-in user as one JSON
// blob the user can download. No password hash, no other users' data.
//
// Each named query is best-effort: if a table doesn't exist yet on this
// deployment (some live across pending PRs — community_replies, etc.)
// we return an empty array for that section rather than 500-ing the
// whole export.

const FORMAT_VERSION = 1;

async function safeQuery<T>(promise: PromiseLike<{ data: T[] | null; error: unknown }>): Promise<T[]> {
  try {
    const { data, error } = await promise;
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  // Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // User-scoped tables. Each table queried with the column most likely
  // to hold the user-id FK (varies by schema vintage).
  const [
    savedDestinations,
    notificationPreferences,
    communityPosts,
    communityReplies,
    bewareReports,
    tripSubmissions,
    buddyMatches,
    buddyConnections,
    contributorBadges,
    leadsByEmail,
  ] = await Promise.all([
    safeQuery(supabase.from("saved_destinations").select("*").eq("user_id", user.id)),
    safeQuery(supabase.from("notification_preferences").select("*").eq("user_id", user.id)),
    safeQuery(supabase.from("community_posts").select("*").eq("author_id", user.id)),
    safeQuery(supabase.from("community_replies").select("*").eq("author_id", user.id)),
    safeQuery(supabase.from("beware_reports").select("*").eq("reported_by_id", user.id)),
    safeQuery(supabase.from("trip_submissions").select("*").eq("user_id", user.id)),
    safeQuery(supabase.from("buddy_matches").select("*").eq("user_id", user.id)),
    safeQuery(supabase.from("buddy_connections").select("*").eq("from_user_id", user.id)),
    safeQuery(supabase.from("contributor_badges").select("*").eq("user_id", user.id)),
    user.email
      ? safeQuery(supabase.from("leads").select("*").eq("email", user.email.toLowerCase()))
      : Promise.resolve([]),
  ]);

  const payload = {
    _meta: {
      format_version: FORMAT_VERSION,
      exported_at: new Date().toISOString(),
      exported_for_user_id: user.id,
      notes:
        "All data we hold for your account. We don't include your password " +
        "(stored hashed and never accessible) or other users' content. To " +
        "delete this data, use Settings → Danger Zone → Delete account.",
    },
    auth: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      email_confirmed_at: user.email_confirmed_at,
    },
    profile: profile ?? null,
    saved_destinations:        savedDestinations,
    notification_preferences:  notificationPreferences,
    community_posts:           communityPosts,
    community_replies:         communityReplies,
    beware_reports:            bewareReports,
    trip_submissions:          tripSubmissions,
    buddy_matches:             buddyMatches,
    buddy_connections:         buddyConnections,
    contributor_badges:        contributorBadges,
    leads:                     leadsByEmail,
  };

  const username =
    (profile as { username?: string } | null)?.username?.replace(/[^a-z0-9]/gi, "_") ?? "user";
  const date = new Date().toISOString().slice(0, 10);
  const filename = `wander-women-export-${username}-${date}.json`;

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
