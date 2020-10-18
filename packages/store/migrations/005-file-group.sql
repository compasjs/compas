CREATE TABLE "fileGroup"
(
  "id"        uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "order"     int              NOT NULL,
  "file"      uuid             NULL,
  "parent"    uuid             NULL,
  "name"      varchar          NULL,
  "meta"      jsonb            NOT NULL,
  "createdAt" timestamptz      NOT NULL DEFAULT now(),
  "updatedAt" timestamptz      NOT NULL DEFAULT now(),
  "deletedAt" timestamptz      NULL,
  -- Bother file and parent fields are optional, since we expect either one of them to exists
  -- However we still want to cascade hard deletes
  constraint "fileGroupFileFk" foreign key ("file")
    references "file" ("id")
    ON DELETE CASCADE,
  constraint "fileGroupParentFk" foreign key ("parent")
    references "fileGroup" ("id")
    ON DELETE CASCADE
);

CREATE INDEX "fileGroupFileIdx" ON "fileGroup" ("file");
CREATE INDEX "fileGroupParentIdx" ON "fileGroup" ("parent");
CREATE INDEX "fileGroupDeletedAtIdx" ON "fileGroup" ("deletedAt");
