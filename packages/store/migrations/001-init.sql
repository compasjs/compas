CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE migrations (
  "namespace" VARCHAR NOT NULL,
  "number"    INT,
  "name"      VARCHAR NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "hash"      VARCHAR
);

CREATE UNIQUE INDEX namespace_number_idx ON "migrations" ("namespace", "number");
