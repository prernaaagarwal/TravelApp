import { ContributorForm } from "@/components/admin/ContributorForm";

export const metadata = { title: "New Contributor — Admin" };

export default function NewContributorPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          Contributors / New
        </p>
        <h1 className="font-serif text-3xl text-ink">Add contributor</h1>
      </div>
      <ContributorForm />
    </div>
  );
}
