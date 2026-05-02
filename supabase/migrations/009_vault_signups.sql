-- 009: Vault signups — pre-launch interest form for WhatsApp Trip Vault

create table if not exists vault_signups (
  id               uuid default gen_random_uuid() primary key,
  email            text not null,
  phone            text not null,
  trip_destination text not null,
  travel_start     date,
  travel_end       date,
  created_at       timestamptz not null default now()
);

alter table vault_signups enable row level security;

-- No auth required — anyone can sign up for the vault waitlist
create policy "Anyone can insert vault signup" on vault_signups
  for insert with check (true);
