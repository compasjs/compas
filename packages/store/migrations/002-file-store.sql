CREATE TABLE "fileStore"
(
  "id"            uuid PRIMARY KEY     DEFAULT uuid_generate_v4(),
  "bucketName"    VARCHAR     NOT NULL,
  "contentLength" INT         NOT NULL,
  "contentType"   VARCHAR     NOT NULL,
  "filename"      VARCHAR     NOT NULL,
  "createdAt"     timestamptz NOT NULL DEFAULT now(),
  "updatedAt"     timestamptz NOT NULL DEFAULT now(),
  "deletedAt"     timestamptz NULL
);

CREATE INDEX file_store_id_bucket_idx ON "fileStore" ("id", "bucketName");
CREATE INDEX file_store_deleted_at_idx ON "fileStore" ("deletedAt");
