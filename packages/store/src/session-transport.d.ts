/**
 * @template T
 * @typedef {import("@compas/stdlib").Either<T, AppError>} Either
 */
/**
 * @typedef {object} SessionTransportSettings
 * @property {import("./session-store").SessionStoreSettings} sessionStoreSettings JWT
 *   generation settings
 *
 * @property {boolean} [enableHeaderTransport] Defaults to true, can be used to disable
 *   reading the `Authorization` header
 *
 * @property {object} [headerOptions] Object containing options to configure reading from
 *   the 'Authorization' header.
 */
/**
 * Load the session from the authorization header.
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("postgres").Sql<{}>} sql
 * @param {import("koa").Context} ctx
 * @param {SessionTransportSettings} settings
 * @returns {Promise<Either<{session:
 *   import("./generated/common/types").QueryResultStoreSessionStore}>>}
 */
export function sessionTransportLoadFromContext(
  event: import("@compas/stdlib").InsightEvent,
  sql: import("postgres").Sql<{}>,
  ctx: import("koa").Context,
  settings: SessionTransportSettings,
): Promise<
  import("@compas/stdlib").Either<
    {
      session: import("./generated/common/types").QueryResultStoreSessionStore;
    },
    AppError
  >
>;
/**
 *
 * @param {SessionTransportSettings} opts
 * @returns {SessionTransportSettings}
 */
export function validateSessionTransportSettings(
  opts: SessionTransportSettings,
): SessionTransportSettings;
export type Either<T> = import("@compas/stdlib").Either<T, AppError>;
export type SessionTransportSettings = {
  /**
   * JWT
   * generation settings
   */
  sessionStoreSettings: import("./session-store").SessionStoreSettings;
  /**
   * Defaults to true, can be used to disable
   * reading the `Authorization` header
   */
  enableHeaderTransport?: boolean | undefined;
  /**
   * Object containing options to configure reading from
   * the 'Authorization' header.
   */
  headerOptions?: object;
};
import { AppError } from "@compas/stdlib";
//# sourceMappingURL=session-transport.d.ts.map
