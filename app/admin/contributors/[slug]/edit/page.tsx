import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ContributorForm, type ContributorInitial } from "@/components/admin/ContributorForm";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  return { title: `Edit ${slug} — Admin` };
}

export default async function EditContributorPage({ params }: { params: Params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("contributors").select("*").eq("slug", slug).single();
  if (!data) notFound();

  const initial: ContributorInitial = {
    slug:                     data.slug,
    name:                     data.name,
    full_name:                data.full_name,
    home_city:                data.home_city,
    age_range:                data.age_range,
    tagline:                  data.tagline,
    bio:                      data.bio,
    photo_url:                data.photo_url,
    instagram:                data.instagram,
    joined_date:              data.joined_date,
    trip_count:               data.trip_count,
    total_contributions:      data.total_contributions,
    answers_in_community:     data.answers_in_community,
    earnings_this_month:      data.earnings_this_month,
    badges:                   data.badges                   ?? [],
    destinations_contributed: data.destinations_contributed ?? [],
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          Contributors / Edit
        </p>
        <h1 className="font-serif text-3xl text-ink">{data.full_name ?? data.name}</h1>
        <p className="mt-1 font-mono text-[10px] text-ww-muted">/{slug}</p>
      </div>
      <ContributorForm initial={initial} isEdit />
    </div>
  );
}
