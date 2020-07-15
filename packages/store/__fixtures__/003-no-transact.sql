-- disable auto transaction
-- implicit requires that it can not run inside a transact block
CREATE INDEX CONCURRENTLY foo_idx ON "testTable" (value);
