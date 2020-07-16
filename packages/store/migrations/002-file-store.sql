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
  "fileStoreId" UUID NOT NULL REFERENCES "fileStore" (id) ON DELETE CASCADE,
  "bucketName" VARCHAR NOT NULL,
  "contentLength" INT NOT NULL,
  "contentType" VARCHAR NOT NULL,
  "filename" VARCHAR NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX file_store_id_bucket_idx ON "fileStore" ("id", "bucketName");
