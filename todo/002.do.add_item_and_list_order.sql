--add columns for ordering of lists and items
ALTER TABLE lists
  ADD COLUMN list_order integer;

ALTER TABLE inventory
  ADD COLUMN item_order integer;

