CREATE TABLE "sessionStore" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "expires" TIMESTAMPTZ NOT NULL,
    "data" JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX session_store_expires_idx ON "sessionStore" ("expires");
CREATE INDEX session_store_created_at_idx ON "sessionStore" ("createdAt");
CREATE INDEX session_store_updated_at_idx ON "sessionStore" ("updatedAt");
