-- ─────────────────────────────────────────────────────────────────────────────
-- 017_user_reports.sql
-- Community flagging: any member can report a user profile.
-- Moderators/admins review and can deactivate the account.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists user_reports (
  id                uuid        primary key default gen_random_uuid(),
  reported_user_id  uuid        not null references profiles(id) on delete cascade,
  reported_by_id    uuid        not null references profiles(id) on delete cascade,
  reason            text        not null,
  details           text,
  status            text        not null default 'pending'
                                check (status in ('pending', 'reviewed', 'dismissed')),
  reviewed_by       uuid        references profiles(id) on delete set null,
  reviewed_at       timestamptz,
  created_at        timestamptz not null default now(),
  -- one report per (reporter, reported) pair — prevents spam
  unique(reported_user_id, reported_by_id)
);

alter table user_reports enable row level security;

-- Any logged-in user can file a report
create policy "Users insert user reports" on user_reports
  for insert with check (auth.uid() = reported_by_id);

-- Moderators/admins read all flags
create policy "Moderators read user reports" on user_reports
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role in ('moderator', 'admin'))
  );

-- Moderators/admins can update status (reviewed / dismissed)
create policy "Moderators update user reports" on user_reports
  for update using (
    exists (select 1 from profiles where id = auth.uid() and role in ('moderator', 'admin'))
  );
