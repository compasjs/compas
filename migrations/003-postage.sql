CREATE TABLE "postage"
(
  "id"        uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "value"     int              NOT NULL,
  "images"    uuid             NOT NULL,
  "post"      uuid             NOT NULL,
  "createdAt" timestamptz      NOT NULL DEFAULT now(),
  "updatedAt" timestamptz      NOT NULL DEFAULT now(),
  "deletedAt" timestamptz      NULL,
  CONSTRAINT "postagePostFk" FOREIGN KEY ("post") REFERENCES "post" ("id") ON DELETE CASCADE,
  CONSTRAINT "postageImagesFk" FOREIGN KEY ("images") REFERENCES "fileGroup" ("id") ON DELETE CASCADE
);

CREATE INDEX "postageImagesIdx" ON "postage" ("images");
CREATE INDEX "postagePostIdx" ON "postage" ("post");
CREATE INDEX "postageDeletedAtIdx" ON "postage" ("deletedAt");
