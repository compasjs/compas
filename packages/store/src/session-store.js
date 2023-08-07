import {
  AppError,
  eventStart,
  eventStop,
  isNil,
  newEventFromEvent,
  uuid,
} from "@compas/stdlib";
import { crc32 } from "crc";
import { createSign, createVerify } from "jws";
import { querySessionStore } from "./generated/database/sessionStore.js";
import { querySessionStoreToken } from "./generated/database/sessionStoreToken.js";
import { queries } from "./generated.js";
import { query } from "./query.js";
import { queueWorkerAddJob } from "./queue-worker.js";

/**
 * @template T
 * @typedef {import("@compas/stdlib").Either<T, AppError>} Either
 */

/**
 * @typedef {object} SessionStoreSettings
 * @property {number} accessTokenMaxAgeInSeconds
 * @property {number} refreshTokenMaxAgeInSeconds
 * @property {string} signingKey
 */

/**
 * @type {number}
 */
const REFRESH_TOKEN_GRACE_PERIOD_IN_MS = 15 * 1000;

/**
 * @type {string}
 */
export const SESSION_STORE_POTENTIAL_LEAKED_SESSION_JOB_NAME = `compas.sessionStore.potentialLeakedSession`;

/**
 * Store a new session, and returns a access & refresh token pair
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("postgres").Sql<{}>} sql
 * @param {SessionStoreSettings} sessionSettings
 * @param {any} sessionData
 * @returns {Promise<Either<{
 *   accessToken: string,
 *   refreshToken: string,
 * }>>}
 */
export async function sessionStoreCreate(
  event,
  sql,
  sessionSettings,
  sessionData,
) {
  eventStart(event, "sessionStore.create");

  const validateResult = validateSessionStoreSettings(sessionSettings);
  if (validateResult.error) {
    eventStop(event);
    return validateResult;
  }

  const [session] = await queries.sessionStoreInsert(sql, {
    data: sessionData,
    checksum: sessionStoreChecksumForData(sessionData),
  });

  const tokens = await sessionStoreCreateTokenPair(
    newEventFromEvent(event),
    sql,
    sessionSettings,
    session,
  );

  eventStop(event);

  return tokens;
}

/**
 * Get a session from the provided access token string
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("postgres").Sql<{}>} sql
 * @param {SessionStoreSettings} sessionSettings
 * @param {string} [accessTokenString]
 * @returns {Promise<Either<{session:
 *   import("./generated/common/types.d.ts").QueryResultStoreSessionStore}>>}
 */
export async function sessionStoreGet(
  event,
  sql,
  sessionSettings,
  accessTokenString,
) {
  eventStart(event, "sessionStore.get");

  const validateResult = validateSessionStoreSettings(sessionSettings);
  if (validateResult.error) {
    eventStop(event);
    return validateResult;
  }

  const token = await sessionStoreVerifyAndDecodeJWT(
    newEventFromEvent(event),
    sessionSettings,
    accessTokenString,
  );

  if (token.error) {
    eventStop(event);
    return token;
  }

  // Force usage of access token
  if (isNil(token.value.payload.compasSessionAccessToken)) {
    eventStop(event);
    return {
      error: AppError.validationError(`${event.name}.invalidAccessToken`),
    };
  }

  const [storeToken] = await querySessionStoreToken({
    session: {},
    where: {
      id: token.value.payload.compasSessionAccessToken,

      // access tokens reference the refresh token, and if not the refresh token is
      // invalidated
      refreshTokenIsNotNull: true,
    },
  }).exec(sql);

  if (isNil(storeToken)) {
    eventStop(event);
    return {
      error: AppError.validationError(`${event.name}.invalidSession`),
    };
  }

  // Check if either the session or access token is revoked.
  // Note that we don't have a grace period for these tokens, like we have for refresh
  // tokens
  if (
    // @ts-ignore
    storeToken.session.revokedAt ||
    (storeToken.revokedAt && storeToken.revokedAt.getTime() < Date.now())
  ) {
    eventStop(event);
    return {
      error: AppError.validationError(`${event.name}.revokedToken`),
    };
  }

  eventStop(event);

  return {
    value: {
      // @ts-ignore
      session: storeToken.session,
    },
  };
}

