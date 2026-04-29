---
description: Self-healing architecture audit for Next.js + TypeScript projects. Scans the current project against 20 best-practice checkpoints drawn from production codebases (including the Claude Code CLI). Covers TypeScript strictness, folder scaling, config management, validation, error handling, linting (ESLint/Biome), and testing strategy. Auto-applies every fix that is safe to automate. Reports what needs a human decision. Ends with a health score out of 20.
---

# /project-architect — Next.js Architecture Audit & Self-Healing

Run this in any Next.js + TypeScript project. Claude will:
1. Ask one clarifying question (linting tool preference)
2. Silently scan the project structure
3. Audit it against 20 checkpoints across 6 categories: TypeScript, folder organization, config management, validation & error handling, code quality, and testing
4. Auto-apply every safe fix
5. Report what needs your decision
6. Print a final health score out of 20

**Arguments:** `$ARGUMENTS`
- `--report-only` — print the audit, apply no fixes
- `--fix-only` — skip audit narration, jump straight to fixes
- `--score` — print only the final score line

---

## Phase 0 — Clarifying Questions

Ask this before doing anything else. Detect the current state from `package.json`, then ask:

> **Linting tool (Item 19):** Your project currently uses **[ESLint / Biome / neither]**. What do you want to do?
> - **Keep ESLint** — I'll strengthen the config with TypeScript-aware rules (`no-explicit-any`, etc.)
> - **Switch to Biome** — I'll scaffold `biome.json` and update scripts (faster, replaces ESLint + Prettier)
> - **Skip** — leave linting as-is, mark Item 19 as N/A

Wait for the answer before proceeding to Phase 1.

If `--report-only`, `--fix-only`, or `--score` is passed as an argument, skip Phase 0 and default to "Keep ESLint".

---

## Phase 1 — Orient (silent)

Read these files before doing anything else. Do not narrate this phase to the user.

```
package.json
tsconfig.json
.gitignore
.env.example          (may not exist)
CLAUDE.md             (may not exist)
README.md             (may not exist)
.husky/pre-commit     (may not exist)
.husky/commit-msg     (may not exist)
lib/config.ts         (may not exist)
lib/errors.ts         (may not exist)
lib/constants.ts      (may not exist)
lib/schemas/index.ts  (may not exist)
types/index.ts        (may not exist)
```

Also run these shell reads (do not modify yet):

```bash
find . -maxdepth 1 -name "*.xlsx" -o -name "*.html" -o -name "*.pdf" | grep -v node_modules
git ls-files 2>/dev/null | grep -E '\.(xlsx|xls|pdf|doc|docx|html)$' | head -20
git ls-files 2>/dev/null | grep " " | head -10
ls lib/ 2>/dev/null
ls types/ 2>/dev/null
ls app/api/ 2>/dev/null
grep -r "process\.env\." --include="*.ts" --include="*.tsx" -h . 2>/dev/null | grep -o 'process\.env\.[A-Z_]*' | sort -u
find app/ -name "*.tsx" -o -name "*.ts" 2>/dev/null | head -40
find . -name "*.tsx" -o -name "*.ts" 2>/dev/null | grep -v node_modules | grep -v .next | xargs grep -l "<img " 2>/dev/null | head -10
```

**Stop conditions (check before proceeding):**

- If `package.json` does not exist: print `This does not appear to be a Node.js project. /project-architect requires a package.json in the current directory.` and stop.
- If `next` is not in `package.json` dependencies or devDependencies: print a warning `next is not in dependencies — this audit is designed for Next.js projects. Skipping Items 6, 13, 15. Continuing with remaining checks.` then proceed, skipping those items and marking them N/A.
- If no `.git` directory: skip Item 12, mark it N/A.
- If a `src/` directory exists and `app/` does not exist at root: all path-based checks apply inside `src/` instead of root. The `@/*` alias should target `./src/*`.

After orientation, print this header and begin Phase 2:

```
╔══════════════════════════════════════════╗
║   PROJECT ARCHITECT — AUDIT IN PROGRESS  ║
╚══════════════════════════════════════════╝
```

---

## Phase 2 — Audit (20 items)

