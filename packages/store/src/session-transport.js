import {
  AppError,
  eventStart,
  eventStop,
  newEventFromEvent,
} from "@compas/stdlib";
import { sessionStoreGet } from "./session-store.js";

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
export async function sessionTransportLoadFromContext(
  event,
  sql,
  ctx,
  settings,
) {
  eventStart(event, "sessionTransport.loadFromContext");

  validateSessionTransportSettings(settings);

  let accessToken;
  if (settings.enableHeaderTransport) {
    accessToken = sessionTransportLoadAuthorizationHeader(ctx);
  }

  const session = await sessionStoreGet(
    newEventFromEvent(event),
    sql,
    settings.sessionStoreSettings,
    accessToken ?? "",
  );

  eventStop(event);

  // We need to return the same `Either<X,Y>` as `sessionStoreGet`.
  return session;
}

/**
 *
 * @param {SessionTransportSettings} opts
 * @returns {SessionTransportSettings}
 */
export function validateSessionTransportSettings(opts) {
  opts.enableHeaderTransport = opts.enableHeaderTransport ?? true;
  opts.headerOptions = opts.headerOptions ?? {};

  if (!opts.enableHeaderTransport) {
    throw AppError.serverError({
      message:
        "Invalid session transport settings. Needs `enableHeaderTransport` set to 'true'.",
    });
  }

  return opts;
}

/**
 * Read the authorization header from the Koa context
 *
 * @param {import("koa").Context} ctx
 * @returns {string|undefined}
 */
function sessionTransportLoadAuthorizationHeader(ctx) {
  const header = ctx.headers?.["authorization"] ?? "";

  if (!header.startsWith("Bearer ") || header.substring(7).length === 0) {
    return undefined;
  }

  return header.substring(7);
}
