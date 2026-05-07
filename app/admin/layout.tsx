import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Shield, ClipboardList, FileText, Users, UserCog, ArrowLeft, ShieldCheck, Flag, BarChart3 } from "lucide-react";

export const metadata = { title: "Admin — Wander Women" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/account/login?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, first_name, username")
    .eq("id", user.id)
    .single();

  if (!profile || !["moderator", "admin"].includes(profile.role ?? "")) {
    redirect("/");
  }

  const isAdmin = profile.role === "admin";

  return (
    <div className="flex min-h-screen bg-sand">
      {/* ── Sidebar ── */}
      <aside className="hidden w-52 shrink-0 flex-col border-r border-ww-border bg-warm-white md:flex">
        <div className="border-b border-ww-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-rust" />
            <span className="font-mono text-xs uppercase tracking-widest text-ink">
              Admin
            </span>
          </div>
          <p className="mt-1 font-mono text-[10px] text-ww-muted">
            {profile.first_name ?? profile.username ?? user.email}
          </p>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-3 py-2 font-mono text-xs text-ww-muted transition-colors hover:bg-sand hover:text-ink"
          >
            <ClipboardList className="h-3.5 w-3.5" />
            Queue
          </Link>
          <Link
            href="/admin/metrics"
            className="flex items-center gap-2 px-3 py-2 font-mono text-xs text-ww-muted transition-colors hover:bg-sand hover:text-ink"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Metrics
          </Link>
          <Link
            href="/admin/intel"
            className="flex items-center gap-2 px-3 py-2 font-mono text-xs text-ww-muted transition-colors hover:bg-sand hover:text-ink"
          >
            <FileText className="h-3.5 w-3.5" />
            Intel cards
          </Link>
          <Link
            href="/admin/verifications"
            className="flex items-center gap-2 px-3 py-2 font-mono text-xs text-ww-muted transition-colors hover:bg-sand hover:text-ink"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Verifications
          </Link>
          <Link
            href="/admin/buddy-reports"
            className="flex items-center gap-2 px-3 py-2 font-mono text-xs text-ww-muted transition-colors hover:bg-sand hover:text-ink"
          >
            <Flag className="h-3.5 w-3.5" />
            Buddy reports
          </Link>
          <Link
            href="/admin/contributors"
            className="flex items-center gap-2 px-3 py-2 font-mono text-xs text-ww-muted transition-colors hover:bg-sand hover:text-ink"
          >
            <UserCog className="h-3.5 w-3.5" />
            Contributors
          </Link>
          {isAdmin && (
            <Link
              href="/admin/team"
              className="flex items-center gap-2 px-3 py-2 font-mono text-xs text-ww-muted transition-colors hover:bg-sand hover:text-ink"
            >
              <Users className="h-3.5 w-3.5" />
              Manage team
            </Link>
          )}
        </nav>

        <div className="mt-auto border-t border-ww-border p-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 font-mono text-[10px] text-ww-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to site
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
