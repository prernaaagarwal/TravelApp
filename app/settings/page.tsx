import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NotificationToggles } from "./NotificationToggles";
import { DangerZoneButtons } from "./DangerZoneButtons";
import { updateEmail } from "./actions";

export const metadata = {
  title: "Settings — Wander Women",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/account/login?next=/settings");

  const [{ data: profile }, { data: rawPrefs }, { data: vault }] = await Promise.all([
    supabase
      .from("profiles")
      .select("first_name, username, membership_tier, membership_expiry, phone")
      .eq("id", user.id)
      .single(),
    supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("vault_purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .limit(1)
      .maybeSingle(),
  ]);

  // Ensure prefs row exists (create with defaults if missing)
  if (!rawPrefs) {
    await supabase
      .from("notification_preferences")
      .upsert({ user_id: user.id }, { onConflict: "user_id", ignoreDuplicates: true });
  }

  const prefs = rawPrefs ?? {
    new_beware_in_saved_destinations: true,
    buddy_match_found: true,
    community_reply_to_my_post: true,
    platform_updates: false,
    whatsapp_enabled: false,
    email_enabled: true,
  };

  const tier = profile?.membership_tier ?? "free";
  const profileSlug = profile?.username ?? user.id;

  return (
    <main className="min-h-screen bg-sand px-4 py-12">
      <div className="mx-auto max-w-lg space-y-4">
        <div className="mb-2 flex items-center justify-between">
          <Link href={`/profile/${profileSlug}`} className="text-sm text-ww-muted hover:text-ink">
            ← Back to profile
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">Settings</p>
        </div>

        {/* ── Account ──────────────────────────────── */}
        <div className="bg-warm-white border border-ww-border rounded-xl p-6 shadow-sm">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-wider text-ww-muted">Account</p>
          <form action={updateEmail} className="space-y-3">
            {profile?.phone && (
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-ww-muted">
                  Phone
                </label>
                <p className="font-mono text-sm text-ink">
                  {profile.phone.slice(0, -4).replace(/\d/g, "•") + profile.phone.slice(-4)}
                </p>
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-ww-muted"
              >
                Email
              </label>
              <div className="flex gap-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={user.email ?? ""}
                  className="flex-1 border border-ww-border bg-warm-white px-3 py-2 font-mono text-sm text-ink focus:border-ink focus:outline-none"
                />
                <button
                  type="submit"
                  className="border border-ww-border bg-sand px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:border-ink hover:text-ink"
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ── Membership ───────────────────────────── */}
        <div className="bg-warm-white border border-ww-border rounded-xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-wider text-ww-muted">Membership</p>
            <Badge
              className={
                tier === "founding"
                  ? "bg-gold/20 text-gold border-gold/30"
                  : "bg-ww-border text-ww-muted"
              }
            >
              {tier === "founding" ? "Founding member" : "Free"}
            </Badge>
          </div>
          {tier === "founding" && profile?.membership_expiry && (
            <p className="font-mono text-sm text-ink">
              Valid until{" "}
              {new Date(profile.membership_expiry).toLocaleDateString("en-IN", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
          {tier === "free" && (
            <div className="rounded-lg border border-rust/20 bg-rust/5 p-4">
              <p className="mb-1 font-mono text-sm font-medium text-ink">
                Upgrade to Founding membership
              </p>
              <p className="mb-3 font-mono text-xs text-ww-muted">
                Unlock premium intel, early features, and support the community.
              </p>
              <Button asChild size="sm" className="bg-rust text-warm-white hover:bg-rust/90">
                <Link href="/account/membership">Join the Founding 200 →</Link>
              </Button>
            </div>
          )}
        </div>

        {/* ── Notifications ────────────────────────── */}
        <div className="bg-warm-white border border-ww-border rounded-xl px-6 py-5 shadow-sm">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-wider text-ww-muted">
            Notifications
          </p>
          <NotificationToggles
            prefs={{
              new_beware_in_saved_destinations: prefs.new_beware_in_saved_destinations ?? true,
              buddy_match_found: prefs.buddy_match_found ?? true,
              community_reply_to_my_post: prefs.community_reply_to_my_post ?? true,
              platform_updates: prefs.platform_updates ?? false,
              whatsapp_enabled: prefs.whatsapp_enabled ?? false,
              email_enabled: prefs.email_enabled ?? true,
            }}
            hasPhone={!!profile?.phone}
            hasEmail={!!user.email}
          />
        </div>

        {/* ── WhatsApp vault ───────────────────────── */}
        <div className="bg-warm-white border border-ww-border rounded-xl p-6 shadow-sm">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-ww-muted">
            WhatsApp vault
          </p>
          <Link href="/vault" className="font-mono text-sm text-rust hover:underline">
            {vault ? "Manage vault →" : "Set up trip vault ₹199/trip →"}
          </Link>
        </div>

        {/* ── Danger zone ──────────────────────────── */}
        <div className="bg-warm-white border border-ww-border rounded-xl p-6 shadow-sm space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-ww-muted">Account</p>
          <DangerZoneButtons />
        </div>
      </div>
    </main>
  );
}
