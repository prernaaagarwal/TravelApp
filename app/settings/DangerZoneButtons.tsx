"use client";

import { signOut, deleteAccount } from "./actions";

export function DangerZoneButtons() {
  return (
    <>
      <form
        action={signOut}
        onSubmit={(e) => {
          if (!confirm("Sign out?")) e.preventDefault();
        }}
      >
        <button
          type="submit"
          className="font-mono text-sm text-ww-muted hover:text-ink"
        >
          Sign out
        </button>
      </form>
      <form
        action={deleteAccount}
        onSubmit={(e) => {
          if (!confirm("Delete your account permanently? This cannot be undone.")) e.preventDefault();
        }}
      >
        <button
          type="submit"
          className="font-mono text-sm text-rust/70 hover:text-rust"
        >
          Delete account
        </button>
      </form>
    </>
  );
}