For each item, print one status line immediately after checking it:
`[✅|❌|⚠️] #N — Item Name: one-sentence finding`

Do not batch — print each result as you go so the user sees live progress.

---

### Item 1 — TypeScript: Strict Flags + Naming Conventions

**What to check:**

*A. Compiler flags* — `tsconfig.json` must contain ALL of:
- `"strict": true`
- `"forceConsistentCasingInFileNames": true`
- `"noImplicitReturns": true`
- `"noFallthroughCasesInSwitch": true`
- `"target"` is `"ES2017"` or higher (`"ES2020"` preferred)

*B. No explicit `any`* — scan all `.ts`/`.tsx` files for the pattern `: any` or `as any`. Count occurrences. Exclude `// eslint-disable` lines and `node_modules`.

*C. Naming conventions* — scan exported `type` and `interface` declarations:
- All exported types and interfaces must be PascalCase
- `interface` should be used for object shapes; `type` for unions, intersections, primitives, and utility types
- Report violations — do not auto-fix names

**Pass:** All 5 flags present + zero explicit `any` + no naming violations found.
**Fail:** Any flag missing.
**Warning:** Flags pass but `any` usages or naming violations found.

**Auto-fix:** Add missing compiler flags to `tsconfig.json`. Preserve exact file formatting. If tsconfig uses `"extends"`, add flags to the local file only (don't modify the extended base).

**Human decision (naming/any):** List each file:line with explicit `any` or naming violation. Include the suggested fix for each. Do not auto-rename — naming changes affect public APIs.

---

### Item 2 — TypeScript: Path Aliases

**What to check:** `tsconfig.json` → `compilerOptions.paths`. Verify `"@/*": ["./*"]` is present (or `["./src/*"]` if project uses `src/` layout).

**Pass:** `@/*` alias configured and matches project layout.
**Fail:** No `paths` key, or `@/*` missing.
**Warning:** Alias present but points to wrong root (e.g. says `./src/*` but no `src/` exists).

**Auto-fix:** Add the correct `paths` block. Also add `"baseUrl": "."` if missing.

After fixing, scan for deep relative imports (3+ levels: `../../..`) and list up to 10 examples with their suggested `@/` equivalent. Do not auto-convert imports — list them in the human-decisions section.

---

### Item 3 — Code Quality: type-check Script

**What to check:** `package.json` → `scripts`. Verify a script runs `tsc --noEmit`. Acceptable names: `type-check`, `typecheck`, `tsc`, `check`.

**Pass:** Script exists and runs `tsc --noEmit`.
**Fail:** No such script exists.

**Auto-fix:** Add `"type-check": "tsc --noEmit"` to `scripts` in `package.json`.

---

### Item 4 — Code Quality: Pre-commit Hook (lint + type-check)

**What to check:**
1. `husky` is in `package.json` devDependencies.
2. `.husky/pre-commit` file exists.
3. The hook runs at minimum: a lint command (`npm run lint`, `eslint`, or `biome check`) AND a type-check command (`npm run type-check`, `tsc --noEmit`).

**Pass:** All three conditions met.
**Fail:** Husky not installed, or `.husky/pre-commit` missing.
**Warning:** Husky installed but hook only runs one of lint/type-check (not both).

**Auto-fix (Husky not installed):**
- Add `"husky": "^9.0.0"` to devDependencies in `package.json`
- Add `"prepare": "husky"` to scripts
- Create `.husky/pre-commit`:
```sh
npm run lint && npm run type-check
```
- Note in the report: **Run `npm install && npm run prepare` once to activate hooks.**

**Auto-fix (hook too weak):** Rewrite `.husky/pre-commit` to include both commands.

---

### Item 5 — Code Quality: Commit Message Format Hook

**What to check:** `.husky/commit-msg` exists AND contains a regex that enforces structured commit message format (`<area>: <description>`). Look for pattern `^[a-z][a-z0-9/_-]*: .+` or a commitlint config.

**Pass:** Hook exists with format enforcement.
**Fail:** File missing or contains no enforcement.
**Warning:** File exists but is a no-op or contains only comments.

**Auto-fix:** Create or overwrite `.husky/commit-msg`:
```sh
#!/bin/sh
commit_msg=$(head -1 "$1")

# Allow merge and revert commits
if echo "$commit_msg" | grep -qE "^(Merge|Revert)"; then
  exit 0
fi

# Format: <area>: <description>  e.g. "auth: fix token refresh"
if ! echo "$commit_msg" | grep -qE "^[a-z][a-z0-9/_-]*: .+"; then
  echo ""
  echo "  Bad commit message: $commit_msg"
  echo ""
  echo "  Format: <area>: <what changed in plain English>"
  echo "  Examples:"
  echo "    auth: fix token refresh on mobile safari"
  echo "    ui: add skeleton loaders to feed page"
  echo "    data: update mock destinations to v2 schema"
  echo ""
  exit 1
fi
```

---

### Item 6 — Security: Open Redirect in API Routes

**What to check:** Scan all files in `app/api/` and `app/auth/` for `NextResponse.redirect()` calls. For each one, determine if the redirect target comes from user-controlled input (query params, request body, headers).

A redirect is **safe** if it:
- Redirects to a hardcoded string literal
- Validates the URL against an explicit allowlist of domains before redirecting
- Only uses the current request `origin` combined with a hardcoded path

A redirect is **unsafe** if it passes a user-supplied full URL directly to `NextResponse.redirect()` without validation.

**Pass:** No user-controlled redirects, or all have domain allowlists.
**Fail:** A `redirect()` accepts a full URL from query params or body without validation.
**Warning:** Redirect uses `${origin}${userPath}` — lower risk but path should be validated to start with `/`.

**Auto-fix (Warning case only):** If pattern is `NextResponse.redirect(\`${origin}${next}\`)` where `next` comes from a query param, insert a guard:
```typescript
const safePath = next.startsWith('/') ? next : '/';
return NextResponse.redirect(`${origin}${safePath}`);
```

**Human decision (Fail case):** List exact file:line. Do not auto-fix — adding a domain allowlist requires knowing which domains are legitimate for this project.

Example of the correct pattern to implement:
```typescript
const ALLOWED_HOSTS = ["www.yourdomain.com", "api.yourdomain.com"];

function isSafeDestination(raw: string): boolean {
  try {
    const url = new URL(raw);
    return url.protocol === "https:" && ALLOWED_HOSTS.includes(url.hostname);
  } catch {
    return false;
  }
}

if (!isSafeDestination(destination)) {
  return NextResponse.json({ error: "Invalid destination" }, { status: 400 });
}
```

---

### Item 7 — Config: .env.example + Secrets Exposure Check

**What to check:**

*A. .env.example exists and is populated:*
- `.env.example` file exists (not `.env`, not `.env.local`)
- Contains at least one variable definition

*B. Secrets exposure:*
- Scan all source files for `process.env.NEXT_PUBLIC_` references
- Flag any `NEXT_PUBLIC_` variable whose name contains: `SECRET`, `KEY`, `TOKEN`, `PASSWORD`, `PRIVATE`, `SIGNING` — these are server-only values being exposed to the browser

*C. .gitignore covers .env files:*
- `.env` and `.env.local` are in `.gitignore` (pattern `.env*` with `!.env.example` exception is ideal)

**Pass:** `.env.example` populated + no secrets exposed as NEXT_PUBLIC_ + .env gitignored.
**Fail:** `.env.example` missing.
**Warning:** `.env.example` exists but is empty, OR a potentially sensitive var is NEXT_PUBLIC_.

**Auto-fix:**
- Generate `.env.example` by scanning all source files for `process.env.X` references. List each unique variable with an empty value and a comment:
```
# Get from Supabase → Settings → API
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Server-only — never expose client-side
SUPABASE_SERVICE_ROLE_KEY=
```
- If `.env` pattern is missing from `.gitignore`, add `.env*` and `!.env.example` lines.

**Human decision:** List any `NEXT_PUBLIC_SECRET_*` or similar exposures with the variable name and the file where it appears. Fixing requires either renaming the variable (server-only) or confirming it is intentionally public.

---

### Item 8 — Config: Env Var Validation at Startup + Feature Flags

**What to check:**

*A. Env validation:*
- A file in `lib/` (commonly `lib/config.ts` or `lib/env.ts`) imports a validation library (Zod preferred) and parses `process.env` against a schema, throwing a clear error if required vars are missing.

*B. Feature flags:*
- Scan for any boolean-ish env var pattern (e.g. `NEXT_PUBLIC_FEATURE_*`, `ENABLE_*`, `FF_*`). If found, check whether they are validated in the config file.
- If none exist, note in the human-decisions section that a feature flag pattern is not yet established.

**Pass:** Config file exists with schema validation + throws on missing vars.
**Fail:** No validation file; env vars accessed raw throughout codebase.
**Warning:** Config file exists but does no validation (just re-exports process.env values).

**Auto-fix (if Zod is in dependencies):** Create `lib/config.ts`:
```typescript
import { z } from "zod";

const envSchema = z.object({
  // Auto-populated from scanning process.env references:
  // <detected variables added here>
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const missing = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
  throw new Error(`Missing or invalid environment variables: ${missing}`);
}

export const env = parsed.data;
```
Populate the schema from the process.env scan done in Item 7. Mark NEXT_PUBLIC_ vars as `z.string()` and server-only vars as `z.string().min(1).optional()` or required based on usage.

**Human decision (feature flags):** If no feature flag pattern exists, suggest:
```typescript
// In lib/config.ts — add to envSchema:
NEXT_PUBLIC_FEATURE_NEW_DASHBOARD: z.enum(["true", "false"]).default("false"),

// Usage:
const isNewDashboard = env.NEXT_PUBLIC_FEATURE_NEW_DASHBOARD === "true";
```
Note: human must decide which features need flags.

---

### Item 9 — Error Handling: Centralized Error Utilities

**What to check:**
1. A file exists (commonly `lib/errors.ts`) that exports typed error classes (`ValidationError`, `NotFoundError`, or similar extending `Error`).
2. A `getErrorMessage(error: unknown): string` function exported from the same file for safe message extraction from catch blocks.
3. Scan catch blocks in `app/` and `lib/` for the anti-pattern `(e as Error).message` — these bypass type safety.

**Pass:** Both exports exist + no `(e as Error).message` anti-pattern found.
**Fail:** Neither exists.
**Warning:** Utility exists but catch blocks in some files still use the unsafe cast.

**Auto-fix:** Create `lib/errors.ts` if missing:
```typescript
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = "NotFoundError";
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred";
}
```

**Human decision:** List each file:line that uses `(e as Error).message` — replacing these is safe but requires reading each catch block in context. Do not auto-replace.

---

### Item 10 — TypeScript: Shared Types + Branded Domain Types

**What to check:**
1. A `types/` directory exists at project root (or `src/types/`).
2. A `types/index.ts` barrel file exists that re-exports from all files in the directory.
3. Scan `components/` and `app/` for inline `type` or `interface` declarations used in more than one file — these belong in `types/`.
4. Check whether any domain identifiers (slugs, IDs, codes) use raw `string` where a branded type would catch misuse.

**Pass:** `types/` exists with barrel + no duplicated cross-file types.
**Fail:** No `types/` directory.
**Warning:** Directory exists but no barrel, OR types are duplicated across files.

**Auto-fix (missing barrel):** Scan existing `.ts` files in `types/` and generate `types/index.ts`:
```typescript
export type { Profile, Badge, SavedDestRow } from "./profile";
export type { Buddy } from "./buddy";
// etc — one line per exported type per file
```

**Human decision (branded types):** List domain identifiers that are raw `string` and could benefit from branding. Give concrete examples:
```typescript
// Before — easy to pass wrong string:
function getIntel(slug: string) { ... }

// After — compiler catches misuse:
type IntelSlug = string & { readonly _brand: "IntelSlug" };
type UserId = string & { readonly _brand: "UserId" };

function getIntel(slug: IntelSlug) { ... }
```
Human decides which identifiers to brand.

---

### Item 11 — Config: Centralized Constants (lib/constants.ts)

**What to check:**
1. `lib/constants.ts` exists (or `lib/constants/` directory).
2. Scan `app/` and `components/` for:
   - `Record<string, string>` lookup tables defined in page files
   - Static arrays of options used in multiple files
   - Magic strings repeated more than 3 times across files

**Pass:** `lib/constants.ts` exists and page files contain no duplicated lookup tables.
**Fail:** No `lib/constants.ts`; lookup tables scattered across page files.
**Warning:** File exists but some pages still contain local constants that should be centralized.

**Auto-fix:** Create `lib/constants.ts` scaffold if missing:
```typescript
// Centralized lookup tables and static configuration.
// Add domain-specific label maps, option lists, and magic strings here.

export const ROUTE_LABELS: Record<string, string> = {
  // e.g. "/intel": "Trip Intel"
};
```

**Human decision:** For each duplicated constant found, list the constant name, its current locations, and suggest the canonical export path. Human must decide which file's definition is authoritative before merging.

---

### Item 12 — Code Quality: Binary / Document Files Not in Git

**What to check:**
1. `git ls-files | grep -E '\.(xlsx|xls|pdf|doc|docx)$'` — office/binary files should not be tracked.
2. `git ls-files | grep " "` — filenames with spaces cause shell scripting issues.
3. `.gitignore` covers common binary extensions.

**Pass:** No binary office files tracked + no filenames with spaces + `.gitignore` covers binary types.
**Fail:** Binary files are tracked in git.
**Warning:** `.gitignore` has no patterns for common binary types.

**Auto-fix (.gitignore pattern only):** Add to `.gitignore`:
```
# Research and source documents — not part of the codebase
*.xlsx
*.xls
*.pdf
*.doc
*.docx
/research-source/
```

**Human decision (tracked binary files):** Never auto-run `git rm --cached` — list each tracked binary file and print the exact commands to run:
```bash
git rm --cached "filename.xlsx"
git commit -m "repo: stop tracking binary file filename.xlsx"
```

---

### Item 13 — Next.js: Image Component Used (no bare \<img\>)

**What to check:** Scan all `.tsx`/`.jsx` files for `<img ` tags (with trailing space, to avoid matching HTML entities). For each found, check the `src` value:
- `blob:` or `data:` prefix → legitimate exception, `<Image />` cannot handle these
- Any other value → should use `<Image />` from `next/image`

**Pass:** No `<img>` tags found (excluding blob:/data: exceptions).
**Fail:** `<img>` tags found that could use `<Image />`.
**Warning:** All `<img>` tags use blob: or data: src (acceptable, flag as informational).

**Auto-fix:** For each non-exception `<img>` tag:
1. Add `import Image from "next/image"` if not already imported.
2. Replace `<img src="..." alt="..." className="...">` with `<Image src="..." alt="..." width={X} height={X} className="...">`.
   - Extract width/height from inline style or className if present; otherwise use `width={800} height={600}` as a default and note in human-decisions that dimensions should be verified.
3. Check `next.config.ts` → `images.remotePatterns`. If the image src is an external URL whose hostname is not listed, add it.

For blob:/data: exceptions, add an inline eslint-disable comment:
```tsx
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src={blobUrl} alt="preview" />
```

---

### Item 14 — Docs: README.md + CLAUDE.md Present and Substantive

**What to check:**
1. `README.md` exists and is longer than 10 lines.
2. `README.md` contains at minimum: project name, one-sentence description, stack info, local setup instructions.
3. `CLAUDE.md` exists and is longer than 10 lines (this file is read by Claude Code at session start).

**Pass:** Both files exist and are substantive.
**Fail:** Either file is missing or fewer than 10 lines.
**Warning:** Files exist but are template placeholders or missing setup instructions.

**Auto-fix (README missing or stub):** Generate from `package.json` (name, dependencies) and directory scan:
```markdown
# <project-name>

<One-sentence description inferred from name and structure.>

## Stack

<Detected from package.json — Next.js version, key dependencies>

## Running locally

```bash
cp .env.example .env.local
# fill in your keys
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
```

**Auto-fix (CLAUDE.md missing):** Create a minimal scaffold:
```markdown
# CLAUDE.md

> Read by Claude Code at the start of every session. Keep it current.

## What this project is

<project-name> — <inferred from README or package.json>

## Stack

<Detected from package.json>

## Key conventions

- `npm run type-check` before committing
- `npm run lint` before committing
- Commit format: `<area>: <what changed>`
- All shared types live in `/types/`
- All environment variables validated in `lib/config.ts`

## What NOT to do

- Do not commit `.env` files
- Do not commit binary files (xlsx, pdf, etc.)
- Do not add `any` types — use `unknown` and narrow explicitly
```

**Human decision:** Generated stubs need project-specific conventions, team rules, and context filled in.

---

### Item 15 — Next.js: Live Service Calls Have Error Boundaries

**What to check:** Scan `app/` for files that import from a Supabase client, fetch from external APIs, or call third-party services. For each route segment found:
1. Does the segment directory contain an `error.tsx` file?
2. Does the page have a mock-data fallback or graceful degradation for when the service is unavailable?

**Pass:** All route segments with live calls have an `error.tsx` in their directory.
**Fail:** Route segments making live calls have no `error.tsx`.

**Auto-fix:** For each route segment with live calls but no `error.tsx`, create a minimal one:
```typescript
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 p-8 text-center">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
```

**Human decision:** If a live-call page has no mock-data fallback, list it with a note: "Consider switching this page to mock data for demo reliability." Do not auto-switch — that requires a product decision.

---

### Item 16 — Validation: Zod Data Schemas + Form + API Response Validation

**What to check:**

*A. Centralized data schemas:*
- `lib/schemas/` directory exists (or `lib/schemas.ts`)
- Each major data model has a Zod schema (not just env vars — actual domain models: posts, users, products, etc.)
- Types are inferred from schemas (`type Post = z.infer<typeof PostSchema>`) rather than maintained separately

*B. Form validation:*
- Scan for `onSubmit` handlers in `.tsx` files. For each, check whether the submitted data is parsed through a Zod schema before being sent to an API or inserted into state.

*C. API route validation:*
- Scan `app/api/` route handlers. For any route that reads `request.json()` or `searchParams`, check whether the input is validated with a Zod schema before being used.

**Pass:** `lib/schemas/` exists with domain schemas + forms validated + API inputs validated.
**Fail:** No schema directory; no form validation; no API input validation.
**Warning:** Partial coverage — schemas exist for some models but not all.

**Auto-fix:** Create `lib/schemas/index.ts` scaffold:
```typescript
import { z } from "zod";

// Add one schema per domain model. Infer TypeScript types from schemas.
// Example:
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  createdAt: z.string().datetime(),
});
export type User = z.infer<typeof UserSchema>;

