CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "todo"
(
  "id"          uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "title"       varchar          NOT NULL,
  "completedAt" timestamptz      NULL,
  "createdAt"   timestamptz      NOT NULL DEFAULT now(),
  "updatedAt"   timestamptz      NOT NULL DEFAULT now()
);

CREATE INDEX "todoDatesIdx" ON "todo" ("createdAt", "updatedAt");
CREATE INDEX "todoTitleIdx" ON "todo" ("title");
CREATE INDEX "todoCompletedAtIdx" ON "todo" ("completedAt");

CREATE OR REPLACE VIEW "todoView"
AS
  SELECT id,
         coalesce("completedAt" < now(), FALSE)::boolean AS "isCompleted",
         title,
         "completedAt"
  FROM "todo";


CREATE TABLE "todoComment"
(
  "id"        uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "todo"      uuid             NOT NULL,
  "comment"   varchar          NOT NULL,
  "createdAt" timestamptz      NOT NULL DEFAULT now(),
  "updatedAt" timestamptz      NOT NULL DEFAULT now(),
  CONSTRAINT "todoCommentTodoFk" FOREIGN KEY ("todo") REFERENCES "todo" ("id") ON DELETE CASCADE
);

CREATE INDEX "todoCommentDatesIdx" ON "todoComment" ("createdAt", "updatedAt");
CREATE INDEX "todoCommentTodoIdx" ON "todoComment" ("todo");
