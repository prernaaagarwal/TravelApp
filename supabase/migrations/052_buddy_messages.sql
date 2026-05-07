-- buddy_connections: real "Send hello" with optional intro message + recipient
-- accept/decline. Additive to migration 001 — preserves existing rows.
--
-- The flow:
--   1. Sender clicks "Send hello" → row inserted, recipient_decision='pending'
--   2. Email notifies recipient (sender's message NOT in email — they come to
--      /account/messages to read it; gives us moderation surface)
--   3. Recipient accepts (decision='accepted') or declines (decision='declined')
--   4. On accept, sender gets an email; both unlock visibility of each other's
--      first_name + home_city in the inbox
--
-- Why no separate buddy_messages table: V1 is single-shot intro only. Multi-
-- message threads need per-message moderation, blocking, retention — a 2-week
-- feature. The accept-only handoff lets women take the conversation to their
-- own trusted channel (WhatsApp/IG/email) once both have consented.

alter table buddy_connections
  add column if not exists message text,
  add column if not exists recipient_decision text not null default 'pending';

-- Length cap matches the textarea's maxLength. NULL message = "wave only".
alter table buddy_connections
  drop constraint if exists buddy_connections_message_length_check;
alter table buddy_connections
  add constraint buddy_connections_message_length_check
  check (message is null or char_length(message) <= 280);

alter table buddy_connections
  drop constraint if exists buddy_connections_decision_check;
alter table buddy_connections
  add constraint buddy_connections_decision_check
  check (recipient_decision in ('pending', 'accepted', 'declined'));

-- Recipient (looked up via to_match_id → buddy_matches.user_id) needs to read
-- their own pending hellos and update the decision. Sender-side select policy
-- from migration 001 stays untouched.
drop policy if exists "Recipients read connections to them" on buddy_connections;
create policy "Recipients read connections to them" on buddy_connections
  for select using (
    exists (
      select 1 from buddy_matches
      where buddy_matches.id = buddy_connections.to_match_id
        and buddy_matches.user_id = auth.uid()
    )
  );

drop policy if exists "Recipients update decision" on buddy_connections;
create policy "Recipients update decision" on buddy_connections
  for update using (
    exists (
      select 1 from buddy_matches
      where buddy_matches.id = buddy_connections.to_match_id
        and buddy_matches.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from buddy_matches
      where buddy_matches.id = buddy_connections.to_match_id
        and buddy_matches.user_id = auth.uid()
    )
  );

create index if not exists buddy_connections_to_match_pending_idx
  on buddy_connections (to_match_id)
  where recipient_decision = 'pending';
