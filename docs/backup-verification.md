# Backup Verification Runbook

> Run this once when you set up production, then quarterly. Takes ~30 minutes.
>
> Purpose: prove that Supabase backups are actually restorable. A backup
> you have never restored is not a backup — it's a hope.

## What Supabase backs up automatically

| Plan      | Frequency   | Retention | Type                        |
|-----------|-------------|-----------|-----------------------------|
| Free      | None        | None      | No automatic backup         |
| Pro       | Daily       | 7 days    | Logical (pg_dump)           |
| Pro + PITR| Continuous  | 7-28 days | Point-in-time recovery (WAL)|
| Team      | Daily       | 14 days   | Logical                     |
| Enterprise| Configurable| 30+ days  | Logical + PITR              |

**Action item:** confirm your project is on Pro or higher. Free tier has zero
backup. Enable Point-in-Time Recovery (PITR) in Project Settings → Add-ons if
your data is mission-critical.

## What is NOT covered by Supabase backups

- **Storage bucket files** (intel images, contributor photos, beware photos,
  user avatars). These are stored separately and are NOT in the Postgres backup.
  Mitigation: keep a second copy of `/public/images/intel/` in Git, or sync
  weekly to S3 / R2.
- **Auth users** are backed up (they live in `auth.users`), but the magic-link
  email templates and provider configs are NOT.

## Quarterly verification: full restore test (30 min)

The point is to actually restore a backup, not just look at the backup list
and trust it exists.

### Step 1 — Create a throwaway target project (5 min)
1. Supabase Dashboard → New Project → name it `wanderwomen-restore-test`
2. Use the cheapest region. Free tier is fine — this project will be deleted
   in 30 minutes.
3. Wait for the project to provision (~2 min).
4. Note the new project's connection string from Project Settings → Database.

### Step 2 — Download a backup from production (5 min)
1. Open the production project → Database → Backups.
2. Pick yesterday's daily backup.
3. Click `…` → Download (downloads as `.sql.gz`).
4. Decompress: `gunzip backup-2026-04-15.sql.gz`

### Step 3 — Restore into the throwaway project (10 min)
```bash
# Replace with the throwaway project's connection string
PGPASSWORD=<password> psql \
  -h <project>.supabase.co \
  -U postgres \
  -d postgres \
  -f backup-2026-04-15.sql
```

Watch for errors. A few harmless warnings about existing extensions are OK;
hard errors (constraint violations, missing tables) are not.

### Step 4 — Verify the data (10 min)
Run these checks against the throwaway project's SQL Editor. Each one should
return a non-zero count. If any return zero, the backup is incomplete.

```sql
-- Profiles restored
select count(*) from profiles;

-- Intel cards restored with hero images
select count(*) from intel_cards where hero_image_url is not null;

-- Approved trip submissions restored
select count(*) from trip_submissions where status = 'approved';

-- Approved beware reports restored
select count(*) from beware_reports where status = 'approved';

-- RLS policies restored
select count(*) from pg_policies where schemaname = 'public';

-- Storage bucket configs restored (the buckets, not the files)
select count(*) from storage.buckets;
```

Compare each count against the production values (run the same queries on
the production project). Mismatch > 5% means the backup is suspect — open
a Supabase support ticket.

### Step 5 — Smoke-test a known record (2 min)
Pick a specific intel card slug you know exists in production:

```sql
select slug, destination, hero_image_url, last_updated
from intel_cards
where slug = 'goa-india';
```

The hero_image_url should be a Supabase Storage URL. Open it in a browser —
it will 404, because the throwaway project's storage bucket has no files.
This is expected (files aren't in the SQL dump) and is a reminder to
maintain a separate file backup.

### Step 6 — Tear down (1 min)
Supabase Dashboard → throwaway project → Settings → Pause/Delete project.

### Step 7 — Log the result
Append to `/docs/backup-test-log.md`:

```
## 2026-04-15 — Quarterly backup test
- Source: prod backup from 2026-04-14
- Restored to: wanderwomen-restore-test
- Profiles count: 124 (prod: 125, diff: 1 row created during backup window — OK)
- Intel cards: 21 / 21
- Notes: Storage URLs return 404 in test project — expected. Reminder to
  set up automated S3 sync for intel-images bucket.
```

## Storage bucket backup (separate from Postgres backup)

The Postgres backup does NOT include uploaded files in Storage buckets. To
fully recover from a catastrophic failure you also need a copy of:

- `intel-images` bucket (~21 hero photos, ~20 MB)
- `contributor-photos` bucket
- `beware-photos` bucket (user-generated, grows over time)
- `user-photos` bucket (user-generated, grows over time)

### Option A — Manual quarterly download (cheapest)
```bash
# Use the supabase CLI (npm i -g supabase, then supabase login)
supabase storage download \
  --project-ref <prod-ref> \
  --bucket intel-images \
  --recursive \
  ./backups/intel-images-2026-Q2/
```

Repeat for each bucket. Tar the result and store in cold storage (S3 Glacier,
B2, or even Google Drive).

### Option B — Automated nightly sync to S3 (recommended for V1+)
Add a Supabase Edge Function on a daily cron that streams new bucket objects
to S3 / Cloudflare R2. Outside V0 scope but the right answer once the platform
has paying users.

## Recovery RTO / RPO targets

| Scenario                       | RPO     | RTO     | Notes                                  |
|--------------------------------|---------|---------|----------------------------------------|
| Single table corrupted         | 24 hrs  | 1 hr    | Restore single table from logical dump |
| Full database loss             | 24 hrs  | 4 hrs   | Spin up from latest daily backup       |
| Full database loss (with PITR) | 1 min   | 4 hrs   | PITR rolls forward through WAL         |
| Storage bucket loss            | 90 days | 2 hrs   | Restore from quarterly cold-storage    |

If any of these targets feel too lax, upgrade the Supabase plan or add a
secondary backup layer (e.g. nightly `pg_dump` to S3 via Edge Function).

## Quick reference

- Supabase project: `https://supabase.com/dashboard/project/<your-ref>/database/backups`
- Production project ref: `vykbvnkpfqfmcilovzsw`
- Backups download from: Project → Database → Backups (Pro plan)
- PITR enable: Project → Settings → Add-ons → Point in Time Recovery
