import Link from "next/link";
import { AuthForm } from "@/components/account/AuthForm";

export const metadata = {
  title: "Join — Wander Women",
};

// Only allow same-origin redirect targets. Reject absolute URLs and anything
// not starting with "/" — defends against open-redirect via ?next=//evil.com.
function safeNext(raw: string | undefined): string {
  if (!raw) return "/onboarding";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/onboarding";
  return raw;
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next: nextRaw } = await searchParams;
  const next = safeNext(nextRaw);

  return (
    <main className="min-h-screen bg-sand flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-2xl text-ink hover:text-rust">
            Wander Women
          </Link>
          <p className="mt-2 font-mono text-xs text-ww-muted">
            Join 1,200+ women travelling smarter
          </p>
        </div>

        <div className="bg-warm-white border border-ww-border rounded-xl p-6 shadow-sm">
          <AuthForm
            next={next}
            primaryLabel="Join"
            postSendNote="After joining, we'll ask 3 quick questions to personalise your intel."
            declaration={
              <>
                I identify as a woman. I understand Wander Women is a women-only
                community and that accounts found to be misrepresenting will be
                permanently removed.
              </>
            }
            bottomNote={
              <>
                Already a member?{" "}
                <Link
                  href={`/account/login${nextRaw ? `?next=${encodeURIComponent(next)}` : ""}`}
                  className="text-rust hover:underline"
                >
                  Sign in
                </Link>
              </>
            }
          />
        </div>

        <p className="mt-4 text-center font-mono text-[10px] leading-relaxed text-ww-muted px-4">
          Free to join. No spam. Intel from real women, not travel brands.
        </p>
      </div>
    </main>
  );
}
