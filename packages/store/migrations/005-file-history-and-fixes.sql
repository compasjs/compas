CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE file_store
  ALTER COLUMN id SET DEFAULT uuid_generate_v4(),
  ALTER COLUMN bucket_name SET NOT NULL,
  ALTER COLUMN content_length SET NOT NULL,
  ALTER COLUMN content_type SET NOT NULL,
  ALTER COLUMN filename SET NOT NULL;

CREATE TABLE file_store_history
(
  file_store_id  UUID        NOT NULL REFERENCES file_store (id),
  bucket_name    VARCHAR     NOT NULL,
  content_length INT         NOT NULL,
  content_type   VARCHAR     NOT NULL,
  filename       VARCHAR     NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE session_store
  DROP COLUMN id CASCADE,
  ADD COLUMN id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
