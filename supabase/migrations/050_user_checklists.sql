-- Cloud-backed pre-book checklist + read-only share links.
--
-- Replaces the localStorage-only state in components/intel/PreBookChecklist.tsx
-- (key `checklist-{slug}`) with a per-user, per-destination row. Logged-out
-- users still fall through to localStorage; logged-in users get cross-device
-- persistence and the option to send a buddy a read-only URL.
--
-- Schema:
--   - one row per (user_id, destination_slug)
--   - checked_indexes is a sparse integer[] of which checklist items are
--     ticked. Stored by index (not by item text) because the source items[]
--     comes from intel_cards.pre_book_checklist and item ordering is stable.
--   - share_token is null until the user explicitly creates a share link.
--     When present, /checklist/[token] returns a read-only view via the
--     get_shared_checklist() RPC below.
--
-- RLS: users own their rows. Public reads of shared checklists go through
-- the SECURITY DEFINER RPC, which scopes by token + leaks only the columns
-- the read-only view needs (no user_id, no share_token).

create table if not exists public.user_checklists (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  destination_slug  text not null,
  checked_indexes   integer[] not null default '{}',
  share_token       text unique,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (user_id, destination_slug)
);

create index if not exists user_checklists_share_token_idx
  on public.user_checklists (share_token)
  where share_token is not null;

alter table public.user_checklists enable row level security;

drop policy if exists "users own checklists" on public.user_checklists;
create policy "users own checklists"
  on public.user_checklists
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Read-only RPC for the shared view. SECURITY DEFINER lets us bypass RLS
-- safely because we only return rows whose share_token exactly matches the
-- caller-supplied token, and we never expose user_id or share_token itself.
create or replace function public.get_shared_checklist(token text)
returns table (
  destination_slug      text,
  checked_indexes       integer[],
  updated_at            timestamptz,
  shared_by_first_name  text
)
language sql
security definer
set search_path = public, pg_temp
as $$
  select
    c.destination_slug,
    c.checked_indexes,
    c.updated_at,
    p.first_name as shared_by_first_name
  from public.user_checklists c
  left join public.profiles p on p.id = c.user_id
  where c.share_token = token
  limit 1;
$$;

grant execute on function public.get_shared_checklist(text) to anon, authenticated;

-- Auto-touch updated_at on every update so the share view shows fresh
-- "last updated" timestamps without us having to set it explicitly in the
-- server action.
create or replace function public.touch_user_checklists_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_user_checklists on public.user_checklists;
create trigger touch_user_checklists
  before update on public.user_checklists
  for each row execute function public.touch_user_checklists_updated_at();
