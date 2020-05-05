CREATE TABLE IF NOT EXISTS session_store
(
  id      VARCHAR     NOT NULL PRIMARY KEY,
  expires TIMESTAMPTZ NOT NULL,
  data    JSONB DEFAULT '{}'
);

CREATE INDEX session_store_expires ON session_store (expires);
