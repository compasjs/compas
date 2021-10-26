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
 * @return {Promise<{
 *   accessToken: string,
 *   refreshToken: string,
 * }>}
 */
export async function sessionStoreCreate(
  event,
  sql,
  sessionSettings,
  sessionData,
) {
  eventStart(event, "sessionStore.create");

  const { error } = validateStoreSessionStoreSettings(sessionSettings);
  if (error) {
    throw error;
  }

  const [session] = await queries.sessionStoreInsert(sql, {
    data: sessionData,
    // TODO: Create hash, so we can optimize updates
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

export async function sessionStoreGet(
  event,
  sql,
  sessionSettings,
  accessTokenString,
) {
  eventStart(event, "sessionStore.get");

  const token = await sessionStoreVerifyAndDecodeJWT(
    newEventFromEvent(event),
    sessionSettings,
    accessTokenString,
  );

  if (isNil(token.compasSessionAccessToken)) {
    throw AppError.validationError(`${event.name}.invalidAccessToken`);
  }

  const [storeToken] = await querySessionStoreToken({
    session: {},
    where: {
      id: token.payload.compasSessionAccessToken,
      refreshTokenIsNotNull: true,
    },
  }).exec(sql);

  if (isNil(storeToken)) {
    throw AppError.validationError(`${event.name}.invalidSession`);
  }

  // Access token revocation doesn't need a grace period.
  if (storeToken.revokedAt.getTime() < Date.now()) {
    throw AppError.validationError(`${event.name}.revokedToken`);
  }

  eventStop(event);

  return {
    session: storeToken.session,
  };
}

/**
 * Update the session. Expects `session.id`, `session.hash` and `session.data` to exist.
 * If the hash of the data is the same as `hash`, this function call is ignored.
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {QueryResultStoreSessionStore} session
 * @return {Promise<void>}
 */
export async function sessionStoreUpdate(event, sql, session) {
  eventStart(event, "sessionStore.update");

  if (isNil(session?.id) || !isPlainObject(session?.data)) {
    throw AppError.validationError(`${event.name}.invalidSession`);
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
}

/**
 * Revoke all tokens related to the session
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {QueryResultStoreSessionStore} session
 * @return {Promise<void>}
 */
export async function sessionStoreInvalidate(event, sql, session) {
  eventStart(event, "sessionStore.invalidate");

  if (isNil(session?.id)) {
    throw AppError.validationError(`${event.name}.invalidSession`);
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
 * @return {Promise<{
 *   accessToken: string,
 *   refreshToken: string,
 * }>}
 */
export async function sessionStoreRefreshTokens(
  event,
  sql,
  sessionSettings,
  refreshTokenString,
) {
  eventStart(event, "sessionStore.refreshTokens");

  const token = await sessionStoreVerifyAndDecodeJWT(
    newEventFromEvent(event),
    sessionSettings,
    refreshTokenString,
  );

  if (isNil(token.compasSessionRefreshToken)) {
    throw AppError.validationError(`${event.name}.invalidRefreshToken`);
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
    throw AppError.validationError(`${event.name}.invalidSession`);
  }

  // Access token revocation doesn't need a grace period.
  if (
    storeToken.revokedAt.getTime() + REFRESH_TOKEN_GRACE_PERIOD_IN_MS <
    Date.now()
  ) {
    // TODO: REport via event
    throw AppError.validationError(`${event.name}.revokedToken`);
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
 * @return {Promise<{accessToken: string, refreshToken: string}>}
 */
export async function sessionStoreCreateTokenPair(
  event,
  sql,
  sessionSettings,
  session,
) {
  eventStart(event, "sessionStore.createTokenPair");

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

  eventStop(event);

  return {
    accessToken,
    refreshToken,
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
 * @returns {Promise<string>}
 */
export function sessionStoreCreateJWT(
  event,
  sessionSettings,
  type,
  value,
  expiresAt,
) {
  eventStart(event, "sessionStore.createJWT");

  return new Promise((resolve, reject) => {
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
      .once("error", reject)
      .once("done", function (signature) {
        eventStop(event);
        resolve(signature);
      });
  });
}

/**
 * Verify and decode a JWT token
 *
 * @param {InsightEvent} event
 * @param {StoreSessionStoreSettings} sessionSettings
 * @param {string} tokenString
 * @returns Promise<{}>
 */
export async function sessionStoreVerifyAndDecodeJWT(
  event,
  sessionSettings,
  tokenString,
) {
  eventStart(event, "sessionStore.verifyAndDecodeJWT");

  const { valid, obj } = await new Promise((resolve, reject) => {
    createVerify({
      signature: tokenString,
      secret: sessionSettings.signingKey,
      algorithm: "HS256",
    })
      .once("error", reject)
      .once("done", function (valid, obj) {
        resolve({ valid, obj });
      });
  });

  if (!valid) {
    throw new AppError(`${event.name}.invalidToken`, 401);
  }

  if (obj.payload.exp * 1000 < Date.now()) {
    throw new AppError(`${event.name}.expiredToken`, 401);
  }

  return obj;
}