/**
 * Update the session. Expects `session.id`, `session.hash` and `session.data` to exist.
 * If the hash of the data is the same as `hash`, this function call is ignored.
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("postgres").Sql<{}>} sql
 * @param {import("./generated/common/types.d.ts").QueryResultStoreSessionStore} session
 * @returns {Promise<Either<void>>}
 */
export async function sessionStoreUpdate(event, sql, session) {
  eventStart(event, "sessionStore.update");

  if (isNil(session?.id) || typeof session?.checksum !== "string") {
    eventStop(event);
    return {
      error: AppError.validationError(`${event.name}.invalidSession`),
    };
  }

  // If the checksum is the same, we must have the same input, and thus can skip an
  // update.
  const checksum = sessionStoreChecksumForData(session.data);
  if (checksum === session.checksum) {
    eventStop(event);
    return {
      value: undefined,
    };
  }

  await queries.sessionStoreUpdate(sql, {
    update: {
      data: session.data,
      checksum,
    },
    where: {
      id: session.id,
    },
  });

  eventStop(event);

  return {
    value: undefined,
  };
}

/**
 * Revoke all tokens related to the session
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("postgres").Sql<{}>} sql
 * @param {import("./generated/common/types.d.ts").QueryResultStoreSessionStore} session
 * @returns {Promise<Either<void>>}
 */
export async function sessionStoreInvalidate(event, sql, session) {
  eventStart(event, "sessionStore.invalidate");

  if (isNil(session?.id)) {
    eventStop(event);
    return {
      error: AppError.validationError(`${event.name}.invalidSession`),
    };
  }

  // Revoke the full session, else the refresh token can still be used in the grace
  // period.
  await queries.sessionStoreUpdate(sql, {
    update: {
      revokedAt: new Date(),
    },
    where: {
      id: session.id,
      $raw: query`ss."revokedAt" IS NULL`,
    },
  });

  // Revoke all tokens that are not revoked yet.
  await queries.sessionStoreTokenUpdate(sql, {
    update: {
      revokedAt: new Date(),
    },
    where: {
      session: session.id,
      revokedAtIsNull: true,
    },
  });

  eventStop(event);

  return {
    value: undefined,
  };
}

/**
 * Get a new token pair.
 * - Revokes the old pair.
 * - Allows for a grace period on the refresh token
 * - If a refresh token is reused outside the of the grace period, all tokens are revoked
 * and an `compas.store.sessionHijackDetected` event is created.
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("postgres").Sql<{}>} sql
 * @param {SessionStoreSettings} sessionSettings
 * @param {string} [refreshTokenString]
 * @returns {Promise<Either<{
 *   accessToken: string,
 *   refreshToken: string,
 * }>>}
 */
