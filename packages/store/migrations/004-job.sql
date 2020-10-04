CREATE TABLE "job"
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

CREATE INDEX job_search_idx ON "job" ("isComplete", "scheduledAt");
CREATE INDEX job_name_idx ON "job" ("name");
CREATE INDEX job_scheduled_at_idx ON "job" ("scheduledAt");
