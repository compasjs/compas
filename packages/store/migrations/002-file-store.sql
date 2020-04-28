CREATE TABLE file_store
(
  id             UUID PRIMARY KEY,
  bucket_name    VARCHAR,
  content_length BIGINT,
  content_type   VARCHAR,
  filename       VARCHAR,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX file_store_id_bucket_idx ON file_store (id, bucket_name);
