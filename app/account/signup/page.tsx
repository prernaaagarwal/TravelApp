import Link from "next/link";
import { AuthForm } from "@/components/account/AuthForm";

export const metadata = {
  title: "Join — Wander Women",
};

export default function SignupPage() {
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
            next="/onboarding"
            primaryLabel="Join"
            postSendNote="After joining, we'll ask 3 quick questions to personalise your intel."
            bottomNote={
              <>
                Already a member?{" "}
                <Link href="/account/login" className="text-rust hover:underline">
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
