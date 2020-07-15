CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "fileStore" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "bucketName" VARCHAR NOT NULL,
  "contentLength" INT NOT NULL,
  "contentType" VARCHAR NOT NULL,
  "filename" VARCHAR NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE "fileStoreHistory" (
  "fileStoreId" UUID NOT NULL REFERENCES "fileStore" (id),
  "bucketName" VARCHAR NOT NULL,
  "contentLength" INT NOT NULL,
  "contentType" VARCHAR NOT NULL,
  "filename" VARCHAR NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX file_store_bucket_name_idx ON "fileStore" ("bucketName");
CREATE INDEX file_store_created_at_idx ON "fileStore" ("createdAt");
CREATE INDEX file_store_updated_at_idx ON "fileStore" ("updatedAt");
CREATE INDEX file_store_id_bucket_idx ON "fileStore" ("id", "bucketName");
