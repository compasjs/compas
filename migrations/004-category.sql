CREATE TABLE "category"
(
  "id"        uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "label"     varchar          NOT NULL,
  "createdAt" timestamptz      NOT NULL DEFAULT now(),
  "updatedAt" timestamptz      NOT NULL DEFAULT now()
);

CREATE INDEX "categoryLabelIdx" ON "category" ("label");

CREATE TABLE "postCategory"
(
  "id"        uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "category"  uuid             NOT NULL,
  "post"      uuid             NOT NULL,
  "createdAt" timestamptz      NOT NULL DEFAULT now(),
  "updatedAt" timestamptz      NOT NULL DEFAULT now(),
  constraint "postCategoryPostFk" foreign key ("post")
    references "post" ("id")
    ON DELETE CASCADE,
  constraint "postCategoryCategoryFk" foreign key ("category")
    references "category" ("id")
    ON DELETE CASCADE
);

CREATE INDEX "postCategoryCategoryIdx" ON "postCategory" ("category");
CREATE INDEX "postCategoryPostIdx" ON "postCategory" ("post");


CREATE TABLE "categoryMeta"
(
  "id"            uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "postCount"     int              NOT NULL,
  "category"      uuid             NOT NULL,
  "isHighlighted" boolean          NULL,
  constraint "categoryMetaCategoryFk" foreign key ("category")
    references "category" ("id")
    ON DELETE CASCADE
);

CREATE INDEX "categoryMetaCategoryIdx" ON "categoryMeta" ("category");
CREATE INDEX "categoryMetaIsHighlightedIdx" ON "categoryMeta" ("isHighlighted");
