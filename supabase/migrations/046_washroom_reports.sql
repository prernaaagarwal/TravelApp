-- Washroom reports on the Beware Board
--
-- Solo women travelling India have no reliable way to find a clean public
-- washroom mid-journey. Crowdsourcing the answer onto the Beware Board map
-- — same submission form, same moderation queue, same map — is the cheapest
-- way to ship genuine value. Different pin colour reflects state.
--
-- Three additive columns on beware_reports. No data migration needed:
-- existing rows default to report_type='scam' and the two washroom-only
-- columns stay null.

alter table beware_reports
  add column if not exists report_type text not null default 'scam'
    check (report_type in ('scam', 'washroom'));

alter table beware_reports
  add column if not exists washroom_type text
    check (washroom_type is null or washroom_type in (
      'public-toilet',
      'mall',
      'cafe',
      'petrol-pump',
      'metro-station',
      'sulabh',
      'hotel-lobby',
      'other'
    ));

alter table beware_reports
  add column if not exists washroom_state text
    check (washroom_state is null or washroom_state in (
      'usable',
      'poor',
      'unsafe'
    ));

-- Cross-field consistency: washroom rows must have washroom_type +
-- washroom_state; scam rows must have neither.
alter table beware_reports
  drop constraint if exists beware_reports_type_consistency;
alter table beware_reports
  add constraint beware_reports_type_consistency check (
    (report_type = 'scam'     and washroom_type is null and washroom_state is null) or
    (report_type = 'washroom' and washroom_type is not null and washroom_state is not null)
  );

-- Index for the map filter (show all washrooms in this city).
create index if not exists beware_reports_report_type_idx
  on beware_reports(report_type);
