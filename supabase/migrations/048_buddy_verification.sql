-- ─────────────────────────────────────────────────────────────────────────────
-- 048_buddy_verification.sql
-- V1 women-only verification: phone OTP + selfie-with-ID human review,
-- plus a 1-tap report → 2-flag auto-pause flow on Buddy profiles.
--
-- Additive only: no tables dropped, no columns dropped, no rows deleted.
-- buddy_matches.instagram_verified column is intentionally LEFT in place for
-- backward compatibility; new code paths read profiles.id_verified instead.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Profiles: verified + paused flags
alter table profiles
  add column if not exists id_verified boolean not null default false,
  add column if not exists is_paused   boolean not null default false,
  add column if not exists paused_at   timestamptz;

-- 2. Verification submission queue
create table if not exists user_verifications (
  user_id            uuid        primary key references profiles(id) on delete cascade,
  phone              text        not null,
  phone_verified_at  timestamptz,
  id_photo_path      text,                                       -- nulled on approval
  status             text        not null default 'pending'
                                check (status in ('pending', 'approved', 'rejected')),
  rejection_reason   text,
  reviewed_by        uuid        references profiles(id) on delete set null,
  reviewed_at        timestamptz,
  submitted_at       timestamptz not null default now(),
  created_at         timestamptz not null default now()
);

alter table user_verifications enable row level security;

create policy "Users read own verification" on user_verifications
  for select using (auth.uid() = user_id);

create policy "Users insert own verification" on user_verifications
  for insert with check (auth.uid() = user_id);

create policy "Users update own verification when pending" on user_verifications
  for update using (auth.uid() = user_id and status = 'pending');

create policy "Moderators read all verifications" on user_verifications
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role in ('moderator', 'admin'))
  );

create policy "Moderators update verifications" on user_verifications
  for update using (
    exists (select 1 from profiles where id = auth.uid() and role in ('moderator', 'admin'))
  );

-- 3. Buddy report queue (separate from generic user_reports — buddy-specific)
create table if not exists buddy_profile_reports (
  id                 uuid        primary key default gen_random_uuid(),
  reported_user_id   uuid        not null references profiles(id) on delete cascade,
  reporter_id        uuid        not null references profiles(id) on delete cascade,
  reason             text        not null,
  details            text,
  status             text        not null default 'pending'
                                check (status in ('pending', 'dismissed', 'actioned')),
  reviewed_by        uuid        references profiles(id) on delete set null,
  reviewed_at        timestamptz,
  created_at         timestamptz not null default now(),
  -- distinct-reporter guarantee for the auto-pause counter
  unique (reported_user_id, reporter_id)
);

create index if not exists buddy_profile_reports_target_status_idx
  on buddy_profile_reports (reported_user_id, status);

alter table buddy_profile_reports enable row level security;

create policy "Users insert buddy reports" on buddy_profile_reports
  for insert with check (auth.uid() = reporter_id);

create policy "Moderators read buddy reports" on buddy_profile_reports
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role in ('moderator', 'admin'))
  );

create policy "Moderators update buddy reports" on buddy_profile_reports
  for update using (
    exists (select 1 from profiles where id = auth.uid() and role in ('moderator', 'admin'))
  );

-- 4. Private storage bucket for ID photos
--    Mod-only read; user can write own folder. Strictly NOT public.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'id-verification',
  'id-verification',
  false,
  4194304,                                                       -- 4 MB
  array['image/jpeg', 'image/png', 'image/webp']
) on conflict (id) do nothing;

-- User can write into their own folder
create policy "Users upload own id photo"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'id-verification'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users update own id photo"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'id-verification'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users delete own id photo"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'id-verification'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Moderators read all ID photos (signed URL access for review)
create policy "Moderators read id photos"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'id-verification'
    and exists (select 1 from profiles where id = auth.uid() and role in ('moderator', 'admin'))
  );

-- Mods can also delete (used by approveVerification cleanup)
create policy "Moderators delete id photos"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'id-verification'
    and exists (select 1 from profiles where id = auth.uid() and role in ('moderator', 'admin'))
  );
