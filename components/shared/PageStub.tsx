import { Badge } from "@/components/ui/badge";

export function PageStub({
  title,
  step,
  description,
}: {
  title: string;
  step: string;
  description: string;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <Badge variant="outline" className="font-mono uppercase tracking-widest">
        {step} — coming soon
      </Badge>
      <h1 className="mt-6 font-serif text-4xl leading-tight tracking-tight md:text-6xl">
        {title}
      </h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-ww-muted">
        {description}
      </p>
      <div className="mt-10 rounded-md border border-ww-border/60 bg-warm-white p-6">
        <p className="text-sm text-ww-muted">
          This route is wired up so navigation works. Full content lands in
          step <span className="font-medium text-ink">{step}</span> of the V0
          build plan.
        </p>
      </div>
    </main>
  );
}
