CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE migration
(
  "namespace" VARCHAR NOT NULL,
  "number"    INT,
  "name"      VARCHAR NOT NULL,
  "createdAt" timestamptz DEFAULT now(),
  "hash"      VARCHAR
);

CREATE INDEX migration_namespace_number_idx ON "migration" ("namespace", "number");
