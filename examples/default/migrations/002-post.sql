CREATE TABLE "post"
(
  "id"        uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "text"      varchar          NOT NULL,
  "title"     varchar          NOT NULL,
  "createdAt" timestamptz      NOT NULL DEFAULT now(),
  "updatedAt" timestamptz      NOT NULL DEFAULT now()
);

CREATE INDEX "postTitleIdx" ON "post" ("title");
