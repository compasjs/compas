CREATE TABLE "user"
(
  "id"        uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "email"     varchar          NOT NULL,
  "password"  varchar          NOT NULL,
  "createdAt" timestamptz      NOT NULL DEFAULT now(),
  "updatedAt" timestamptz      NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX "userEmailIdx" ON "user" ("email");
