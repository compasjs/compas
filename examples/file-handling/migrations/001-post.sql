CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE "file"
(
  "id"            uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "contentLength" int              NOT NULL,
  "bucketName"    varchar          NOT NULL,
  "contentType"   varchar          NOT NULL,
  "name"          varchar          NOT NULL,
  "meta"          jsonb            NOT NULL,
  "createdAt"     timestamptz      NOT NULL DEFAULT now(),
  "updatedAt"     timestamptz      NOT NULL DEFAULT now()
);

CREATE INDEX "fileBucketNameIdx" ON "file" ("bucketName");

CREATE TABLE "job"
(
  "id"             bigserial PRIMARY KEY NOT NULL,
  "isComplete"     boolean               NOT NULL,
  "priority"       int                   NOT NULL,
  "retryCount"     int                   NOT NULL DEFAULT 0,
  "name"           varchar               NOT NULL,
  "scheduledAt"    timestamptz           NOT NULL DEFAULT now(),
  "data"           jsonb                 NOT NULL,
  "handlerTimeout" int                   NULL,
  "createdAt"      timestamptz           NOT NULL DEFAULT now(),
  "updatedAt"      timestamptz           NOT NULL DEFAULT now()
);

CREATE INDEX "jobIsCompleteScheduledAtIdx" ON "job" ("isComplete", "scheduledAt");
CREATE INDEX "jobNameIdx" ON "job" ("name");
CREATE INDEX "jobScheduledAtIdx" ON "job" ("scheduledAt");
CREATE INDEX IF NOT EXISTS "jobIsCompleteUpdatedAt" ON "job" ("isComplete", "updatedAt") WHERE "isComplete" IS TRUE;


CREATE TABLE "post"
(
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "contents" varchar NOT NULL,
  "title" varchar NOT NULL,
  "headerImage" uuid NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  constraint "postHeaderImageFk" foreign key ("headerImage") references "file" ("id") ON DELETE SET NULL
);

CREATE INDEX "postDatesIdx" ON "post" ("createdAt", "updatedAt");
CREATE INDEX "postTitleIdx" ON "post" ("title");
