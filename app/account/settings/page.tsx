import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { signOut } from "../profile/actions";

export const metadata = {
  title: "Settings — Wander Women",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login?next=/account/settings");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_tier, membership_expiry, created_at")
    .eq("id", user.id)
    .single();

  const tier = profile?.membership_tier ?? "free";
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : null;

  return (
    <main className="min-h-screen bg-sand px-4 py-12">
      <div className="mx-auto max-w-lg space-y-4">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/account/profile" className="text-sm text-ww-muted hover:text-ink">
            ← Back to profile
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
            Settings
          </p>
        </div>

        <h1 className="mb-2 font-serif text-3xl text-ink">Account settings</h1>
        <p className="mb-4 font-mono text-xs text-ww-muted">
          Private — only you see this.
        </p>

        {/* Account */}
        <div className="bg-warm-white border border-ww-border rounded-xl p-6 shadow-sm space-y-3">
          <p className="text-xs uppercase tracking-wider text-ww-muted">Account</p>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-ww-muted">Email</span>
              <span className="text-ink">{user.email}</span>
            </div>
            {memberSince && (
              <div className="flex justify-between">
                <span className="text-ww-muted">Member since</span>
                <span className="text-ink">{memberSince}</span>
              </div>
            )}
          </div>
        </div>

        {/* Membership */}
        <div className="bg-warm-white border border-ww-border rounded-xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-ww-muted">Membership</p>
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
            <p className="text-sm text-ink">
              Valid until{" "}
              {new Date(profile.membership_expiry).toLocaleDateString("en-IN", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}

          {tier === "free" && (
            <div className="rounded-lg bg-rust/5 border border-rust/20 p-4">
              <p className="text-sm text-ink font-medium mb-1">Upgrade to Founding membership</p>
              <p className="text-xs text-ww-muted mb-3">
                Unlock premium intel, early features, and support the community.
              </p>
              <Button asChild size="sm" className="bg-rust text-warm-white hover:bg-rust/90">
                <Link href="/account/membership">Join the Founding 200 →</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Notifications — placeholder */}
        <div className="bg-warm-white border border-ww-border rounded-xl p-6 shadow-sm space-y-3">
          <p className="text-xs uppercase tracking-wider text-ww-muted">Notifications</p>
          <p className="text-sm text-ww-muted">
            Email and push preferences — coming soon.
          </p>
        </div>

        {/* WhatsApp vault */}
        <div className="bg-warm-white border border-ww-border rounded-xl p-6 shadow-sm space-y-3">
          <p className="text-xs uppercase tracking-wider text-ww-muted">WhatsApp vault</p>
          <p className="text-sm text-ww-muted">
            Trip docs accessible by WhatsApp message.{" "}
            <Link href="/vault" className="underline hover:text-ink">
              Learn more →
            </Link>
          </p>
        </div>

        {/* Sign out */}
        <div className="bg-warm-white border border-ww-border rounded-xl p-6 shadow-sm">
          <form action={signOut}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="text-ww-muted hover:text-rust"
            >
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
