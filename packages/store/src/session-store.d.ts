/**
 * Store a new session, and returns a access & refresh token pair
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {StoreSessionStoreSettings} sessionSettings
 * @param {any} sessionData
 * @returns {Promise<Either<{
 *   accessToken: string,
 *   refreshToken: string,
 * }>>}
 */
export function sessionStoreCreate(
  event: InsightEvent,
  sql: Postgres,
  sessionSettings: StoreSessionStoreSettings,
  sessionData: any,
): Promise<
  Either<{
    accessToken: string;
    refreshToken: string;
  }>
>;
/**
 * Get a session from the provided access token string
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {StoreSessionStoreSettings} sessionSettings
 * @param {string} accessTokenString
 * @returns {Promise<Either<{session: QueryResultStoreSessionStore}>>}
 */
export function sessionStoreGet(
  event: InsightEvent,
  sql: Postgres,
  sessionSettings: StoreSessionStoreSettings,
  accessTokenString: string,
): Promise<
  Either<{
    session: QueryResultStoreSessionStore;
  }>
>;
/**
 * Update the session. Expects `session.id`, `session.hash` and `session.data` to exist.
 * If the hash of the data is the same as `hash`, this function call is ignored.
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {QueryResultStoreSessionStore} session
 * @returns {Promise<Either<void>>}
 */
export function sessionStoreUpdate(
  event: InsightEvent,
  sql: Postgres,
  session: QueryResultStoreSessionStore,
): Promise<Either<void>>;
/**
 * Revoke all tokens related to the session
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {QueryResultStoreSessionStore} session
 * @returns {Promise<Either<void>>}
 */
export function sessionStoreInvalidate(
  event: InsightEvent,
  sql: Postgres,
  session: QueryResultStoreSessionStore,
): Promise<Either<void>>;
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
 * @returns {Promise<Either<{
 *   accessToken: string,
 *   refreshToken: string,
 * }>>}
 */
export function sessionStoreRefreshTokens(
  event: InsightEvent,
  sql: Postgres,
  sessionSettings: StoreSessionStoreSettings,
  refreshTokenString: string,
): Promise<
  Either<{
    accessToken: string;
    refreshToken: string;
  }>
>;
/**
 * Cleanup tokens that are expired / revoked longer than 'maxRevokedAgeInDays' days ago.
 * Also removes the session if no tokens exist anymore.
 * Note that when tokens are removed, Compas can't detect refresh token reuse, which
 * hints on session stealing. A good default may be 45 days.
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {number} maxRevokedAgeInDays
 * @returns {Promise<void>}
 */
export function sessionStoreCleanupExpiredSessions(
  event: InsightEvent,
  sql: Postgres,
  maxRevokedAgeInDays: number,
): Promise<void>;
/**
 * Format and report a potential leaked session.
 * Revoking all tokens of that session in the process.
 * Reports it via `compas.sessionStore.potentialLeakedSession` job.
 * Note that there may be some overlap in tokens, since we allow a grace period in which
 * another refresh token can be acquired. So if the client has some kind of race
 * condition, the backend doesn't trip over it.
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {string} sessionId
 * @returns {Promise<void>}
 */
export function sessionStoreReportAndRevokeLeakedSession(
  event: InsightEvent,
  sql: Postgres,
  sessionId: string,
): Promise<void>;
/**
 * Create a new token pair for the provided session
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {StoreSessionStoreSettings} sessionSettings
 * @param {QueryResultStoreSessionStore} session
 * @returns {Promise<Either<{
 *   accessToken: string,
 *   refreshToken: string
 * }>>}
 */
export function sessionStoreCreateTokenPair(
  event: InsightEvent,
  sql: Postgres,
  sessionSettings: StoreSessionStoreSettings,
  session: QueryResultStoreSessionStore,
): Promise<
  Either<{
    accessToken: string;
    refreshToken: string;
  }>
>;
/**
 * Create and sign a nwe JWT token
 *
 * @param {InsightEvent} event
 * @param {StoreSessionStoreSettings} sessionSettings
 * @param {"compasSessionAccessToken"|"compasSessionRefreshToken"} type
 * @param {string} value
 * @param {Date} expiresAt
 * @returns {Promise<Either<string>>}
 */
export function sessionStoreCreateJWT(
  event: InsightEvent,
  sessionSettings: StoreSessionStoreSettings,
  type: "compasSessionAccessToken" | "compasSessionRefreshToken",
  value: string,
  expiresAt: Date,
): Promise<Either<string>>;
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
 * }>>}
 */
export function sessionStoreVerifyAndDecodeJWT(
  event: InsightEvent,
  sessionSettings: StoreSessionStoreSettings,
  tokenString: string,
): Promise<
  Either<{
    header: object;
    payload: {
      exp: number;
      compasSessionAccessToken?: string;
      compasSessionRefreshToken?: string;
    };
  }>
>;
export type Either<T> = import("@compas/stdlib").Either<T, AppError>;
export type InsightEvent = import("@compas/stdlib").InsightEvent;
export type Postgres = import("../types/advanced-types").Postgres;
export type StoreSessionStoreSettings = {
  accessTokenMaxAgeInSeconds: number;
  refreshTokenMaxAgeInSeconds: number;
  signingKey: string;
};
import { AppError } from "@compas/stdlib";
//# sourceMappingURL=session-store.d.ts.map
