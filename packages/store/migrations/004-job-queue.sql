CREATE TABLE "jobQueue"
(
  "id"          BIGSERIAL PRIMARY KEY,
  "isComplete"  bool        NOT NULL,
  "priority"    INT         NOT NULL,
  "scheduledAt" timestamptz NOT NULL DEFAULT now(),
  "name"        VARCHAR     NOT NULL,
  "data"        jsonb,
  "createdAt"   timestamptz NOT NULL DEFAULT now(),
  "updatedAt"   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX job_queue_search_idx ON "jobQueue" ("isComplete", "scheduledAt");
CREATE INDEX job_queue_name_idx ON "jobQueue" ("name");
CREATE INDEX job_queue_scheduled_at_idx ON "jobQueue" ("scheduledAt");
