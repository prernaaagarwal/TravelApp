-- 017: User profile photos
-- Adds photo_url to profiles + creates user-photos storage bucket

-- 1. Add photo_url column to profiles
alter table profiles
  add column if not exists photo_url text;

-- 2. User-facing photo upload bucket (max 2 MB, images only)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'user-photos',
  'user-photos',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
) on conflict (id) do nothing;

-- Public read
create policy "Public read user-photos"
  on storage.objects for select
  using (bucket_id = 'user-photos');

-- Each user can only upload/update/delete inside their own folder (user_id/)
create policy "Users upload own photo"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'user-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users update own photo"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'user-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users delete own photo"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'user-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
