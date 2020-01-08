-- create an enum that has buy, check availability, both
CREATE TYPE msg_action AS enum 'buy',
'check',
'both',
'yes',
'no',
'maybe'
-- drop columns for rsp_buy, rsp_both, rsp_check
ALTER TABLE msg
  DROP COLUMN check_available,
  DROP COLUMN buy,
  DROP COLUMN rsp_time,
  DROP COLUMN rsp_buy,
  DROP COLUMN rsp_both,
  DROP COLUMN rsp_check,
  -- create new column for rsp_type set to reference new enum
  ADD COLUMN msg_type msg_action;

-- and another generic one for the response for that called rsp
