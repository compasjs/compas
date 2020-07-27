CREATE TABLE "list"
(
    "id"        UUID PRIMARY KEY     DEFAULT uuid_generate_v4(),
    "name"      VARCHAR     NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "listItem"
(
    "id"        UUID PRIMARY KEY     DEFAULT uuid_generate_v4(),
    "checked"   BOOL        NOT NULL,
    "value"     VARCHAR     NOT NULL,
    "list"      UUID        NOT NULL REFERENCES "list" ("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX list_item_checked_idx ON "listItem" ("checked");
CREATE INDEX list_item_list_idx ON "listItem" ("list");
