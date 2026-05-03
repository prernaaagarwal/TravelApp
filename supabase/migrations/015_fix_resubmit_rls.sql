-- ─────────────────────────────────────────────────────────────────────────────
-- 015_fix_resubmit_rls.sql
-- Adds the missing RLS policy that allows reporters to update their own
-- rejected reports back to pending status (resubmission).
-- Migration 010 only gave moderators/admins UPDATE rights — reporters were
-- silently blocked, causing resubmitReport() to update 0 rows without error.
-- ─────────────────────────────────────────────────────────────────────────────

create policy "Users resubmit own rejected reports" on beware_reports
  for update
  using  (auth.uid() = reported_by_id and status = 'rejected')
  with check (status = 'pending');
