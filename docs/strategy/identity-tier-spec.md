# Identity-tier UI spec

> One-day build. Implementation-ready. Becomes a screenshot in the deck.

The Contributor Safety Policy page (`/safety/contributor-safety`) commits
us to four identity tiers. This doc specifies the radio-button UI on
`/account/profile` plus the database changes needed to enforce the
contract everywhere a contributor's name renders.

The whole system is **one column on profiles, one helper, one component.**
Anything beyond that is over-build.

---

## The four tiers

| Mode value     | Public display                  | When to use                                                        |
| :------------- | :------------------------------ | :----------------------------------------------------------------- |
| `full`         | `Ananya Iyer · Mumbai`          | Named contributors who want byline credit                          |
| `first_city`   | `Ananya · Mumbai`               | First-name + city for trust without full identification (default)  |
| `handle`       | `@ananya_hp`                    | Chosen handle. No real name displayed anywhere on platform         |
| `anon`         | `Anonymous contributor`         | Hostile situations, abuse reports, sensitive beware reports        |

`first_city` is the **default for new signups.** It's the lowest-risk
balance of trust and privacy.

---

## Database change

### Migration `055_display_name_mode.sql`

```sql
-- 055_display_name_mode.sql
-- Tiered identity for contributors. Per the Contributor Safety Policy at
-- /safety/contributor-safety, every contributor picks how visible they
-- want to be. This column is the single source of truth.

create type display_name_mode as enum ('full', 'first_city', 'handle', 'anon');

alter table profiles
  add column if not exists display_name_mode display_name_mode
    not null default 'first_city';

comment on column profiles.display_name_mode is
  'How the contributor wants to be displayed publicly. See /safety/contributor-safety.';

-- Backfill: existing rows inherit the default 'first_city' from the column
-- definition. No data migration needed.

-- Optional: expose mode in any public-facing view that joins profiles.
-- Existing views (community_posts_with_author, etc.) will need a follow-up
-- migration that updates the SELECT list — but the plain column read works
-- everywhere a server component already pulls profiles.first_name.
```

---

## Server-side helper

### `lib/display-name.ts` (new file)

```ts
// Single source of truth for how a profile's name renders publicly.
// Every public surface (Trip Intel Card byline, community post author,
// beware-report submitter, contributor profile page, etc.) MUST go
// through this helper. Bypassing it is a privacy bug.

export type DisplayNameMode = "full" | "first_city" | "handle" | "anon";

export type ProfileForDisplay = {
  first_name?: string | null;
  full_name?: string | null;
  username?: string | null;          // platform handle
  home_city?: string | null;
  display_name_mode: DisplayNameMode;
};

export function displayName(p: ProfileForDisplay): string {
  switch (p.display_name_mode) {
    case "full": {
      const name = p.full_name ?? p.first_name ?? "Contributor";
      return p.home_city ? `${name} · ${p.home_city}` : name;
    }
    case "first_city": {
      const name = p.first_name ?? "Contributor";
      return p.home_city ? `${name} · ${p.home_city}` : name;
    }
    case "handle":
      return p.username ? `@${p.username}` : "@anonymous";
    case "anon":
      return "Anonymous contributor";
  }
}

// Where the contributor profile page lives, if linkable. Returns null
// for `anon` because we don't link to a profile page when the user has
// chosen invisibility.
export function displayProfileHref(p: ProfileForDisplay): string | null {
  if (p.display_name_mode === "anon") return null;
  if (!p.username) return null;
  return `/contributor/${p.username}`;
}
```

---

## The radio-button UI

### Where it lives

`/account/profile` (currently at `app/profile/[username]/ProfileEditClient.tsx`).
Insert as a new section above the `firstName / homeCity / instagram`
fields, at the top of the form so contributors see it before they fill
in the rest.

### Component sketch

```tsx
// Add to ProfileEditClient.tsx, in the "Identity" section.

const IDENTITY_OPTIONS: {
  value: DisplayNameMode;
  label: string;
  preview: string;
  body: string;
}[] = [
  {
    value: "full",
    label: "Full name + city",
    preview: "Ananya Iyer · Mumbai",
    body: "Named credit. Used by contributors who want the byline.",
  },
  {
    value: "first_city",
    label: "First name + city (recommended)",
    preview: "Ananya · Mumbai",
    body: "Default. Trust without full identification.",
  },
  {
    value: "handle",
    label: "Handle only",
    preview: "@ananya_hp",
    body: "Chosen handle. No real name shown anywhere.",
  },
  {
    value: "anon",
    label: "Anonymous",
    preview: "Anonymous contributor",
    body: "No identifier. For hostile situations or sensitive reports.",
  },
];

// In the JSX, render as styled radio buttons:
//
//   <fieldset className="space-y-3">
//     <legend className="font-mono text-xs uppercase tracking-[0.2em] text-ww-muted">
//       How you appear publicly
//     </legend>
//     {IDENTITY_OPTIONS.map((opt) => (
//       <label
//         key={opt.value}
//         className={cn(
//           "block cursor-pointer border p-4 transition-colors",
//           mode === opt.value
//             ? "border-rust bg-rust/5"
//             : "border-ww-border hover:border-rust/40"
//         )}
//       >
//         <div className="flex items-start gap-3">
//           <input
//             type="radio"
//             name="display_name_mode"
//             value={opt.value}
//             checked={mode === opt.value}
//             onChange={(e) => setMode(e.target.value as DisplayNameMode)}
//             className="mt-1 accent-rust"
//           />
//           <div className="flex-1">
//             <div className="flex flex-wrap items-baseline gap-2">
//               <span className="font-serif text-base text-ink">{opt.label}</span>
//               <span className="font-mono text-xs text-ww-muted">
//                 → {opt.preview}
//               </span>
//             </div>
//             <p className="mt-1 text-sm text-ink/70">{opt.body}</p>
//           </div>
//         </div>
//       </label>
//     ))}
//   </fieldset>
```