export async function sessionStoreRefreshTokens(
  event,
  sql,
  sessionSettings,
  refreshTokenString,
) {
  eventStart(event, "sessionStore.refreshTokens");

  const validateResult = validateSessionStoreSettings(sessionSettings);
  if (validateResult.error) {
    eventStop(event);
    return validateResult;
  }

  const token = await sessionStoreVerifyAndDecodeJWT(
    newEventFromEvent(event),
    sessionSettings,
    refreshTokenString,
  );

  if (token.error) {
    eventStop(event);
    return token;
  }

  // Force usage of refresh token
  if (isNil(token.value.payload.compasSessionRefreshToken)) {
    eventStop(event);
    return {
      error: AppError.validationError(`${event.name}.invalidRefreshToken`),
    };
  }

  const [storeToken] = await querySessionStoreToken({
    session: {},
    accessToken: {},
    where: {
      id: token.value.payload.compasSessionRefreshToken,
      refreshTokenIsNull: true,
    },
  }).exec(sql);

  if (isNil(storeToken)) {
    eventStop(event);
    return {
      error: AppError.validationError(`${event.name}.invalidSession`),
    };
  }

  // Check if the session or refresh token is revoked. Uses a grace period on the refresh
  // token. This way the api client can have race conditions, and thus in the end have
  // multiple valid access tokens.
  if (
    // @ts-ignore
    storeToken.session.revokedAt ||
    (storeToken.revokedAt &&
      storeToken.revokedAt.getTime() + REFRESH_TOKEN_GRACE_PERIOD_IN_MS <
        Date.now())
  ) {
    // @ts-ignore
    if (isNil(storeToken.session.revokedAt)) {
      await sessionStoreReportAndRevokeLeakedSession(
        newEventFromEvent(event),
        sql,
        // @ts-ignore
        storeToken.session.id,
      );
    }

    eventStop(event);
    return {
      error: AppError.validationError(`${event.name}.revokedToken`),
    };
  }

  // Revoke both refresh and access token.
  await queries.sessionStoreTokenUpdate(sql, {
    update: {
      revokedAt: new Date(),
    },
    where: {
      // @ts-ignore
      idIn: [storeToken.id, storeToken.accessToken.id],
    },
  });

  const tokens = await sessionStoreCreateTokenPair(
    newEventFromEvent(event),
    sql,
    sessionSettings, // @ts-ignore
    storeToken.session,
  );

  eventStop(event);

  return tokens;
}

/**
 * Cleanup tokens that are expired / revoked longer than 'maxRevokedAgeInDays' days ago.
 * Also removes the session if no tokens exist anymore.
 * Note that when tokens are removed, Compas can't detect refresh token reuse, which
 * hints on session stealing. A good default may be 45 days.
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("postgres").Sql<{}>} sql
 * @param {number} maxRevokedAgeInDays
 * @returns {Promise<void>}
 */
export async function sessionStoreCleanupExpiredSessions(
  event,
  sql,
  maxRevokedAgeInDays,
) {
  eventStart(event, "sessionStore.cleanupExpiredSessions");

  const d = new Date();
  d.setDate(d.getDate() - maxRevokedAgeInDays);

  // Note that we only remove tokens where the 'refreshToken' is null, which means that
  // these tokens are refresh tokens. We use these since they should have a longer expiry
  // date.
  await queries.sessionStoreTokenDelete(sql, {
    $or: [
      {
        expiresAtLowerThan: d,
        refreshTokenIsNull: true,
      },
      {
        revokedAtLowerThan: d,
        refreshTokenIsNull: true,
      },
    ],
  });

  // Remove sessions without access tokens & thus no refresh tokens.
  await queries.sessionStoreDelete(sql, {
    accessTokensNotExists: {},
  });

  eventStop(event);
}

/**
 * Format and report a potential leaked session.
 * Revoking all tokens of that session in the process.
 * Reports it via `compas.sessionStore.potentialLeakedSession` job.
 * Note that there may be some overlap in tokens, since we allow a grace period in which
 * another refresh token can be acquired. So if the client has some kind of race
 * condition, the backend doesn't trip over it.
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("postgres").Sql<{}>} sql
 * @param {string} sessionId
 * @returns {Promise<void>}
 */
export async function sessionStoreReportAndRevokeLeakedSession(
  event,
  sql,
  sessionId,
) {
  eventStart(event, "sessionStore.reportAndRevokeLeakedSession");

  const [session] = await querySessionStore({
    where: {
      id: sessionId,
    },
    accessTokens: {
      where: {
        refreshTokenIsNotNull: true,
      },
    },
  }).exec(sql);

  // Not sure what kind of structure we need, and not sure if we should use a job for
  // this. But let's just keep it as is for now.
  const report = {
    session: {
      id: session.id,
      revokedAt: session.revokedAt ?? new Date(),
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      tokens: [],
    },
  };

  for (const accessToken of session.accessTokens ?? []) {
    // @ts-ignore
    report.session.tokens.push({
      // @ts-ignore
      id: accessToken.id, // @ts-ignore
      createdAt: accessToken.createdAt, // @ts-ignore
      revokedAt: accessToken.revokedAt, // @ts-ignore
      expiresAt: accessToken.expiresAt,
    });
  }

  await queueWorkerAddJob(sql, {
    name: SESSION_STORE_POTENTIAL_LEAKED_SESSION_JOB_NAME,
    data: {
      report,
    },
  });

  await sessionStoreInvalidate(newEventFromEvent(event), sql, session);

  eventStop(event);
}

