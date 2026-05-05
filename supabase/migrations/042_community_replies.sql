-- Community replies + the "Verified Answer" mechanic.
-- Lets a contributor mark a reply as verified, which pins it to the top of
-- the thread. Critical for safety threads where a naive answer can hurt.

create table if not exists community_replies (
  id                uuid        primary key default gen_random_uuid(),
  post_id           text        not null references community_posts(id) on delete cascade,
  author_id         uuid        references auth.users(id) on delete set null,
  author_name       text,
  content           text        not null check (length(content) between 2 and 2000),
  is_verified       boolean     not null default false,
  verified_at       timestamptz,
  verified_by_id    uuid        references auth.users(id) on delete set null,
  verified_by_name  text,
  status            text        not null default 'approved',
  created_at        timestamptz not null default now()
);

create index if not exists community_replies_post_id_idx
  on community_replies(post_id);
create index if not exists community_replies_verified_idx
  on community_replies(post_id, is_verified, created_at);

alter table community_replies enable row level security;

-- Anyone can read approved replies on approved posts.
drop policy if exists "Anyone reads approved replies" on community_replies;
create policy "Anyone reads approved replies" on community_replies
  for select using (status = 'approved');

-- Signed-in users can post their own replies.
drop policy if exists "Users insert own replies" on community_replies;
create policy "Users insert own replies" on community_replies
  for insert with check (auth.uid() = author_id);

-- Only contributors (a profile.username that matches a contributors.slug)
-- can flip is_verified. The server action also enforces this — RLS is the
-- defence in depth.
drop policy if exists "Contributors verify replies" on community_replies;
create policy "Contributors verify replies" on community_replies
  for update using (
    exists (
      select 1
        from profiles p
        join contributors c on c.slug = p.username
       where p.id = auth.uid()
    )
  );
