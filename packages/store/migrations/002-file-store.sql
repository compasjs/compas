CREATE TABLE file_store
(
  id             UUID PRIMARY KEY,
  content_length BIGINT,
  content_type   VARCHAR,
  filename       VARCHAR,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
)
