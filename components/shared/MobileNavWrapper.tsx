import { createClient } from "@/lib/supabase/server";
import { MobileNav } from "./MobileNav";

// Server wrapper — fetches unread count, passes it to the client MobileNav.
// auth.getUser() is memoized per-request by Next.js so this doesn't add an
// extra round-trip on top of what Header already does.
export async function MobileNavWrapper() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let unreadCount = 0;
  if (user) {
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false);
    unreadCount = count ?? 0;
  }

  return <MobileNav unreadCount={unreadCount} />;
}
