import { IntelCardForm } from "@/components/admin/IntelCardForm";

export const metadata = { title: "New Intel Card — Admin" };

export default function NewIntelCardPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          Intel cards / New
        </p>
        <h1 className="font-serif text-3xl text-ink">Create intel card</h1>
      </div>
      <IntelCardForm />
    </div>
  );
}
