CREATE TABLE "file"
(
  "id"            uuid PRIMARY KEY     DEFAULT uuid_generate_v4(),
  "bucketName"    VARCHAR     NOT NULL,
  "contentLength" INT         NOT NULL,
  "contentType"   VARCHAR     NOT NULL,
  "name"          VARCHAR     NOT NULL,
  "meta"          jsonb,
  "createdAt"     timestamptz NOT NULL DEFAULT now(),
  "updatedAt"     timestamptz NOT NULL DEFAULT now(),
  "deletedAt"     timestamptz NULL
);

CREATE INDEX file_id_bucket_idx ON "file" ("id", "bucketName");
CREATE INDEX file_deleted_at_idx ON "file" ("deletedAt");
