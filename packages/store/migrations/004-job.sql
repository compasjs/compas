CREATE TABLE "job"
(
  "id"          BIGSERIAL PRIMARY KEY NOT NULL,
  "isComplete"  boolean               NOT NULL,
  "priority"    int                   NOT NULL,
  "name"        varchar               NOT NULL,
  "scheduledAt" timestamptz           NOT NULL DEFAULT now(),
  "data"        jsonb                 NOT NULL,
  "createdAt"   timestamptz           NOT NULL DEFAULT now(),
  "updatedAt"   timestamptz           NOT NULL DEFAULT now()
);

CREATE INDEX "jobIsCompleteScheduledAtIdx" ON "job" ("isComplete", "scheduledAt");
CREATE INDEX "jobNameIdx" ON "job" ("name");
CREATE INDEX "jobScheduledAtIdx" ON "job" ("scheduledAt");