/**
 * Create a new token pair for the provided session
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("postgres").Sql<{}>} sql
 * @param {SessionStoreSettings} sessionSettings
 * @param {import("./generated/common/types.d.ts").QueryResultStoreSessionStore} session
 * @returns {Promise<Either<{
 *   accessToken: string,
 *   refreshToken: string
 * }>>}
 */
export async function sessionStoreCreateTokenPair(
  event,
  sql,
  sessionSettings,
  session,
) {
  eventStart(event, "sessionStore.createTokenPair");

  const validateResult = validateSessionStoreSettings(sessionSettings);
  if (validateResult.error) {
    eventStop(event);
    return validateResult;
  }

  const accessTokenId = uuid();
  const refreshTokenId = uuid();

  const accessTokenExpireDate = new Date();
  const refreshTokenExpireDate = new Date();

  accessTokenExpireDate.setSeconds(
    accessTokenExpireDate.getSeconds() +
      sessionSettings.accessTokenMaxAgeInSeconds,
  );
  refreshTokenExpireDate.setSeconds(
    refreshTokenExpireDate.getSeconds() +
      sessionSettings.refreshTokenMaxAgeInSeconds,
  );

  await queries.sessionStoreTokenInsert(
    sql,
    [
      {
        id: refreshTokenId,
        session: session.id,
        expiresAt: refreshTokenExpireDate,
        createdAt: new Date(),
      },
      {
        id: accessTokenId,
        session: session.id,
        expiresAt: accessTokenExpireDate,
        refreshToken: refreshTokenId,
        createdAt: new Date(),
      },
    ],
    { withPrimaryKey: true },
  );

  const [accessToken, refreshToken] = await Promise.all([
    sessionStoreCreateJWT(
      newEventFromEvent(event),
      sessionSettings,
      "compasSessionAccessToken",
      accessTokenId,
      accessTokenExpireDate,
    ),
    sessionStoreCreateJWT(
      newEventFromEvent(event),
      sessionSettings,
      "compasSessionRefreshToken",
      refreshTokenId,
      refreshTokenExpireDate,
    ),
  ]);

  if (accessToken.error) {
    eventStop(event);
    return accessToken;
  }

  if (refreshToken.error) {
    eventStop(event);
    return refreshToken;
  }

  eventStop(event);

  return {
    value: {
      accessToken: accessToken.value,
      refreshToken: refreshToken.value,
    },
  };
}

/**
 * Create and sign a nwe JWT token
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {SessionStoreSettings} sessionSettings
 * @param {"compasSessionAccessToken"|"compasSessionRefreshToken"} type
 * @param {string} value
 * @param {Date} expiresAt
 * @returns {Promise<Either<string>>}
 */
export function sessionStoreCreateJWT(
  event,
  sessionSettings,
  type,
  value,
  expiresAt,
) {
  eventStart(event, "sessionStore.createJWT");

  return new Promise((resolve) => {
    createSign({
      header: {
        alg: "HS256",
        typ: "JWT",
      },
      secret: sessionSettings.signingKey,
      payload: {
        exp: Math.floor(expiresAt.getTime() / 1000),
        [type]: value,
      },
    })
      .once("error", (err) => {
        eventStop(event);
        // Wrap unexpected errors, they are most likely a Compas or related backend bug.
        resolve({ error: AppError.serverError({}, err) });
      })
      .once("done", function (signature) {
        eventStop(event);
        resolve({
          value: signature,
        });
      });
  });
}

