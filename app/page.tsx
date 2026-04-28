import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-8 px-6 py-24">
      <Badge variant="outline" className="font-mono uppercase tracking-widest">
        Phase A.1 — scaffold check
      </Badge>
      <h1 className="font-serif text-5xl leading-tight tracking-tight md:text-7xl">
        Trip intel built by <em className="not-italic text-rust">women</em> who
        actually travel solo.
      </h1>
      <p className="max-w-xl text-base leading-relaxed text-ww-muted">
        Wander Women — V0 demo build. The full landing page lands in step A.5.
        For now: this confirms fonts, design tokens, and the shadcn primitives
        are wired correctly.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button>Primary CTA</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-ww-muted">
        <span className="rounded-full bg-rust-light px-3 py-1 text-rust">
          rust
        </span>
        <span className="rounded-full bg-sage-light px-3 py-1 text-sage">
          sage
        </span>
        <span className="rounded-full bg-blue-light px-3 py-1 text-blue">
          blue
        </span>
        <span className="rounded-full bg-gold-light px-3 py-1 text-gold">
          gold
        </span>
        <span className="rounded-full bg-purple-light px-3 py-1 text-purple">
          purple
        </span>
      </div>
    </main>
  );
}
