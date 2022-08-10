CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE migration
(
  "namespace" varchar NOT NULL,
  "number"    int,
  "name"      varchar NOT NULL,
  "createdAt" timestamptz DEFAULT now(),
  "hash"      varchar
);

CREATE INDEX migration_namespace_number_idx ON "migration" ("namespace", "number");

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

CREATE TABLE "sessionStore"
(
  "id"        uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "checksum"  varchar          NOT NULL,
  "data"      jsonb            NOT NULL,
  "revokedAt" timestamptz      NULL,
  "createdAt" timestamptz      NOT NULL DEFAULT now(),
  "updatedAt" timestamptz      NOT NULL DEFAULT now()
);

CREATE TABLE "sessionStoreToken"
(
  "id"           uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "session"      uuid             NOT NULL,
  "expiresAt"    timestamptz      NOT NULL,
  "refreshToken" uuid             NULL,
  "revokedAt"    timestamptz      NULL,
  "createdAt"    timestamptz      NOT NULL,
  CONSTRAINT "sessionStoreTokenSessionFk" FOREIGN KEY ("session") REFERENCES "sessionStore" ("id") ON DELETE CASCADE,
  CONSTRAINT "sessionStoreTokenRefreshTokenFk" FOREIGN KEY ("refreshToken") REFERENCES "sessionStoreToken" ("id") ON DELETE CASCADE
);

CREATE INDEX "sessionStoreTokenSessionIdx" ON "sessionStoreToken" ("session");
CREATE INDEX "sessionStoreTokenRefreshTokenIdx" ON "sessionStoreToken" ("refreshToken");
