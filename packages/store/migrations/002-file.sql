CREATE TABLE "file"
(
  "id"            uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "contentLength" int              NOT NULL,
  "bucketName"    varchar          NOT NULL,
  "contentType"   varchar          NOT NULL,
  "name"          varchar          NOT NULL,
  "meta"          jsonb            NOT NULL,
  "createdAt"     timestamptz      NOT NULL DEFAULT now(),
  "updatedAt"     timestamptz      NOT NULL DEFAULT now(),
  "deletedAt"     timestamptz      NULL
);

CREATE INDEX "fileBucketNameIdx" ON "file" ("bucketName");
CREATE INDEX "fileDeletedAtIdx" ON "file" ("deletedAt");
