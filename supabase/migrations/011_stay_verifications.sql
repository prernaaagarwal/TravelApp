-- Stay Verifications: AI-powered safety analysis of booking URLs
create table stay_verifications (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references profiles(id) on delete cascade,
  booking_url     text not null,
  platform        text,
  property_name   text,
  city            text,
  status          text not null default 'pending'
                  check (status in ('pending', 'analyzing', 'complete', 'failed')),
  risk_level      text check (risk_level in ('low', 'medium', 'high', 'critical')),
  analysis_json   jsonb,
  created_at      timestamptz not null default now(),
  completed_at    timestamptz
);

alter table stay_verifications enable row level security;

create policy "Users read own verifications" on stay_verifications
  for select using (auth.uid() = user_id);

create policy "Users insert verifications" on stay_verifications
  for insert with check (auth.uid() = user_id);

-- Service role (used by server actions) can update verifications
create policy "Service role updates verifications" on stay_verifications
  for update using (auth.uid() = user_id);
