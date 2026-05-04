import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { IntelCardForm, type IntelCardInitial } from "@/components/admin/IntelCardForm";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  return { title: `Edit ${slug} — Admin` };
}

export default async function EditIntelCardPage({ params }: { params: Params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("intel_cards").select("*").eq("slug", slug).single();
  if (!data) notFound();

  const initial: IntelCardInitial = {
    slug:                    data.slug,
    destination:             data.destination,
    country:                 data.country,
    audience:                data.audience,
    contributor_slug:        data.contributor_slug,
    last_updated:            data.last_updated,
    verified_by_count:       data.verified_by_count,
    hero_image_url:          data.hero_image_url,
    is_premium:              data.is_premium,
    premium_preview:         data.premium_preview,
    tldr:                    data.tldr            ?? [],
    neighborhoods:           data.neighborhoods   ?? [],
    scams:                   data.scams           ?? [],
    transport:               data.transport       ?? [],
    hidden_gems:             data.hidden_gems     ?? [],
    pre_book_checklist:      data.pre_book_checklist ?? [],
    dos_and_donts:           data.dos_and_donts   ?? { do: [], dont: [] },
    estimated_daily_budget:  data.estimated_daily_budget ?? { backpacker: 0, midRange: 0, comfortable: 0, currency: "INR" },
    emergency_numbers:       data.emergency_numbers ?? [],
    affiliate_links:         data.affiliate_links ?? {},
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          Intel cards / Edit
        </p>
        <h1 className="font-serif text-3xl text-ink">{data.destination}, {data.country}</h1>
        <p className="mt-1 font-mono text-[10px] text-ww-muted">/{slug}</p>
      </div>
      <IntelCardForm initial={initial} isEdit />
    </div>
  );
}
