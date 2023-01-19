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
export function sessionStoreCreate(
  event: import("@compas/stdlib").InsightEvent,
  sql: import("postgres").Sql<{}>,
  sessionSettings: SessionStoreSettings,
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
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("postgres").Sql<{}>} sql
 * @param {SessionStoreSettings} sessionSettings
 * @param {string} accessTokenString
 * @returns {Promise<Either<{session:
 *   import("./generated/common/types").QueryResultStoreSessionStore}>>}
 */
export function sessionStoreGet(
  event: import("@compas/stdlib").InsightEvent,
  sql: import("postgres").Sql<{}>,
  sessionSettings: SessionStoreSettings,
  accessTokenString: string,
): Promise<
  Either<{
    session: import("./generated/common/types").QueryResultStoreSessionStore;
  }>
>;
/**
 * Update the session. Expects `session.id`, `session.hash` and `session.data` to exist.
 * If the hash of the data is the same as `hash`, this function call is ignored.
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("postgres").Sql<{}>} sql
 * @param {import("./generated/common/types").QueryResultStoreSessionStore} session
 * @returns {Promise<Either<void>>}
 */
export function sessionStoreUpdate(
  event: import("@compas/stdlib").InsightEvent,
  sql: import("postgres").Sql<{}>,
  session: import("./generated/common/types").QueryResultStoreSessionStore,
): Promise<Either<void>>;
/**
 * Revoke all tokens related to the session
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("postgres").Sql<{}>} sql
 * @param {import("./generated/common/types").QueryResultStoreSessionStore} session
 * @returns {Promise<Either<void>>}
 */
export function sessionStoreInvalidate(
  event: import("@compas/stdlib").InsightEvent,
  sql: import("postgres").Sql<{}>,
  session: import("./generated/common/types").QueryResultStoreSessionStore,
): Promise<Either<void>>;
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
 * @param {string} refreshTokenString
 * @returns {Promise<Either<{
 *   accessToken: string,
 *   refreshToken: string,
 * }>>}
 */
export function sessionStoreRefreshTokens(
  event: import("@compas/stdlib").InsightEvent,
  sql: import("postgres").Sql<{}>,
  sessionSettings: SessionStoreSettings,
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
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("postgres").Sql<{}>} sql
 * @param {number} maxRevokedAgeInDays
 * @returns {Promise<void>}
 */
export function sessionStoreCleanupExpiredSessions(
  event: import("@compas/stdlib").InsightEvent,
  sql: import("postgres").Sql<{}>,
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
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("postgres").Sql<{}>} sql
 * @param {string} sessionId
 * @returns {Promise<void>}
 */
export function sessionStoreReportAndRevokeLeakedSession(
  event: import("@compas/stdlib").InsightEvent,
  sql: import("postgres").Sql<{}>,
  sessionId: string,
): Promise<void>;
/**
 * Create a new token pair for the provided session
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("postgres").Sql<{}>} sql
 * @param {SessionStoreSettings} sessionSettings
 * @param {import("./generated/common/types").QueryResultStoreSessionStore} session
 * @returns {Promise<Either<{
 *   accessToken: string,
 *   refreshToken: string
 * }>>}
 */
export function sessionStoreCreateTokenPair(
  event: import("@compas/stdlib").InsightEvent,
  sql: import("postgres").Sql<{}>,
  sessionSettings: SessionStoreSettings,
  session: import("./generated/common/types").QueryResultStoreSessionStore,
): Promise<
  Either<{
    accessToken: string;
    refreshToken: string;
  }>
>;
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
  event: import("@compas/stdlib").InsightEvent,
  sessionSettings: SessionStoreSettings,
  type: "compasSessionAccessToken" | "compasSessionRefreshToken",
  value: string,
  expiresAt: Date,
): Promise<Either<string>>;
/**
 * Verify and decode a JWT token
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {SessionStoreSettings} sessionSettings
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
  event: import("@compas/stdlib").InsightEvent,
  sessionSettings: SessionStoreSettings,
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
/**
 * @type {string}
 */
export const SESSION_STORE_POTENTIAL_LEAKED_SESSION_JOB_NAME: string;
export type Either<T> = import("@compas/stdlib").Either<T, AppError>;
export type SessionStoreSettings = {
  accessTokenMaxAgeInSeconds: number;
  refreshTokenMaxAgeInSeconds: number;
  signingKey: string;
};
import { AppError } from "@compas/stdlib";
//# sourceMappingURL=session-store.d.ts.map
