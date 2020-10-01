CREATE TABLE "sessionStore"
(
  "id"        uuid PRIMARY KEY     DEFAULT uuid_generate_v4(),
  "expires"   timestamptz NOT NULL,
  "data"      jsonb,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX session_store_expires_idx ON "sessionStore" ("expires");
