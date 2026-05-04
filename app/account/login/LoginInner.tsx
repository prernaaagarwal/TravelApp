"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthForm } from "@/components/account/AuthForm";

export function LoginInner() {
  const searchParams = useSearchParams();
  const next     = searchParams.get("next")  ?? "/";
  const hasError = searchParams.get("error") === "auth";

  return (
    <>
      {hasError && (
        <p className="mb-3 font-mono text-xs text-rust">
          That sign-in link expired or was already used. Try again.
        </p>
      )}
      <AuthForm
        next={next}
        primaryLabel="Sign in"
        bottomNote={
          <>
            No account yet?{" "}
            <Link href="/account/signup" className="text-rust hover:underline">
              Join Wander Women
            </Link>
          </>
        }
      />
    </>
  );
}