---

## Server action wiring

### `app/profile/[username]/actions.ts`

Add a new field to `updateProfileField` (or its equivalent) so it accepts
`display_name_mode`. Validate against the enum.

```ts
// Inside the existing updateProfileField switch:
case "display_name_mode": {
  if (!["full", "first_city", "handle", "anon"].includes(value)) {
    return { error: "Invalid display mode" };
  }
  await supabase
    .from("profiles")
    .update({ display_name_mode: value })
    .eq("id", userId);
  // Revalidate any public surface that renders this user.
  revalidatePath(`/contributor/${profile.username}`);
  revalidateTag("profiles");
  return { ok: true };
}
```

### Cascade revalidation

Changing the mode affects **every public surface that displays this
user.** The current PR caches:

- `/contributor/[name]` — the profile page itself
- `/intel/[slug]` — Trip Intel Card byline (if author)
- `/community` — community post author chip
- `/community/beware/[city]` — beware-report submitter chip

The cleanest revalidation is:
```ts
revalidateTag("profiles");
```
…assuming we add the `profiles` tag to the relevant `unstable_cache`
calls. Alternative: revalidate by route, which is more verbose but
explicit.

---

## Display-rule enforcement (the privacy lint)

### Add a lint rule

`profiles.first_name`, `profiles.full_name`, `profiles.username`,
`profiles.home_city` should NEVER be rendered directly in a public
component. They should always go through `displayName()`.

Add an ESLint rule that flags direct usage in any file under `app/` or
`components/` that isn't `app/account/`, `app/profile/`,
`app/admin/`, or `app/settings/`. Use a `no-restricted-syntax` rule that
matches member-expressions ending in `.first_name`, `.full_name`,
`.username`, `.home_city` outside the allowed paths.

This is the privacy-by-construction guard. Adding a new public surface
that calls `profile.first_name` directly will fail lint and CI will block
the merge.

```js
// In .eslintrc.js — overrides section, scoped to public renderers:
{
  files: ["app/**/*.{tsx,ts}", "components/**/*.{tsx,ts}"],
  excludedFiles: [
    "app/account/**",
    "app/profile/**",
    "app/admin/**",
    "app/settings/**",
    "app/api/**",
  ],
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        selector: "MemberExpression[property.name='first_name']",
        message:
          "Use displayName() from @/lib/display-name instead of profile.first_name. " +
          "Direct access bypasses the contributor identity tier.",
      },
      // ... repeat for full_name, home_city
    ],
  },
}
```

---

## Test cases

Add `tests/display-name.test.ts`:

```ts
describe("displayName", () => {
  it("returns full name + city for `full`", () => {
    expect(
      displayName({
        full_name: "Ananya Iyer",
        first_name: "Ananya",
        home_city: "Mumbai",
        display_name_mode: "full",
      })
    ).toBe("Ananya Iyer · Mumbai");
  });

  it("falls back to first_name when full_name is missing in `full` mode", () => {
    expect(
      displayName({
        first_name: "Ananya",
        home_city: "Mumbai",
        display_name_mode: "full",
      })
    ).toBe("Ananya · Mumbai");
  });

  it("returns first + city for `first_city`", () => {
    expect(
      displayName({
        first_name: "Ananya",
        home_city: "Mumbai",
        display_name_mode: "first_city",
      })
    ).toBe("Ananya · Mumbai");
  });

  it("returns @handle for `handle`", () => {
    expect(
      displayName({
        username: "ananya_hp",
        display_name_mode: "handle",
      })
    ).toBe("@ananya_hp");
  });

  it("returns 'Anonymous contributor' for `anon` regardless of fields", () => {
    expect(
      displayName({
        full_name: "Ananya Iyer",
        first_name: "Ananya",
        home_city: "Mumbai",
        username: "ananya_hp",
        display_name_mode: "anon",
      })
    ).toBe("Anonymous contributor");
  });

  it("never reveals home_city in `handle` or `anon`", () => {
    const handle = displayName({
      home_city: "Mumbai",
      username: "ananya_hp",
      display_name_mode: "handle",
    });
    expect(handle).not.toContain("Mumbai");
    const anon = displayName({
      home_city: "Mumbai",
      display_name_mode: "anon",
    });
    expect(anon).not.toContain("Mumbai");
  });
});
```

Also update `vitest.config.ts` coverage `include` to add `lib/display-name.ts`.

---

## Out of scope (do NOT do in this build)

- **Per-content-type override** ("show full name on Trip Intel Cards but
  anonymous on Beware Reports"). Users will ask for it; defer until
  there's a real privacy reason. One mode per profile is enough at V1.
- **Real-time tier-change webhooks.** A `revalidatePath` is fine — 60-
  second propagation is the public commitment, not 60-millisecond.
- **History of mode changes.** Audit log is overkill for V1; if needed,
  can be added later as a `display_name_mode_history` table.

---

## Estimate

- Migration + helper + test: 2 hours
- Profile UI radio component: 2 hours
- Server action + revalidation: 1 hour
- ESLint rule + fixing existing direct accesses: 2 hours
- Manual QA across the 4 public surfaces: 1 hour

**Total: ~1 day for a single engineer.** Becomes a screenshot in the deck
appendix the same day it ships.
