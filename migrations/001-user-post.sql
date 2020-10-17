CREATE TABLE "user"
(
  "id"        uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "authKey"   varchar          NOT NULL,
  "email"     varchar          NOT NULL,
  "nickName"  varchar          NOT NULL,
  "createdAt" timestamptz      NOT NULL DEFAULT now(),
  "updatedAt" timestamptz      NOT NULL DEFAULT now(),
  "deletedAt" timestamptz      NULL
);

CREATE INDEX "userEmailIdx" ON "user" ("email");
CREATE INDEX "userDeletedAtIdx" ON "user" ("deletedAt");


CREATE TABLE "post"
(
  "id"        uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "writer"    uuid             NOT NULL,
  "body"      varchar          NOT NULL,
  "title"     varchar          NOT NULL,
  "createdAt" timestamptz      NOT NULL DEFAULT now(),
  "updatedAt" timestamptz      NOT NULL DEFAULT now(),
  "deletedAt" timestamptz      NULL,
  constraint "postWriterFk" foreign key ("writer") references "user" ("id") ON DELETE CASCADE
);

CREATE INDEX "postWriterIdx" ON "post" ("writer");
CREATE INDEX "postDeletedAtIdx" ON "post" ("deletedAt");
