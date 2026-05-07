# Nav-removal trigger — my recommendation

> Question: when should we remove `/buddy`, `/vault`, `/feed`, `/shop`,
> `/onboarding` from the main nav per `docs/strategy/wedge.md`?

## My recommendation: do it NOW, before the next investor meeting.

Specifically: **this week**, in one PR, ahead of the next pitch.

## Why now (not later)

Three reasons.

### 1. The nav IS the wedge story
A nav with 9 items is a kitchen-sink pitch. A nav with 4 items is a
focus pitch. Investors read the nav before the deck. Today, `/buddy`,
`/vault`, `/feed`, `/shop`, `/onboarding` together signal *we're a
platform doing six things*. The wedge memo says *we're an incident map
plus verified intel cards.* The nav has to match the memo or one of
them is lying.

### 2. The features still exist; they're just not surfaced
We're not deleting code. We're not deleting routes. Direct URLs still
work. We're un-linking from main nav. That's a 30-line change, fully
reversible in 10 minutes. The cost of doing it now is near-zero; the
cost of leaving it is "every investor I pitch sees the kitchen sink."

### 3. Doing it after the round is harder, not easier
Once you've taken capital with a "platform" pitch, retro-fitting a
"wedge" pitch contradicts your own deck. Cleaner to land the first
round on the focused story.

## Why founders typically delay this

The instinct is: *"What if a user finds value in `/feed`? What if a
beta tester wants `/buddy`? Removing it from nav reduces discovery."*

Counter:
- Today's traffic to those pages is < 5% of total session-page-views
  (verify in PostHog). Removing them from nav takes that to ~1%, not 0%.
- Beta testers with the URL still get there.
- New users get a clearer first impression — the more important metric.
- Once a feature is venture-funded and built out, it goes back in nav
  with confidence. This isn't permanent.

## The exact change to ship

Four hops:

### Step 1 — Identify the nav components

```bash
grep -rln "buddy\|vault\|feed\|shop\|onboarding" components/shared/*.tsx
grep -rln "buddy\|vault\|feed\|shop\|onboarding" app/layout.tsx
grep -rln "buddy\|vault\|feed\|shop\|onboarding" app/(marketing) 2>/dev/null
```

### Step 2 — Remove the links from primary nav, keep secondary discovery

The wedge nav becomes:

```
Home  ·  Explore  ·  Beware Board  ·  Community  ·  Account
```

`/feed`, `/buddy`, `/vault`, `/shop` move to footer-only links labeled
"More from Wander Women" — discoverable but not headline. `/onboarding`
becomes implicit (signup → segmentation flow rather than its own nav
item).

### Step 3 — Sweep landing-page CTAs

The Priya/Sara split CTA on `/` becomes a single Priya-anchored CTA.
Foreign-women content remains indexable but un-promoted (per wedge memo
section "Kill Sara as primary persona for V1").

### Step 4 — Update the build-status doc

Mark `/buddy`, `/vault`, `/feed`, `/shop`, `/onboarding` as "deferred
from main nav per wedge memo" in `docs/investor/build-status.md`. The
features are still live; only the surface area changes.

## What it looks like in the PR

```
Files changed:
  components/shared/Header.tsx              — nav links culled to 5
  components/shared/Footer.tsx              — added "More" footer section
  app/page.tsx                              — single Priya-anchored CTA
  docs/investor/build-status.md             — note nav removal
  docs/strategy/wedge.md                    — mark this trigger complete

Lines: ~30 modified, ~10 added.
PR title: "wedge: cull main nav to 5 items, defer non-wedge features"
PR body: links to docs/strategy/wedge.md
Time to ship: 1 hour.
```

## What I'd say in the next pitch

> "Last week we sharpened our nav to five items — Home, Explore,
> Beware Board, Community, Account. Buddy, Vault, Feed, and Shop are
> still live but not headline. The wedge is the Beware Board plus
> verified Intel Cards; everything else is deferred until the wedge
> hits 500 paid members. That decision is in the data room as
> `docs/strategy/wedge.md`."

That's a clean, focus-forward 30-second answer to *"is this a platform
or a wedge?"* — the most common skeptical investor question.

## Two variants if you want to be more conservative

### Variant A — Soft removal (less risky)
Remove from desktop nav only; keep mobile nav (mobile users typically
have higher feature-exploration tolerance). 50% of the impact.

### Variant B — Trigger-based delay
Only remove once user metrics confirm < 5% of sessions visit those
routes. Adds 4 weeks of measurement before action. Trade-off: 4 weeks
where every investor sees the kitchen-sink nav.

**My pick of the three:** the full removal, this week. Variant B's
"measure first" instinct is engineering-good, pitch-bad. The data isn't
going to change the answer.

## Ready when you say go

If you say yes, I'll:
1. Read the actual nav components (`components/shared/Header.tsx` or
   wherever the layout's nav is defined)
2. Make the ~30-line PR
3. Update `wedge.md` to mark this trigger complete
4. Update `build-status.md` to reflect the new nav surface
5. Push and report — typically 30 minutes of work end-to-end

Just say "ship the nav cull" and I'll do it.

## When NOT to do this

Skip the nav cull if any of the following are true:

- You have a paying customer base whose retention depends on these
  features (you don't yet — pre-revenue)
- You're about to launch one of these features as a campaign (you're
  not — wedge memo deferred all five)
- Your investor told you specifically they want to see all features
  prominent (unlikely — most ask for focus)

None of those apply today. The recommendation stands.
