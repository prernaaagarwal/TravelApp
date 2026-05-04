import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!user || !adminEmail || user.email !== adminEmail) {
    redirect("/account/login?next=/admin");
  }

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Admin top bar */}
      <div className="border-b border-ww-border bg-ink">
        <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-warm-white/50">
            Admin
          </span>
          <nav className="flex gap-5">
            {[
              { href: "/admin",              label: "Queue"        },
              { href: "/admin/intel",        label: "Intel Cards"  },
              { href: "/admin/contributors", label: "Contributors" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-mono text-[10px] uppercase tracking-widest text-warm-white/70 transition-colors hover:text-warm-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/"
            className="ml-auto font-mono text-[10px] text-warm-white/40 hover:text-warm-white/70"
          >
            ← Site
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
