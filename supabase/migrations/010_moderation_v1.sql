-- ─────────────────────────────────────────────────────────────────────────────
-- 010_moderation_v1.sql
-- V1 moderation system: roles, notifications, report audit trail, RLS updates.
-- All changes are ADDITIVE — existing policies and triggers are untouched.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Role column on profiles ────────────────────────────────────────────────
alter table profiles
  add column if not exists role text not null default 'user'
  check (role in ('user', 'moderator', 'admin'));

-- ── 2. Audit columns on beware_reports ───────────────────────────────────────
-- status now supports 'pending' | 'approved' | 'rejected'
alter table beware_reports
  add column if not exists reviewed_by      uuid references profiles(id) on delete set null,
  add column if not exists reviewed_at      timestamptz,
  add column if not exists rejection_reason text;

-- ── 3. Notifications table ────────────────────────────────────────────────────
create table if not exists notifications (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        not null references profiles(id) on delete cascade,
  type              text        not null,
  title             text        not null,
  body              text        not null,
  read              bool        not null default false,
  related_report_id uuid        references beware_reports(id) on delete set null,
  created_at        timestamptz not null default now()
);

alter table notifications enable row level security;

create policy "Users read own notifications" on notifications
  for select using (auth.uid() = user_id);

-- Users can only mark their own notifications as read (update read column)
create policy "Users update own notifications" on notifications
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── 4. New RLS policies on beware_reports (additive — existing ones stay) ────

-- Moderators and admins can read ALL reports regardless of status
create policy "Moderators read all reports" on beware_reports
  for select using (
    exists (
      select 1 from profiles
      where id = auth.uid()
        and role in ('moderator', 'admin')
    )
  );

-- Users can always read their OWN reports (pending, approved, rejected)
create policy "Users read own reports" on beware_reports
  for select using (auth.uid() = reported_by_id);

-- Moderators and admins can update reports (approve / reject)
create policy "Moderators update reports" on beware_reports
  for update using (
    exists (
      select 1 from profiles
      where id = auth.uid()
        and role in ('moderator', 'admin')
    )
  );

-- ── 5. RLS on profiles — admin can update any profile's role ─────────────────
-- Existing "Users update own profile" policy is unchanged.
-- We add a separate admin-scoped update policy.
create policy "Admins update user roles" on profiles
  for update using (
    exists (
      select 1 from profiles
      where id = auth.uid()
        and role = 'admin'
    )
  );

-- ── 6. Trigger: notify reporter when status changes ───────────────────────────
create or replace function notify_reporter_on_status_change()
returns trigger
language plpgsql
security definer   -- runs as the function owner, bypassing RLS for the insert
set search_path = public
as $$
begin
  -- Only act when status actually changes
  if old.status is not distinct from new.status then
    return new;
  end if;

  if new.status = 'approved' and new.reported_by_id is not null then
    insert into notifications (user_id, type, title, body, related_report_id)
    values (
      new.reported_by_id,
      'report_approved',
      'Your report was approved',
      'Your report "' || new.title || '" is now live on the Beware Board.',
      new.id
    );
  end if;

  if new.status = 'rejected' and new.reported_by_id is not null then
    insert into notifications (user_id, type, title, body, related_report_id)
    values (
      new.reported_by_id,
      'report_rejected',
      'Your report needs revision',
      coalesce(
        new.rejection_reason,
        'Your report "' || new.title || '" was not approved. Edit and resubmit.'
      ),
      new.id
    );
  end if;

  return new;
end $$;

drop trigger if exists notify_on_report_status on beware_reports;
create trigger notify_on_report_status
  after update of status on beware_reports
  for each row execute function notify_reporter_on_status_change();

-- ── 7. Seed founding admin ────────────────────────────────────────────────────
-- Safe: only updates if the user already exists in auth.users.
-- Re-running this migration is idempotent.
update profiles
set role = 'admin'
where id = (
  select id from auth.users
  where email = 'prernatravels2@gmail.com'
  limit 1
);