/**
 * Verify and decode a JWT token
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {SessionStoreSettings} sessionSettings
 * @param {string} [tokenString]
 * @returns {Promise<Either<{
 *   header: object,
 *   payload: {
 *     exp: number,
 *     compasSessionAccessToken?: string,
 *     compasSessionRefreshToken?: string,
 *   },
 * }>>}
 */
export async function sessionStoreVerifyAndDecodeJWT(
  event,
  sessionSettings,
  tokenString,
) {
  eventStart(event, "sessionStore.verifyAndDecodeJWT");

  if (isNil(tokenString)) {
    eventStop(event);

    return {
      error: AppError.validationError(`${event.name}.missingToken`),
    };
  }

  if (typeof tokenString !== "string") {
    eventStop(event);

    return {
      error: AppError.validationError(`${event.name}.missingToken`),
    };
  }

  tokenString = tokenString.trim();

  // Arbitrary length check, jws verify checks the contents but expects 3 parts for a valid JWT
  if (tokenString.length < 6 || tokenString.split(".").length !== 3) {
    eventStop(event);

    return {
      error: AppError.validationError(`${event.name}.missingToken`),
    };
  }

  const { value, error } = await new Promise((resolve) => {
    createVerify({
      signature: tokenString,
      secret: sessionSettings.signingKey,
      algorithm: "HS256",
    })
      .once("error", (error) => {
        // Wrap unexpected errors, they are most likely a Compas or related backend bug.
        // @ts-ignore
        resolve({
          error: AppError.serverError(
            {
              message: "Something went wrong validating the JWT.",
              tokenString,
            },
            error,
          ),
        });
      })
      .once("done", function (valid, obj) {
        // @ts-ignore
        resolve({ value: { valid, obj } });
      });
  });

  if (error) {
    eventStop(event);
    return {
      error,
    };
  }

  if (!value.valid) {
    eventStop(event);
    return {
      error: new AppError(`${event.name}.invalidToken`, 401),
    };
  }

  if (value.obj.payload.exp * 1000 < Date.now()) {
    eventStop(event);
    return {
      error: new AppError(`${event.name}.expiredToken`, 401),
    };
  }

  eventStop(event);

  return {
    value: value.obj,
  };
}

/**
 * Create a fast checksum for the data object
 *
 * @param {any} data
 * @returns {string}
 */
function sessionStoreChecksumForData(data) {
  return crc32(JSON.stringify(data ?? {})).toString(16);
}

/**
 * Validate session store settings
 *
 * @param {any} input
 * @returns {Either<void>}
 */
function validateSessionStoreSettings(input) {
  const errObject = {};

  if (typeof input.accessTokenMaxAgeInSeconds !== "number") {
    errObject["$.sessionStoreSettings.accessTokenMaxAgeInSeconds"] = {
      key: "validator.number.type",
    };
  }
  if (typeof input.refreshTokenMaxAgeInSeconds !== "number") {
    errObject["$.sessionStoreSettings.refreshTokenMaxAgeInSeconds"] = {
      key: "validator.number.type",
    };
  }

  if (typeof input.signingKey !== "string") {
    errObject["$.sessionStoreSettings.signingKey"] = {
      key: "validator.string.type",
    };
  } else if (input.signingKey.length < 20) {
    errObject["$.sessionStoreSettings.signingKey"] = {
      key: "validator.string.min",
      info: {
        min: 20,
      },
    };
  }

  if (Object.keys(errObject).length > 0) {
    return {
      error: new AppError("validator.error", 400, errObject),
    };
  }

  if (input.accessTokenMaxAgeInSeconds >= input.refreshTokenMaxAgeInSeconds) {
    return {
      error: AppError.validationError("validator.error", {
        "$.sessionStoreSettings.accessTokenMaxAgeInSeconds": {
          message:
            "Max age of refresh token should be longer than the max age of an access token",
        },
      }),
    };
  }

  return {
    value: undefined,
  };
}
