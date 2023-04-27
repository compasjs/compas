CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "todo"
(
    "id" uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    "title" varchar NOT NULL,
    "completedAt" timestamptz NULL,
    "createdAt" timestamptz NOT NULL DEFAULT now(),
    "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX "todoDatesIdx" ON "todo" ("createdAt", "updatedAt");
CREATE INDEX "todoTitleIdx" ON "todo" ("title");
CREATE INDEX "todoCompletedAtIdx" ON "todo" ("completedAt");