// Common reusable schemas:
export const SlugSchema = z.string().regex(/^[a-z0-9-]+$/, "Invalid slug");
export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
```

**Human decision:** List each `onSubmit` handler and API route that has no validation. For each, suggest the appropriate schema to apply. Do not auto-add validation — schema shape depends on business logic.

---

### Item 17 — TypeScript: Branded Types for Domain Primitives

**What to check:** Scan function signatures in `lib/` and `app/api/` for parameters typed as raw `string` or `number` that represent domain identifiers (slugs, IDs, codes, tokens). These are candidates for branded types.

Look for parameter names containing: `id`, `slug`, `token`, `code`, `key`, `ref`, `handle`.

**Pass:** Domain identifiers use branded types or are clearly wrapped in validated schema types.
**Warning:** Multiple functions accept raw `string` for what are semantically distinct domain values.

**Human decision (always):** List each candidate with a branded type example. Human decides which ones to brand:
```typescript
// Branded type pattern — compiler catches accidental swaps:
type UserId = string & { readonly _brand: "UserId" };
type PostSlug = string & { readonly _brand: "PostSlug" };

// Helper to create branded values (only call after validation):
const asUserId = (s: string): UserId => s as UserId;

// Usage — compiler now prevents passing a PostSlug where UserId expected:
function getUser(id: UserId): Promise<User> { ... }
```

---

### Item 18 — Architecture: Folder Organization & Scaling Strategy

**What to check:** Audit the current folder structure against patterns that scale to 50+ pages:

1. **Thin pages:** Do `app/*/page.tsx` files contain business logic, or do they delegate to components/lib?
   - Good: page.tsx is <50 lines, mostly composition and data fetching
   - Bad: page.tsx contains inline validation, formatting logic, or state management

2. **Feature co-location:** Are related components, hooks, and utilities grouped by feature, or scattered?
   - Good: `components/feed/`, `components/auth/`, `components/intel/` — each feature self-contained
   - Bad: all components in flat `components/` with no grouping

3. **Server vs Client component split:** Are `"use client"` directives used minimally and correctly?
   - Good: only components that need browser APIs or event handlers are client components
   - Bad: `"use client"` at the top of page.tsx or layout.tsx, making entire subtrees client-rendered

4. **Shared vs feature components:** Is there a clear `components/ui/` (primitives) vs `components/<feature>/` (domain-specific) separation?

**Pass:** Pages are thin + feature-grouped + client boundary is tight.
**Warning:** Pages contain logic that belongs in lib/ or hooks.
**Fail:** Flat structure with no feature grouping.

**Human decision (always):** Print a structure recommendation based on what was found:
```
Recommended structure for scaling:
app/
  (features)/
    feed/page.tsx          ← thin: fetches + composes
    intel/[slug]/page.tsx  ← thin
  layout.tsx

components/
  ui/                      ← shadcn primitives only
  feed/                    ← FeedCard, FeedFilter, FeedSkeleton
  intel/                   ← IntelHero, SafetyScore, TransportGrid
  shared/                  ← Header, Footer, PageShell

lib/
  feed.ts                  ← data fetching + business logic
  intel.ts
  schemas/
  errors.ts
  config.ts

hooks/
  use-feed.ts              ← client-side data hooks
  use-auth.ts
```
Human decides the migration path.

---

### Item 19 — Code Quality: Linting Tool (ESLint vs Biome)

> **This item requires a clarifying question before the audit begins.** See Phase 0.

**What to check:**
- Is ESLint configured (`eslint.config.mjs` or `.eslintrc.*`)?
- Is Biome installed (`biome.json` or `@biomejs/biome` in devDependencies)?
- Is Prettier installed?

**If user chose Biome:**
- Check `biome.json` exists with linting and formatting enabled
- Check `package.json` scripts include `biome check` or `biome lint`
- Check pre-commit hook uses biome, not eslint

**If user chose Keep ESLint:**
- Check `eslint.config.mjs` exists and is non-trivial (not just default Next.js config)
- Check that `@typescript-eslint` is installed for TypeScript-aware rules
- Check `"no-explicit-any": "error"` is in the ESLint config

**Auto-fix (Biome chosen):**
1. Create `biome.json`:
```json
{
  "$schema": "https://biomejs.dev/schemas/1.6.0/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": { "recommended": true }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  }
}
```
2. Add to `package.json` scripts: `"lint": "biome check ."` and `"format": "biome format --write ."`
3. Note in report: run `npm install @biomejs/biome --save-dev` and remove ESLint packages.

**Auto-fix (Keep ESLint, strengthen it):**
Add to ESLint config if missing: `@typescript-eslint/no-explicit-any` rule set to `"error"`.

---

### Item 20 — Testing: Strategy Setup (Vitest / Jest)

**What to check:**
1. Does any test file exist? (`*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx`)
2. Is a test runner installed (`vitest`, `jest`, `@jest/core` in devDependencies)?
3. Does a test config exist (`vitest.config.ts`, `jest.config.ts`)?
4. Is there a `test` or `test:watch` script in `package.json`?

**Pass:** Test files exist + runner installed + config present + npm test script exists.
**Fail:** No tests at all.
**Warning:** Test runner installed but no test files, or no config.

**Auto-fix (no test runner):** Scaffold Vitest (recommended for Next.js + TypeScript):

Create `vitest.config.ts`:
```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      thresholds: { lines: 70, functions: 70, branches: 60 },
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

Create `tests/setup.ts`:
```typescript
import "@testing-library/jest-dom";
```

Create `tests/example.test.ts`:
```typescript
import { describe, it, expect } from "vitest";

describe("Example", () => {
  it("passes", () => {
    expect(1 + 1).toBe(2);
  });
});
```

Add to `package.json` scripts:
```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

**Human decision:** List what should be tested first based on the codebase scan:
- Lib utilities (pure functions in `lib/`) — easiest, highest ROI
- Zod schema validation logic
- API route handlers
- Component rendering (requires `@testing-library/react`)

Note: run `npm install vitest @vitejs/plugin-react @testing-library/jest-dom jsdom --save-dev` to install.

---

## Phase 3 — Apply Auto-Fixes

Skip this phase entirely if `--report-only` was passed as an argument.

Apply all auto-fixes identified in Phase 2, in this exact order (to avoid dependency conflicts):

**1. Config files first:**
- `tsconfig.json` — add missing strict flags, path aliases
- `package.json` — add type-check script, Biome/ESLint script updates, test scripts, Husky devDependency + prepare script

**2. New utility files:**
- `lib/config.ts` — env var validation scaffold
- `lib/errors.ts` — error class + getErrorMessage utility
- `lib/constants.ts` — scaffold with header comment
- `lib/schemas/index.ts` — Zod schema scaffold
- `vitest.config.ts` + `tests/setup.ts` + `tests/example.test.ts` — test scaffold

**3. Git and documentation files:**
- `.gitignore` — add binary file patterns + .env patterns
- `.env.example` — generate from process.env scan
- `README.md` — generate stub if missing/empty
- `CLAUDE.md` — generate stub if missing/empty

**4. Hooks:**
- `.husky/pre-commit` — create or strengthen
- `.husky/commit-msg` — create or strengthen
- `biome.json` — create if user chose Biome

**5. Code migrations (most risky, do last):**
- `<Image />` migrations — convert `<img>` tags one file at a time
- `error.tsx` scaffolds — create per route segment

For each fix applied, print:
```
→ Fixed: <what was changed> (<filename>)
```

If zero fixes were needed:
```
All auto-fixable items already passing. Nothing to change.
```

---

## Phase 4 — Final Report

Print the complete summary after all fixes are applied:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AUDIT SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ PASSING (<N> items)
  #1  TypeScript strict flags
  #3  type-check script
  ... (list each)

❌ FAILED — AUTO-FIXED (<N> items)
  #4  Pre-commit hooks → created .husky/pre-commit
  #7  .env.example → generated from process.env scan
  ... (list each with one-line description of fix applied)

⚠️ NEEDS YOUR DECISION (<N> items)
  #6  Open redirect — app/api/track-click/route.ts:34
      Action: Add domain allowlist. Which hosts should be allowed?

  #12 Binary files tracked in git — 13 files found
      Action: Run the following for each file:
        git rm --cached "filename.xlsx"
        git commit -m "repo: stop tracking binary file"

  #18 Folder organization — pages contain inline logic
      Action: Move logic from app/feed/page.tsx:45–89 to lib/feed.ts

  ... (each item: specific file:line + concrete instruction)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROJECT HEALTH SCORE: X / 20
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Scoring: +1 per item passing or auto-fixed
           +0 per item needing human decision
           N/A items excluded from denominator

  Next step: address ⚠️ items above, then re-run
  /project-architect to confirm the score improves.
```

---

## Edge Cases

Handle silently without asking the user:

- **Not Node.js:** `package.json` missing → print stop message, exit.
- **Not Next.js:** `next` not in dependencies → skip Items 6, 13, 15; mark them N/A; adjust denominator.
- **No git repo:** `.git` missing → skip Item 12; mark N/A.
- **`src/` monorepo layout:** `src/` exists but `app/` does not at root → all path checks apply inside `src/`; `@/*` alias should target `./src/*`.
- **tsconfig `extends`:** Check both the local file and the extended base for compiler flags. Only add flags to the local file.
- **pnpm:** `pnpm-lock.yaml` exists → replace all `npm install` instructions with `pnpm install`.
- **yarn:** `yarn.lock` exists → replace all `npm install` with `yarn`.
- **Read-only filesystem / CI:** If a write fails, print the file content to stdout instead: `"Could not write <file> — apply this manually:"` followed by the full file content.
- **Tests already exist:** If test files are found, score Item 20 as passing and report which framework was detected.
- **Existing CLAUDE.md or README.md that is substantive:** Never overwrite a file that passes the >10 line check. Only create when missing or stub when under 10 lines.
