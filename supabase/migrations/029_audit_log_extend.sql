-- 021: Extend moderation_audit_log to cover bulk admin actions.
--
-- Adds two new action types ('import_create', 'import_update') and a new
-- target_type 'intel_card' so we can record per-row events from the bulk
-- intel-card importer. All existing rows remain valid because we only
-- expand the allowed set, never narrow it.

alter table moderation_audit_log
  drop constraint if exists moderation_audit_log_action_check;

alter table moderation_audit_log
  add  constraint moderation_audit_log_action_check
  check (action in ('approve', 'reject', 'ban', 'unban', 'import_create', 'import_update'));

alter table moderation_audit_log
  drop constraint if exists moderation_audit_log_target_type_check;

alter table moderation_audit_log
  add  constraint moderation_audit_log_target_type_check
  check (target_type in ('post', 'beware', 'trip', 'user', 'intel_card'));
