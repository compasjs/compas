import {
  AppError,
  environment,
  eventStart,
  eventStop,
  isNil,
  isProduction,
  newEventFromEvent,
} from "@compas/stdlib";
import {
  sessionStoreGet,
  sessionStoreRefreshTokens,
  sessionStoreVerifyAndDecodeJWT,
} from "./session-store.js";

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
 * @param {SessionTransportSettings} opts
 * @returns {Promise<Either<{session: QueryResultStoreSessionStore}>>}
 */
export async function sessionTransportLoadFromContext(event, sql, ctx, opts) {
  eventStart(event, "sessionTransport.loadFromContext");

  const options = validateSessionTransportSettings(opts);

  let accessToken;
  if (options.enableHeaderTransport) {
    accessToken = sessionTransportLoadAuthorizationHeader(ctx);
  }

  if (!accessToken && options.enableCookieTransport) {
    accessToken = await sessionTransportLoadCookies(
      newEventFromEvent(event),
      sql,
      ctx,
      options,
    );
  }

  const session = await sessionStoreGet(
    newEventFromEvent(event),
    sql,
    options.sessionStoreSettings,
    accessToken ?? "",
  );

  eventStop(event);

  // We need to return the same `Either<X,Y>` as `sessionStoreGet`.
  return session;
}

/**
 * Add the tokens as cookies.
 * Set them both on 'Origin', and without domain (ie the api domain). This way we don't
 * have to hardcode any domain as parameter.
 * Pass undefined as token pair to remove all cookies.
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("koa").Context} ctx
 * @param {{ accessToken: string, refreshToken: string }|undefined} tokenPair
 * @param {SessionTransportSettings} options
 * @returns <Promise<void>}
 */
export async function sessionTransportAddAsCookiesToContext(
  event,
  ctx,
  tokenPair,
  options,
) {
  eventStart(event, "sessionTransport.addAsCookiesToContext");

  if (!options.enableCookieTransport) {
    throw AppError.serverError({
      message: "Can't set cookies if the cookie transport is disabled.",
    });
  }

  const accessToken = tokenPair?.accessToken
    ? await sessionStoreVerifyAndDecodeJWT(
        newEventFromEvent(event),
        options.sessionStoreSettings,
        tokenPair.accessToken,
      )
    : undefined;
  const refreshToken = tokenPair?.refreshToken
    ? await sessionStoreVerifyAndDecodeJWT(
        newEventFromEvent(event),
        options.sessionStoreSettings,
        tokenPair.refreshToken,
      )
    : undefined;

  for (const cookie of options.cookieOptions?.cookies ?? []) {
    const domain = getResolvedDomain(ctx, cookie.domain);

    ctx.cookies.set(
      getCookieName(options, "accessToken"),
      tokenPair?.accessToken,
      {
        expires: new Date((accessToken?.value?.payload?.exp ?? 0) * 1000),
        domain,
        secure: cookie.secure,
        httpOnly: true,
        sameSite: cookie.sameSite,
      },
    );
    ctx.cookies.set(
      getCookieName(options, "refreshToken"),
      tokenPair?.refreshToken,
      {
        expires: new Date((refreshToken?.value?.payload?.exp ?? 0) * 1000),
        domain,
        secure: cookie.secure,
        httpOnly: true,
        sameSite: cookie.sameSite,
      },
    );

    // Maintain a JS readable public cookie so the frontend can do logic without
    // executing requests.
    ctx.cookies.set(
      getCookieName(options, "public"),
      tokenPair?.refreshToken ? "truthy" : undefined,
      {
        expires: new Date((refreshToken?.value?.payload?.exp ?? 0) * 1000),
        domain,
        secure: cookie.secure,
        httpOnly: false,
        sameSite: cookie.sameSite,
      },
    );
  }

  eventStop(event);
}

/**
 *
 * @param {SessionTransportSettings} opts
 * @returns {SessionTransportSettings}
 */
