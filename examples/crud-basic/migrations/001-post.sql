CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "post"
(
  "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "contents" varchar NOT NULL,
  "title" varchar NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX "postDatesIdx" ON "post" ("createdAt", "updatedAt");
CREATE INDEX "postTitleIdx" ON "post" ("title");
