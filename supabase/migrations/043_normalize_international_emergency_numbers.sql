-- Normalise emergency_numbers on the 6 international intel cards from the
-- legacy {label: number, ...} object shape to the canonical
-- [{label, number}, ...] array shape used by every other card.
--
-- Idempotent: the jsonb_typeof guard means a re-run on an already-normalised
-- row is a no-op.

update intel_cards
set emergency_numbers = (
  select jsonb_agg(jsonb_build_object('label', key, 'number', value))
  from jsonb_each_text(emergency_numbers)
)
where slug in (
  'tokyo-japan',
  'bangkok-thailand',
  'hanoi-vietnam',
  'dubai-uae',
  'seoul-south-korea',
  'paris-france'
)
and jsonb_typeof(emergency_numbers) = 'object';
