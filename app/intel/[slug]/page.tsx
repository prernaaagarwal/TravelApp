import { PageStub } from "@/components/shared/PageStub";

export const metadata = { title: "Trip Intel — Wander Women" };

type Params = Promise<{ slug: string }>;

export default async function IntelPage({ params }: { params: Params }) {
  const { slug } = await params;
  const prettyName = slug
    .replace(/-india$/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <PageStub
      title={`Trip Intel: ${prettyName}`}
      step="A.6"
      description="The hero artifact of the product. TLDR, neighborhoods, scams, transport, hidden gems, money tiers, and a contributor footer — built once, reused for every destination."
    />
  );
}
