import Link from "next/link";
import { Suspense } from "react";
import { LoginInner } from "./LoginInner";

export const metadata = {
  title: "Sign in to Wander Women",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-sand flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-2xl text-ink hover:text-rust">
            Wander Women
          </Link>
          <p className="mt-2 font-mono text-xs text-ww-muted">Sign in to your account</p>
        </div>

        <div className="bg-warm-white border border-ww-border rounded-2xl p-6">
          <Suspense fallback={<FormSkeleton />}>
            <LoginInner />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-10 animate-pulse rounded bg-ww-border" />
      <div className="h-10 animate-pulse rounded bg-ww-border" />
      <div className="h-10 animate-pulse rounded bg-ww-border" />
    </div>
  );
}
