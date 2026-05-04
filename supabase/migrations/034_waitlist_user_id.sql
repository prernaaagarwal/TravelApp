-- 034_waitlist_user_id.sql
-- Link founding-membership waitlist rows to the user's auth account.
--
-- Why nullable:
--   1. Existing rows have no associated user
--   2. If the auth gate on /account/membership is ever loosened (so
--      anonymous visitors can also submit), we want their rows to still
--      be valid
--
-- ON DELETE SET NULL — deleting an auth user (account self-delete or
-- moderator action) preserves the historical waitlist row so we can
-- still email-contact the lead.

alter table founding_membership_waitlist
  add column if not exists user_id uuid references auth.users on delete set null;

create index if not exists founding_waitlist_user_id_idx
  on founding_membership_waitlist (user_id);
