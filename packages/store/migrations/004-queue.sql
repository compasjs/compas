CREATE TABLE job_queue
(
  id           BIGSERIAL PRIMARY KEY,
  is_complete  BOOL        DEFAULT FALSE,
  priority     INT         NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ,
  name         VARCHAR     NOT NULL,
  data         JSONB       NOT NULL
);

CREATE INDEX job_queue_search_idx ON job_queue (is_complete, scheduled_at);
CREATE INDEX job_queue_name_idx ON job_queue (name);
CREATE INDEX job_queue_updated_at ON job_queue (updated_at);
