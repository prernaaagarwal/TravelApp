-- 019: Production moderation tooling
--   1. Rejection reasons stored on each submission table (visible in audit + email)
--   2. Audit metadata: who rejected, when, raw reason text
--   3. User ban fields on profiles, with helper view for submitter history
--   4. Moderation audit log table (every approve/reject/ban gets one row)
--
-- Idempotent.

-- ─── 1. Rejection reason columns ──────────────────────────────────────────
alter table community_posts
  add column if not exists rejection_reason text,
  add column if not exists moderated_by uuid references auth.users(id) on delete set null,
  add column if not exists moderated_at timestamptz;

alter table beware_reports
  add column if not exists rejection_reason text,
  add column if not exists moderated_by uuid references auth.users(id) on delete set null,
  add column if not exists moderated_at timestamptz;

alter table trip_submissions
  add column if not exists rejection_reason text,
  add column if not exists moderated_by uuid references auth.users(id) on delete set null,
  add column if not exists moderated_at timestamptz;

-- ─── 2. User ban fields on profiles ───────────────────────────────────────
alter table profiles
  add column if not exists is_banned boolean not null default false,
  add column if not exists banned_at timestamptz,
  add column if not exists ban_reason text,
  add column if not exists banned_by uuid references auth.users(id) on delete set null;

create index if not exists profiles_banned_idx
  on profiles (is_banned) where is_banned = true;

-- ─── 3. Moderation audit log ──────────────────────────────────────────────
-- Every approve/reject/ban writes one row. Append-only — no updates, no deletes.
create table if not exists moderation_audit_log (
  id              uuid primary key default gen_random_uuid(),
  actor_id        uuid not null references auth.users(id) on delete set null,
  action          text not null check (action in ('approve', 'reject', 'ban', 'unban')),
  target_type     text not null check (target_type in ('post', 'beware', 'trip', 'user')),
  target_id       text not null,
  reason          text,
  created_at      timestamptz not null default now()
);

create index if not exists moderation_audit_log_actor_idx   on moderation_audit_log (actor_id, created_at desc);
create index if not exists moderation_audit_log_target_idx  on moderation_audit_log (target_type, target_id);

alter table moderation_audit_log enable row level security;

-- Only admins read the audit log. Server actions use the service role to
-- write — no client-side write policy needed.
-- (The app-level admin check happens in app/admin/actions.ts via assertAdmin.)

-- ─── 4. Submitter history view ────────────────────────────────────────────
-- Aggregates a user's submission counts across all three tables. The
-- admin UI calls this to decide whether to ban repeat low-quality submitters.
create or replace view submitter_history as
select
  p.id                                                       as user_id,
  p.email                                                    as email,
  p.username                                                 as username,
  p.first_name                                               as first_name,
  p.is_banned                                                as is_banned,
  p.banned_at                                                as banned_at,
  p.ban_reason                                               as ban_reason,
  coalesce(post_stats.total,    0)                           as posts_total,
  coalesce(post_stats.approved, 0)                           as posts_approved,
  coalesce(post_stats.rejected, 0)                           as posts_rejected,
  coalesce(beware_stats.total,    0)                         as bewares_total,
  coalesce(beware_stats.approved, 0)                         as bewares_approved,
  coalesce(beware_stats.rejected, 0)                         as bewares_rejected,
  coalesce(trip_stats.total,    0)                           as trips_total,
  coalesce(trip_stats.approved, 0)                           as trips_approved,
  coalesce(trip_stats.rejected, 0)                           as trips_rejected
from profiles p
left join lateral (
  select count(*)                                                                as total,
         count(*) filter (where status = 'approved')                             as approved,
         count(*) filter (where status = 'rejected')                             as rejected
    from community_posts where author_id = p.id
) post_stats on true
left join lateral (
  select count(*)                                                                as total,
         count(*) filter (where status = 'approved')                             as approved,
         count(*) filter (where status = 'rejected')                             as rejected
    from beware_reports where reported_by_id = p.id
) beware_stats on true
left join lateral (
  select count(*)                                                                as total,
         count(*) filter (where status = 'approved')                             as approved,
         count(*) filter (where status = 'rejected')                             as rejected
    from trip_submissions where user_id = p.id
) trip_stats on true;
