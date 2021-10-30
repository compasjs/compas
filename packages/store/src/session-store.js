import {
  AppError,
  eventStart,
  eventStop,
  isNil,
  isPlainObject,
  newEventFromEvent,
  uuid,
} from "@compas/stdlib";
import { createSign, createVerify } from "jws";
import { queries } from "./generated.js";
import { querySessionStoreToken } from "./generated/database/sessionStoreToken.js";
import { validateStoreSessionStoreSettings } from "./generated/store/validators.js";

/**
 * @typedef {import("@compas/stdlib").Either} Either
 */

/**
 * @typedef {import("@compas/stdlib").AppError} AppError
 */

/**
 * @typedef {import("@compas/stdlib").InsightEvent} InsightEvent
 */

/**
 * @typedef {import("../types/advanced-types").Postgres} Postgres
 */

/**
 * @typedef {object} StoreSessionStoreSettings
 * @property {number} accessTokenMaxAgeInSeconds
 * @property {number} refreshTokenMaxAgeInSeconds
 * @property {string} signingKey
 */

const REFRESH_TOKEN_GRACE_PERIOD_IN_MS = 15 * 1000;

/**
 * Store a new session, and returns a access & refresh token pair
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {StoreSessionStoreSettings} sessionSettings
 * @param {any} sessionData
 * @return {Promise<Either<{
 *   accessToken: string,
 *   refreshToken: string,
 * }, AppError>>}
 */
export async function sessionStoreCreate(
  event,
  sql,
  sessionSettings,
  sessionData,
) {
  eventStart(event, "sessionStore.create");

  const validateResult = validateStoreSessionStoreSettings(sessionSettings);
  if (validateResult.error) {
    eventStop(event);
    return validateResult;
  }

  const [session] = await queries.sessionStoreInsert(sql, {
    data: sessionData, // TODO: Create hash, so we can optimize updates
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
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {StoreSessionStoreSettings} sessionSettings
 * @param {string} accessTokenString
 * @return {Promise<Either<{session: QueryResultStoreSessionStore}, AppError>>}
 */
export async function sessionStoreGet(
  event,
  sql,
  sessionSettings,
  accessTokenString,
) {
  eventStart(event, "sessionStore.get");

  const validateResult = validateStoreSessionStoreSettings(sessionSettings);
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
      refreshTokenIsNotNull: true,
    },
  }).exec(sql);

  if (isNil(storeToken)) {
    eventStop(event);
    return {
      error: AppError.validationError(`${event.name}.invalidSession`),
    };
  }

  // Access token revocation doesn't need a grace period.
  if (storeToken.revokedAt && storeToken.revokedAt.getTime() < Date.now()) {
    eventStop(event);
    return {
      error: AppError.validationError(`${event.name}.revokedToken`),
    };
  }

  eventStop(event);

  return {
    value: {
      session: storeToken.session,
    },
  };
}

/**
 * Update the session. Expects `session.id`, `session.hash` and `session.data` to exist.
 * If the hash of the data is the same as `hash`, this function call is ignored.
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {QueryResultStoreSessionStore} session
 * @return {Promise<Either<void, AppError>>}
 */
export async function sessionStoreUpdate(event, sql, session) {
  eventStart(event, "sessionStore.update");

  if (isNil(session?.id) || !isPlainObject(session?.data)) {
    eventStop(event);
    return {
      error: AppError.validationError(`${event.name}.invalidSession`),
    };
  }

  // TODO: Check hash

  await queries.sessionStoreUpdate(
    sql,
    {
      data: session.data,
    },
    {
      id: session.id,
    },
  );

  eventStop(event);

  return {
    value: undefined,
  };
}

/**
 * Revoke all tokens related to the session
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {QueryResultStoreSessionStore} session
 * @return {Promise<Either<void, AppError>>}
 */
