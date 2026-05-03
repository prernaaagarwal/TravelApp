import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { EmailCaptureForm } from "@/components/shared/EmailCaptureForm";

export const metadata = { title: "Coming soon — Wander Women" };

export default function ComingSoonPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 md:px-6 md:py-24">
      <Badge variant="outline" className="font-mono uppercase tracking-widest">
        V1 — invite only
      </Badge>
      <h1 className="mt-6 font-serif text-5xl leading-tight tracking-tight md:text-6xl">
        Sign-in opens with the founding 200.
      </h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-ww-muted">
        Real accounts, real posting, and the founding membership unlock when
        we open the closed beta. Drop your email and we&apos;ll send you the
        invite link first.
      </p>

      <div className="mt-8">
        <EmailCaptureForm
          source="coming-soon"
          buttonText="Notify me"
          placeholder="you@example.com"
          variant="inline-light"
        />
      </div>

      <p className="mt-3 text-xs text-ww-muted">
        We&apos;ll only email you about the founding-200 launch. No newsletter, no
        sharing.
      </p>

      <div className="mt-12">
        <Link href="/" className="text-sm text-ww-muted hover:text-ink">
          ← Back to landing
        </Link>
      </div>
    </main>
  );
}
