import { PageStub } from "@/components/shared/PageStub";

export const metadata = { title: "Contributor — Wander Women" };

type Params = Promise<{ name: string }>;

export default async function ContributorPage({
  params,
}: {
  params: Params;
}) {
  const { name } = await params;
  const prettyName = name
    .split("-")[0]
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <PageStub
      title={prettyName}
      step="A.7"
      description="Public contributor profile — bio, badges, the Trip Intel Cards she's authored, recent community answers, and her visible monthly earnings (the contributor pitch)."
    />
  );
}
