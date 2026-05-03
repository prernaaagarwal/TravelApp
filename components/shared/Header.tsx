import Link from "next/link";
import { Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

import { NotificationBell } from "@/components/shared/NotificationBell";
import { NAV_ITEMS } from "@/lib/nav";

type NavItem = { href: string; label: string; authOnly?: boolean };

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profileSlug: string | null = null;
  let initial = "W";
  let isModerator = false;
  let unreadCount = 0;
  let notifications: {
    id: string; type: string; title: string; body: string;
    read: boolean; related_report_id: string | null; created_at: string;
  }[] = [];

  if (user) {
    const [{ data: profile }, { data: notifs }] = await Promise.all([
      supabase
        .from("profiles")
        .select("username, first_name, role")
        .eq("id", user.id)
        .single(),
      supabase
        .from("notifications")
        .select("id, type, title, body, read, related_report_id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    profileSlug = profile?.username ?? user.id;
    const name = profile?.first_name ?? user.email ?? "W";
    initial = name[0].toUpperCase();
    isModerator = ["moderator", "admin"].includes(profile?.role ?? "");
    notifications = notifs ?? [];
    unreadCount = notifications.filter((n) => !n.read).length;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ww-border/60 bg-sand/85 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="font-serif text-xl tracking-tight text-ink hover:text-rust"
        >
          Wander Women
        </Link>

        <nav className="hidden gap-6 md:flex">
          {NAV_ITEMS.filter((item: NavItem) => !item.authOnly || user).map((item: NavItem) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm uppercase tracking-wider text-ww-muted transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {isModerator && (
                <Link
                  href="/admin"
                  aria-label="Admin panel"
                  title="Admin panel"
                  className="p-1 text-ww-muted transition-colors hover:text-rust"
                >
                  <Shield className="h-4 w-4" />
                </Link>
              )}
              <NotificationBell
                initialUnread={unreadCount}
                notifications={notifications}
                profileSlug={profileSlug ?? user.id}
              />
              <Link
                href="/settings"
                aria-label="Settings"
                title="Settings"
                className="p-1 text-ww-muted hover:text-ink"
              >
                <Settings className="h-4 w-4" />
              </Link>
              <Link
                href={`/profile/${profileSlug}`}
                aria-label="My profile"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-rust/20 text-xs font-medium text-rust transition-colors hover:bg-rust/30"
              >
                {initial}
              </Link>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/account/login">Sign in</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-rust text-warm-white hover:bg-rust/90"
              >
                <Link href="/account/signup">Join</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
