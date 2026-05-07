import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { RustButton } from "@/components/ui/RustButton";
import { NotificationToggles } from "./NotificationToggles";
import { DangerZoneButtons } from "./DangerZoneButtons";
import { PrivacyDataSection } from "./PrivacyDataSection";
import { updateEmail } from "./actions";
import { AvatarUploadWrapper } from "./AvatarUploadWrapper";

export const metadata = {
  title: "Settings — Wander Women",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/account/login?next=/settings");

  const [{ data: profile }, { data: rawPrefs }, { data: vault }, { data: contributorRow }] = await Promise.all([
    supabase
      .from("profiles")
      .select("first_name, username, membership_tier, membership_expiry, phone, photo_url")
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
    supabase
      .from("contributors")
      .select("slug")
      .eq("user_id", user.id)
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
    weekly_digest_enabled: true,
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

        {/* ── Beta feedback (prominent for early users) ─ */}
        <div className="rounded-2xl border border-rust/30 bg-rust/[0.04] p-5">
          <p className="mb-1 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-rust">
            <span className="h-1.5 w-1.5 rounded-full bg-rust" />
            Beta · We need your view
          </p>
          <h2 className="mb-2 font-serif text-lg leading-snug text-ink">
            Tell us what&apos;s working and what isn&apos;t.
          </h2>
          <p className="mb-3 font-mono text-xs leading-relaxed text-ww-muted">
            Eight short questions. Every field is optional. Real feedback from
            real users is the difference between this becoming a guidebook for
            women and yet another travel app.
          </p>
          <RustButton size="sm" asChild>
            <Link href="/feedback">
              Share feedback
              <span aria-hidden>→</span>
            </Link>
          </RustButton>
        </div>

        {/* ── Profile photo ────────────────────────── */}
        <div className="bg-warm-white border border-ww-border rounded-2xl p-6">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-wider text-ww-muted">Profile photo</p>
          <AvatarUploadWrapper userId={user.id} currentUrl={profile?.photo_url ?? null} />
        </div>

        {/* ── Account ──────────────────────────────── */}
        <div className="bg-warm-white border border-ww-border rounded-2xl p-6">
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
        <div className="bg-warm-white border border-ww-border rounded-2xl p-6 space-y-3">
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
            <div className="rounded-xl border border-rust/20 bg-rust/5 p-4">
              <p className="mb-1 font-mono text-sm font-medium text-ink">
                Upgrade to Founding membership
              </p>
              <p className="mb-3 font-mono text-xs text-ww-muted">
                Unlock premium intel, early features, and support the community.
              </p>
              <RustButton size="sm" asChild>
                <Link href="/account/membership">Join the Founding 200 →</Link>
              </RustButton>
            </div>
          )}
        </div>

        {/* ── Contributor dashboard ────────────────── */}
        {contributorRow && (
          <div className="bg-warm-white border border-ww-border rounded-2xl p-6">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ww-muted">
              Contributor
            </p>
            <Link href="/contributor/dashboard" className="font-mono text-sm text-rust hover:underline">
              View attribution + earnings dashboard →
            </Link>
          </div>
        )}

        {/* ── Notifications ────────────────────────── */}
        <div className="bg-warm-white border border-ww-border rounded-2xl px-6 py-5">
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
              weekly_digest_enabled: prefs.weekly_digest_enabled ?? true,
            }}
            hasPhone={!!profile?.phone}
            hasEmail={!!user.email}
          />
        </div>

        {/* ── Trip vault ───────────────────────────── */}
        <div className="bg-warm-white border border-ww-border rounded-2xl p-6">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ww-muted">
            Trip vault
          </p>
          {!vault && (
            <p className="mb-3 font-mono text-xs leading-relaxed text-ww-muted">
              Share your itinerary, photos & emergency contacts with someone
              you trust — auto-WhatsApped if you go quiet.
            </p>
          )}
          <Link href="/vault" className="font-mono text-sm text-rust hover:underline">
            {vault ? "Manage vault →" : "Set up your trip vault →"}
          </Link>
        </div>

        {/* ── Privacy & data ──────────────────────────── */}
        <PrivacyDataSection />

        {/* ── Danger zone ──────────────────────────── */}
        <div className="bg-warm-white border border-ww-border rounded-2xl p-6 space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-ww-muted">Account</p>
          <DangerZoneButtons />
        </div>
      </div>
    </main>
  );
}
