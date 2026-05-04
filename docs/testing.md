# Testing & CI

## Quick reference

```bash
npm run test            # run all unit tests once
npm run test:watch      # interactive watch mode (use during development)
npm run test:coverage   # run tests + enforce coverage thresholds
npm run ci              # run the full CI pipeline locally (lint + type + test + build)
```

## What's tested

Unit tests live in `tests/`. They cover the pure logic that has business
implications:

| File                              | Tests              | What it locks down                                                |
|-----------------------------------|--------------------|-------------------------------------------------------------------|
| `lib/intel-import.ts`             | `intel-import.test.ts`  | Bulk-import parser: malformed JSON, oversize, duplicate slugs, all-or-nothing semantics |
| `lib/intel-card-schema.ts`        | `intel-card-schema.test.ts` | Zod validation: slug regex, audience enum, hero URL/path, nested objects, polymorphic emergency_numbers |
| `lib/jsonld.ts`                   | `jsonld.test.ts`        | Structured-data shape (Organization, WebSite, Article, Person, BreadcrumbList) |
| `lib/rate-limit.ts`               | `rate-limit.test.ts`    | Allow/block boundary, window math (minutes / hours / days), pre-baked LIMITS |
| `lib/search.ts`                   | `search.test.ts`        | Min query length, RPC error handling, href builders for intel/beware/post |
| `lib/email-template.ts`           | `email-template.test.ts`| HTML escaping (XSS prevention), CTA + reason block rendering |
| `lib/ban-check.ts`                | `ban-check.test.ts`     | Ban detection, message never leaks reason |

**Coverage policy:** every file in `vitest.config.ts > coverage.include`
must hit 70% on lines/functions/branches/statements. New tested modules
get added to that include list — that's the trigger to write the test.

## What is NOT yet tested

- Server actions (`app/**/actions.ts`) — would need either a test Supabase
  project or a comprehensive mock of the SDK. **Open follow-up.**
- React components — UI-test infrastructure not yet set up.
- E2E (Playwright) — out of scope until we have a test database. Manual QA
  via the local dev server fills this gap today.

If you write tests for any of the above, add them under `tests/` and add
the source file to `vitest.config.ts > coverage.include` so the gate
applies.

## CI pipeline

`.github/workflows/ci.yml` runs four jobs on every push to `main` and
every pull request:

1. **Lint** — `eslint . --max-warnings 0` (any warning fails the build)
2. **Type-check** — `tsc --noEmit`
3. **Unit tests** — `vitest run --coverage` (enforces the 70% gate)
4. **Production build** — `next build` (runs only if the above three pass)

Concurrency control cancels an in-progress run when a newer commit lands
on the same ref. Build needs an env (`NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`) — placeholders are set in the workflow
because CI never reaches Supabase; the build only validates that the env
parses.

## Branch protection — set this up once on GitHub

After this CI lands on `main`, configure branch protection:

1. Repository → **Settings** → **Branches**
2. Add rule for `main`:
   - ✓ **Require a pull request before merging**
   - ✓ **Require status checks to pass before merging**
     - Required checks: `Lint`, `Type-check`, `Unit tests + coverage`, `Production build`
   - ✓ **Require branches to be up to date before merging**
   - ✓ **Do not allow bypassing the above settings**

This makes the CI gate hard — broken code can no longer reach `main`.

## Adding a new test

1. Create `tests/my-module.test.ts` mirroring the source path
2. Use `import` with the `@/lib/...` alias (vitest is configured to
   resolve it from the project root)
3. Run `npm run test:watch` while developing
4. If the source file isn't already in `vitest.config.ts > coverage.include`,
   add it. Run `npm run test:coverage` to verify the gate passes.

## Troubleshooting

**"Coverage for X does not meet threshold"** — your new code dropped
the metric below 70%. Either add tests or, if the file genuinely
shouldn't be coverage-gated (SDK glue, IO-heavy), move it out of
`coverage.include` and document why.

**Test passes locally but fails in CI** — usually a missing env var. CI
has placeholder Supabase env vars; if your test reads `process.env.X`,
either mock the value via `vi.stubEnv` or add a placeholder to the CI
workflow.

**Vitest can't find a module** — alias `@/...` is configured in
`vitest.config.ts`; if you import via a different alias, add it there.
