CREATE TABLE "session"
(
  "id"        uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "expires"   timestamptz      NOT NULL,
  "data"      jsonb            NOT NULL,
  "createdAt" timestamptz      NOT NULL DEFAULT now(),
  "updatedAt" timestamptz      NOT NULL DEFAULT now()
);

CREATE INDEX "sessionExpiresIdx" ON "session" ("expires");
