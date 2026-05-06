import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ImportClient } from "./ImportClient";
import { TEMPLATE_JSON } from "./template";
import { env } from "@/lib/config";

export const metadata = {
  title: "Bulk Import Intel Cards — Wander Women Admin",
};

export const dynamic = "force-dynamic";

export default async function ImportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !env.ADMIN_EMAIL || user.email !== env.ADMIN_EMAIL) {
    redirect("/account/login?next=/admin/intel/import");
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-6">
        <Link href="/admin/intel" className="font-mono text-[10px] uppercase tracking-widest text-ww-muted hover:text-ink">
          ← Back to intel cards
        </Link>
      </div>

      <div className="mb-8">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          Admin · Intel cards
        </p>
        <h1 className="mb-2 font-serif text-3xl text-ink md:text-4xl">Bulk import</h1>
        <p className="font-mono text-xs leading-relaxed text-ww-muted">
          Paste a JSON array of intel cards or upload a <code>.json</code> file.
          Each card is validated against the schema; you&apos;ll see a preview of
          what will change before anything is written. Maximum 100 cards per
          batch.
        </p>
      </div>

      <ImportClient templateJson={TEMPLATE_JSON} />
    </div>
  );
}
