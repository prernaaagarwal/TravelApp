-- buddy_matches: enforce one trip per user.
--
-- The /buddy register-trip flow uses upsert(..., { onConflict: 'user_id' })
-- so a user can update their existing trip in place. Postgres requires a
-- UNIQUE/PRIMARY KEY constraint on the column referenced by ON CONFLICT.
-- Without this, the upsert fails with:
--   "there is no unique or exclusion constraint matching the ON CONFLICT
--    specification"
--
-- Semantically correct too: a user has at most one active buddy_matches row
-- (their current trip).
--
-- This was applied directly to the live database on 2026-05-07 to unblock
-- trip registration; this file backfills source-of-truth so a fresh DB
-- restore reproduces the same state.

alter table buddy_matches
  add constraint buddy_matches_user_id_key unique (user_id);