export async function sessionStoreInvalidate(event, sql, session) {
  eventStart(event, "sessionStore.invalidate");

  if (isNil(session?.id)) {
    eventStop(event);
    return {
      error: AppError.validationError(`${event.name}.invalidSession`),
    };
  }

  await queries.sessionStoreTokenUpdate(
    sql,
    {
      revokedAt: new Date(),
    },
    {
      session: session.id,
    },
  );

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
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {StoreSessionStoreSettings} sessionSettings
 * @param {string} refreshTokenString
 * @return {Promise<Either<{
 *   accessToken: string,
 *   refreshToken: string,
 * }, AppError>>}
 */
export async function sessionStoreRefreshTokens(
  event,
  sql,
  sessionSettings,
  refreshTokenString,
) {
  eventStart(event, "sessionStore.refreshTokens");

  const validateResult = validateStoreSessionStoreSettings(sessionSettings);
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
      id: token.payload.compasSessionRefreshToken,
      refreshTokenIsNull: true,
    },
  }).exec(sql);

  if (isNil(storeToken)) {
    eventStop(event);
    return {
      error: AppError.validationError(`${event.name}.invalidSession`),
    };
  }

  // Access token revocation doesn't need a grace period.
  if (
    storeToken.revokedAt &&
    storeToken.revokedAt.getTime() + REFRESH_TOKEN_GRACE_PERIOD_IN_MS <
      Date.now()
  ) {
    // TODO: REport via event
    eventStop(event);
    return {
      error: AppError.validationError(`${event.name}.revokedToken`),
    };
  }

  // Revoke both refresh and access token.
  await queries.sessionStoreTokenUpdate(
    sql,
    {
      revokedAt: new Date(),
    },
    {
      idIn: [storeToken.id, storeToken.accessToken.id],
    },
  );

  const tokens = await sessionStoreCreateTokenPair(
    newEventFromEvent(event),
    sql,
    sessionSettings,
    storeToken.session,
  );

  eventStop(event);

  return tokens;
}

/**
 * Create a new token pair for the provided session
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {StoreSessionStoreSettings} sessionSettings
 * @param {QueryResultStoreSessionStore} session
 * @return {Promise<Either<{
 *   accessToken: string,
 *   refreshToken: string
 * }, AppError>>}
 */
export async function sessionStoreCreateTokenPair(
  event,
  sql,
  sessionSettings,
  session,
) {
  eventStart(event, "sessionStore.createTokenPair");

  const validateResult = validateStoreSessionStoreSettings(sessionSettings);
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

  await queries.sessionStoreTokenInsert(sql, [
    {
      id: refreshTokenId,
      session: session.id,
      expiresAt: refreshTokenExpireDate,
    },
    {
      id: accessTokenId,
      session: session.id,
      expiresAt: accessTokenExpireDate,
      refreshToken: refreshTokenId,
    },
  ]);

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
 * @param {InsightEvent} event
 * @param {StoreSessionStoreSettings} sessionSettings
 * @param {"compasSessionAccessToken"|"compasSessionRefreshToken"} type
 * @param {string} value
 * @param {Date} expiresAt
 * @returns {Promise<Either<string, AppError>>}
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
 * @param {InsightEvent} event
 * @param {StoreSessionStoreSettings} sessionSettings
 * @param {string} tokenString
 * @returns {Promise<Either<{
 *   header: object,
 *   payload: {
 *     exp: number,
 *     compasSessionAccessToken?: string,
 *     compasSessionRefreshToken?: string,
 *   },
 * }, AppError>>}
 */
export async function sessionStoreVerifyAndDecodeJWT(
  event,
  sessionSettings,
  tokenString,
) {
  eventStart(event, "sessionStore.verifyAndDecodeJWT");

  const { value, error } = await new Promise((resolve) => {
    createVerify({
      signature: tokenString,
      secret: sessionSettings.signingKey,
      algorithm: "HS256",
    })
      .once("error", (error) => {
        resolve({
          error: AppError.serverError({}, error),
        });
      })
      .once("done", function (valid, obj) {
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