function validateSessionTransportSettings(opts) {
  opts.enableHeaderTransport = opts.enableHeaderTransport ?? true;
  opts.enableCookieTransport = opts.enableCookieTransport ?? true;
  opts.headerOptions = opts.headerOptions ?? {};
  opts.cookieOptions = opts.cookieOptions ?? {};
  opts.autoRefreshCookies = opts.autoRefreshCookies ?? true;

  opts.cookieOptions.cookiePrefix =
    opts.cookieOptions.cookiePrefix ?? environment.APP_NAME ?? "";
  opts.cookieOptions.sameSite = opts.cookieOptions.sameSite ?? "lax";
  opts.cookieOptions.secure = opts.cookieOptions.secure ?? isProduction();

  opts.cookieOptions.cookies = opts.cookieOptions.cookies ?? [
    { domain: "own" },
    { domain: "origin" },
  ];

  if (!opts.enableHeaderTransport && !opts.enableCookieTransport) {
    throw AppError.serverError({
      message:
        "Invalid session transport settings. Either needs `enableHeaderTransport` or `enabledCookieTransport` set.",
    });
  }

  if (
    opts.cookieOptions.cookiePrefix.length > 0 &&
    !opts.cookieOptions.cookiePrefix.endsWith(".")
  ) {
    opts.cookieOptions.cookiePrefix += ".";
  }

  for (const cookieOpt of opts.cookieOptions.cookies) {
    if (!cookieOpt.domain) {
      throw AppError.serverError({
        message: "Missing domain in SessionTransportCookieSettings",
      });
    }

    cookieOpt.sameSite = cookieOpt.sameSite ?? opts.cookieOptions.sameSite;
    cookieOpt.secure = cookieOpt.secure ?? opts.cookieOptions.secure;
  }

  return opts;
}

/**
 * Read the authorization header from the Koa context
 *
 * @param {import("koa").Context} ctx
 * @return {string|undefined}
 */
function sessionTransportLoadAuthorizationHeader(ctx) {
  const header = ctx.headers?.["authorization"] ?? "";

  if (!header.startsWith("Bearer ") || header.substring(7).length === 0) {
    return undefined;
  }

  return header.substring(7);
}

/**
 * Load the access token from cookies, refreshing the tokens when a only a refresh token
 * is found. Returns
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {import("koa").Context} ctx
 * @param {SessionTransportSettings} options
 * @returns {Promise<string|undefined>}
 */
async function sessionTransportLoadCookies(event, sql, ctx, options) {
  eventStart(event, "sessionTransport.loadCookies");

  let accessToken = ctx.cookies.get(getCookieName(options, "accessToken"));
  const refreshToken = ctx.cookies.get(getCookieName(options, "refreshToken"));

  if (
    options.autoRefreshCookies &&
    !isNil(accessToken) &&
    accessToken.length === 0 &&
    !isNil(refreshToken) &&
    refreshToken.length > 0
  ) {
    const tokenPair = await sessionStoreRefreshTokens(
      newEventFromEvent(event),
      sql,
      options.sessionStoreSettings,
      refreshToken,
    );

    if (tokenPair.error) {
      // We can ignore these errors and remove the left over tokens, since they are
      // invalid.
      await sessionTransportAddAsCookiesToContext(
        newEventFromEvent(event),
        ctx,
        undefined,
        options,
      );
      eventStop(event);

      return accessToken;
    }

    await sessionTransportAddAsCookiesToContext(
      newEventFromEvent(event),
      ctx,
      tokenPair.value,
      options,
    );

    accessToken = tokenPair.value.accessToken;
  }

  eventStop(event);

  return accessToken;
}

/**
 * Determine the cookie name based on cookie options
 *
 * @param {SessionTransportSettings} options
 * @param {string} suffix
 * @returns {string}
 */
function getCookieName(options, suffix) {
  return (options.cookieOptions?.cookiePrefix ?? "") + suffix;
}

/**
 * Resolve the domain setting
 *
 * @param {import("koa").Context} ctx
 * @param {"own"|"origin"|string} domain
 * @return {undefined|string}
 */
function getResolvedDomain(ctx, domain) {
  if (domain === "own") {
    return undefined;
  } else if (domain === "origin") {
    const originHeader = ctx.get("origin");

    if (originHeader) {
      return new URL(originHeader).hostname;
    }

    return undefined;
  }

  return domain;
}
