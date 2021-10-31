CREATE TABLE "sessionStore"
(
  "id"        uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "data"      jsonb            NOT NULL,
  "revokedAt" timestamptz      NULL,
  "createdAt" timestamptz      NOT NULL DEFAULT now(),
  "updatedAt" timestamptz      NOT NULL DEFAULT now()
);

CREATE TABLE "sessionStoreToken"
(
  "id"           uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  "session"      uuid             NOT NULL,
  "expiresAt"    timestamptz      NOT NULL,
  "refreshToken" uuid             NULL,
  "revokedAt"    timestamptz      NULL,
  "createdAt"    timestamptz      NOT NULL,
  CONSTRAINT "sessionStoreTokenSessionFk" FOREIGN KEY ("session") REFERENCES "sessionStore" ("id") ON DELETE CASCADE,
  CONSTRAINT "sessionStoreTokenRefreshTokenFk" FOREIGN KEY ("refreshToken") REFERENCES "sessionStoreToken" ("id") ON DELETE SET NULL
);

CREATE INDEX "sessionStoreTokenSessionIdx" ON "sessionStoreToken" ("session");
CREATE INDEX "sessionStoreTokenRefreshTokenIdx" ON "sessionStoreToken" ("refreshToken");
