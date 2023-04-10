/**
 * @typedef {ReturnType<getApp>} KoaApplication
 */
/**
 * @typedef {object} GetAppOptions
 * @property {boolean|undefined} [proxy] Trust proxy headers, defaults to true in
 *   production.
 * @property {boolean|undefined} [disableHeaders] Skip CORS and Strict Transport Security
 *   headers.
 * @property {boolean|undefined} [disableHealthRoute] Disable GET /_health
 * @property {ErrorHandlerOptions|undefined} [errorOptions] Flexible error handling
 *   options
 * @property {HeaderOptions|undefined} [headers] Argument for defaultHeader middleware.
 *   Can only be completely disabled by setting `disableHeaders`.
 * @property {import("./middleware/log.js").LogOptions|undefined} [logOptions] Pass
 *   custom log options to the log middleware.
 */
/**
 * @typedef {object} ErrorHandlerOptions
 * @property {((
 *     ctx: Koa.Context,
 *     key: string,
 *     info: any
 *   ) => Record<string, any> )| undefined} [onAppError] Called to set the initial body
 *   when the error is an AppError
 * @property {((ctx: Koa.Context, err: Error) => boolean)|undefined} [onError] Called
 *   before any logic, to let the user handle errors. If 'true' is returned, no other
 *   logic is applied.
 */
/**
 * @typedef {object} HeaderOptions
 * @property {CorsOptions|undefined} [cors] CORS options, defaults to empty object.
 */
/**
 * @typedef {object} CorsOptions
 * @property {string|((ctx: Koa.Context) => (string|undefined))} [origin]
 *   'Access-Control-Allow-Origin', defaults to the 'Origin' header.
 * @property {string|string[]|undefined} [exposeHeaders] 'Access-Control-Expose-Headers'
 * @property {string|number|undefined} [maxAge] 'Access-Control-Max-Age' in seconds
 * @property {boolean|undefined} [credentials] 'Access-Control-Allow-Credentials'
 * @property {string|string[]|undefined} [allowMethods] 'Access-Control-Allow-Methods',
 *   defaults to ["DELETE", "GET", "PUT", "POST", "PATCH", "HEAD", "OPTIONS"]
 * @property {string|string[]|undefined} [allowHeaders] 'Access-Control-Allow-Headers'
 */
/**
 * Create a new Koa instance with default middleware applied.
 * Adds the following:
 *
 * - Health check route on `/_health`
 * - Log middleware to add the Logger from @compas/stdlib on `ctx.log`
 * - Error handler to catch any errors thrown by route handlers
 * - A 404 handler when no response is set by other middleware
 * - Default headers to respond to things like CORS requests
 *
 * @since 0.1.0
 * @summary Create a new Koa instance with default middleware applied.
 *
 * @param {GetAppOptions} [opts={}]
 */
export function getApp(
  opts?: GetAppOptions | undefined,
): Koa<Koa.DefaultState, Koa.DefaultContext>;
export type KoaApplication = ReturnType<typeof getApp>;
export type GetAppOptions = {
  /**
   * Trust proxy headers, defaults to true in
   * production.
   */
  proxy?: boolean | undefined;
  /**
   * Skip CORS and Strict Transport Security
   * headers.
   */
  disableHeaders?: boolean | undefined;
  /**
   * Disable GET /_health
   */
  disableHealthRoute?: boolean | undefined;
  /**
   * Flexible error handling
   * options
   */
  errorOptions?: ErrorHandlerOptions | undefined;
  /**
   * Argument for defaultHeader middleware.
   * Can only be completely disabled by setting `disableHeaders`.
   */
  headers?: HeaderOptions | undefined;
  /**
   * Pass
   * custom log options to the log middleware.
   */
  logOptions?: import("./middleware/log.js").LogOptions | undefined;
};
export type ErrorHandlerOptions = {
  /**
   * Called to set the initial body
   * when the error is an AppError
   */
  onAppError?:
    | ((ctx: Koa.Context, key: string, info: any) => Record<string, any>)
    | undefined;
  /**
   * Called
   * before any logic, to let the user handle errors. If 'true' is returned, no other
   * logic is applied.
   */
  onError?: ((ctx: Koa.Context, err: Error) => boolean) | undefined;
};
export type HeaderOptions = {
  /**
   * CORS options, defaults to empty object.
   */
  cors?: CorsOptions | undefined;
};
export type CorsOptions = {
  /**
   * 'Access-Control-Allow-Origin', defaults to the 'Origin' header.
   */
  origin?: string | ((ctx: Koa.Context) => string | undefined) | undefined;
  /**
   * 'Access-Control-Expose-Headers'
   */
  exposeHeaders?: string | string[] | undefined;
  /**
   * 'Access-Control-Max-Age' in seconds
   */
  maxAge?: string | number | undefined;
  /**
   * 'Access-Control-Allow-Credentials'
   */
  credentials?: boolean | undefined;
  /**
   * 'Access-Control-Allow-Methods',
   * defaults to ["DELETE", "GET", "PUT", "POST", "PATCH", "HEAD", "OPTIONS"]
   */
  allowMethods?: string | string[] | undefined;
  /**
   * 'Access-Control-Allow-Headers'
   */
  allowHeaders?: string | string[] | undefined;
};
import Koa from "koa";
//# sourceMappingURL=app.d.ts.map
