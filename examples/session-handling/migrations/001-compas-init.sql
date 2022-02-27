-- Note that this is the minimal migration necessary for using sessions
-- It is however advised, to always migrate all entities, so any new migrations from Compas are easier to manage.

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
