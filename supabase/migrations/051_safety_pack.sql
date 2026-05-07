-- Safety Pack — V1 replacement for the never-shipped /vault WhatsApp bot.
--
-- One row per user: emergency contacts (jsonb array of {name, relationship,
-- phone}), current-trip details (destination, dates, stay info, booking
-- refs), and free-text notes. The /vault page lets the user fill this in,
-- "Print → Save as PDF" via the browser, or email it to a designated
-- person via Resend.
--
-- Compared to vault_purchases / vault_signups (which remain — the old
-- WhatsApp-bot waitlist still captures interest at the bottom of /vault),
-- safety_pack is the actual deliverable: real safety value, no monthly
-- per-message cost, no Twilio dep.

create table if not exists public.safety_pack (
  user_id              uuid primary key references auth.users(id) on delete cascade,
  emergency_contacts   jsonb not null default '[]'::jsonb,
  destination_slug     text,
  trip_start_date      date,
  trip_end_date        date,
  stay_name            text,
  stay_address         text,
  stay_phone           text,
  booking_ref          text,
  insurance_policy     text,
  insurance_helpline   text,
  notes                text,
  updated_at           timestamptz not null default now()
);

alter table public.safety_pack enable row level security;

drop policy if exists "users own safety pack" on public.safety_pack;
create policy "users own safety pack"
  on public.safety_pack
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.touch_safety_pack_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_safety_pack on public.safety_pack;
create trigger touch_safety_pack
  before update on public.safety_pack
  for each row execute function public.touch_safety_pack_updated_at();
