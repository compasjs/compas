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
export function sessionStoreCreate(
  event: InsightEvent,
  sql: Postgres,
  sessionSettings: StoreSessionStoreSettings,
  sessionData: any,
): Promise<{
  accessToken: string;
  refreshToken: string;
}>;
export function sessionStoreGet(
  event: any,
  sql: any,
  sessionSettings: any,
  accessTokenString: any,
): Promise<{
  session: string &
    (string | number | QueryResultStoreSessionStore | undefined);
}>;
/**
 * Update the session. Expects `session.id`, `session.hash` and `session.data` to exist.
 * If the hash of the data is the same as `hash`, this function call is ignored.
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {QueryResultStoreSessionStore} session
 * @return {Promise<void>}
 */
export function sessionStoreUpdate(
  event: InsightEvent,
  sql: Postgres,
  session: QueryResultStoreSessionStore,
): Promise<void>;
/**
 * Revoke all tokens related to the session
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {QueryResultStoreSessionStore} session
 * @return {Promise<void>}
 */
export function sessionStoreInvalidate(
  event: InsightEvent,
  sql: Postgres,
  session: QueryResultStoreSessionStore,
): Promise<void>;
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
export function sessionStoreRefreshTokens(
  event: InsightEvent,
  sql: Postgres,
  sessionSettings: StoreSessionStoreSettings,
  refreshTokenString: string,
): Promise<{
  accessToken: string;
  refreshToken: string;
}>;
/**
 * Create a new token pair for the provided session
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {StoreSessionStoreSettings} sessionSettings
 * @param {QueryResultStoreSessionStore} session
 * @return {Promise<{accessToken: string, refreshToken: string}>}
 */
export function sessionStoreCreateTokenPair(
  event: InsightEvent,
  sql: Postgres,
  sessionSettings: StoreSessionStoreSettings,
  session: QueryResultStoreSessionStore,
): Promise<{
  accessToken: string;
  refreshToken: string;
}>;
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
  event: InsightEvent,
  sessionSettings: StoreSessionStoreSettings,
  type: "compasSessionAccessToken" | "compasSessionRefreshToken",
  value: string,
  expiresAt: Date,
): Promise<string>;
/**
 * Verify and decode a JWT token
 *
 * @param {InsightEvent} event
 * @param {StoreSessionStoreSettings} sessionSettings
 * @param {string} tokenString
 * @returns Promise<{}>
 */
export function sessionStoreVerifyAndDecodeJWT(
  event: InsightEvent,
  sessionSettings: StoreSessionStoreSettings,
  tokenString: string,
): Promise<any>;
export type InsightEvent = import("@compas/stdlib").InsightEvent;
export type Postgres = import("../types/advanced-types").Postgres;
export type StoreSessionStoreSettings = {
  accessTokenMaxAgeInSeconds: number;
  refreshTokenMaxAgeInSeconds: number;
  signingKey: string;
};
//# sourceMappingURL=session-store.d.ts.map
