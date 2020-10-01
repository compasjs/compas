CREATE TABLE "settings"
(
  "id"        uuid PRIMARY KEY     DEFAULT uuid_generate_v4(),
  "name"      VARCHAR     NOT NULL,
  "value"     bool        NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  "deletedAt" timestamptz NULL
);

CREATE INDEX settings_name_idx ON "settings" ("name");
CREATE INDEX settings_deleted_at_idx ON "settings" ("deletedAt");
