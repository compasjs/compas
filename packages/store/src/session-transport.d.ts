/**
 * @typedef {import("./session-store").SessionStoreSettings} SessionStoreSettings
 */
/**
 * @template T
 * @typedef {import("@compas/stdlib").Either<T, AppError>} Either
 */
/**
 * @typedef {import("@compas/stdlib").InsightEvent} InsightEvent
 */
/**
 * @typedef {import("../types/advanced-types").Postgres} Postgres
 */
/**
 * @typedef {object} SessionTransportCookieSettings
 * @property {"origin"|"own"|string} domain The domain to use.
 *   'Origin' resolves to the request origin, and 'own' resolves to setting no domain,
 *   which means only for the domain that was used for the request.
 * @property {"strict"|"lax"} [sameSite] Set the
 *   `sameSite` behaviour for this specific cookie. Defaults to `cookieOptions.sameSite`.
 * @property {boolean} [secure] Set the
 *   'Secure' behaviour for this specific cookie. Defaults to
 *   `cookieOptions.secure`.
 */
/**
 * @typedef {object} SessionTransportSettings
 * @property {SessionStoreSettings} sessionStoreSettings JWT generation settings
 *
 * @property {boolean} [enableHeaderTransport] Defaults to true, can be used to disable
 *   reading the `Authorization` header
 * @property {boolean} [enableCookieTransport] Defaults to true, can be used to disable
 *   reading and writing cookies.
 *
 * @property {boolean} [autoRefreshCookies] When `enableCookieSupport === true` and only
 *   a 'refreshToken' is found, it will refresh the tokens and set new cookies.
 *
 * @property {object} [headerOptions] Object containing options to configure reading from
 *   the 'Authorization' header.
 *
 * @property {object} [cookieOptions] Object containing options to configure reading and
 *   writing the cookies
 * @property {string} [cookieOptions.cookiePrefix] Can be used to add custom prefixes to
 *   the set cookies. Defaults to `{environment.APP_NAME}.` or an empty string.
 * @property {"strict"|"lax"} [cookieOptions.sameSite] Set the default `sameSite`
 *   behaviour for all set cookies. Defaults to 'lax'.
 * @property {boolean} [cookieOptions.secure] Set the default 'Secure' behaviour for all
 *   set cookies. Defaults to `isProduction()`.
 * @property {SessionTransportCookieSettings[]} [cookieOptions.cookies] A specification
 *   of the cookies you want to set. Defaults to '[{ domain: "own" }, { domain: "origin"
 *   }]'.
 */
/**
 * Load either the Authorization header or cookies.
 * If Cookies and autoRefresh is set, automatically refresh with the found refresh
 * token. This way the accessToken cookie can expiry, and will be set again.
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {import("koa").Context} ctx
 * @param {SessionTransportSettings} settings
 * @returns {Promise<Either<{session: QueryResultStoreSessionStore}>>}
 */
export function sessionTransportLoadFromContext(
  event: InsightEvent,
  sql: Postgres,
  ctx: import("koa").Context,
  settings: SessionTransportSettings,
): Promise<
  import("@compas/stdlib").Either<
    {
      session: QueryResultStoreSessionStore;
    },
    AppError
  >
>;
/**
 * Add the tokens as cookies.
 * Set them both on 'Origin', and without domain (ie the api domain). This way we don't
 * have to hardcode any domain as parameter.
 * Pass undefined as token pair to remove all cookies.
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("koa").Context} ctx
 * @param {{ accessToken: string, refreshToken: string }|undefined} tokenPair
 * @param {SessionTransportSettings} settings
 * @returns <Promise<void>}
 */
export function sessionTransportAddAsCookiesToContext(
  event: import("@compas/stdlib").InsightEvent,
  ctx: import("koa").Context,
  tokenPair:
    | {
        accessToken: string;
        refreshToken: string;
      }
    | undefined,
  settings: SessionTransportSettings,
): Promise<void>;
/**
 *
 * @param {SessionTransportSettings} opts
 * @returns {SessionTransportSettings}
 */
export function validateSessionTransportSettings(
  opts: SessionTransportSettings,
): SessionTransportSettings;
export type SessionStoreSettings =
  import("./session-store").SessionStoreSettings;
export type Either<T> = import("@compas/stdlib").Either<T, AppError>;
export type InsightEvent = import("@compas/stdlib").InsightEvent;
export type Postgres = import("../types/advanced-types").Postgres;
export type SessionTransportCookieSettings = {
  /**
   * The domain to use.
   * 'Origin' resolves to the request origin, and 'own' resolves to setting no domain,
   * which means only for the domain that was used for the request.
   */
  domain: "origin" | "own" | string;
  /**
   * Set the
   * `sameSite` behaviour for this specific cookie. Defaults to `cookieOptions.sameSite`.
   */
  sameSite?: "strict" | "lax" | undefined;
  /**
   * Set the
   * 'Secure' behaviour for this specific cookie. Defaults to
   * `cookieOptions.secure`.
   */
  secure?: boolean | undefined;
};
export type SessionTransportSettings = {
  /**
   * JWT generation settings
   */
  sessionStoreSettings: SessionStoreSettings;
  /**
   * Defaults to true, can be used to disable
   * reading the `Authorization` header
   */
  enableHeaderTransport?: boolean | undefined;
  /**
   * Defaults to true, can be used to disable
   * reading and writing cookies.
   */
  enableCookieTransport?: boolean | undefined;
  /**
   * When `enableCookieSupport === true` and only
   * a 'refreshToken' is found, it will refresh the tokens and set new cookies.
   */
  autoRefreshCookies?: boolean | undefined;
  /**
   * Object containing options to configure reading from
   * the 'Authorization' header.
   */
  headerOptions?: object;
  /**
   * Object containing options to configure reading and
   * writing the cookies
   */
  cookieOptions?:
    | {
        /**
         * Can be used to add custom prefixes to
         * the set cookies. Defaults to `{environment.APP_NAME}.` or an empty string.
         */
        cookiePrefix?: string | undefined;
        /**
         * Set the default `sameSite`
         * behaviour for all set cookies. Defaults to 'lax'.
         */
        sameSite?: "strict" | "lax" | undefined;
        /**
         * Set the default 'Secure' behaviour for all
         * set cookies. Defaults to `isProduction()`.
         */
        secure?: boolean | undefined;
        /**
         * A specification
         * of the cookies you want to set. Defaults to '[{ domain: "own" }, { domain: "origin"
         * }]'.
         */
        cookies?: SessionTransportCookieSettings[] | undefined;
      }
    | undefined;
};
import { AppError } from "@compas/stdlib";
//# sourceMappingURL=session-transport.d.ts.map
