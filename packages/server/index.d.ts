// Original types from @types/koa & @types/koa-compose
//
// This project is licensed under the MIT license.
// Copyrights are respective of each contributor listed at the beginning of each definition
// file.
// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files (the "Software"), to deal in the Software
// without restriction, including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
// to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or
// substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
// ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
// THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// Type definitions for koa-compose 3.2
// Project: https://github.com/koajs/compose
// Definitions by: jKey Lu <https://github.com/jkeylu>
//                 Anton Astashov <https://github.com/astashov>
// TypeScript Version: 2.3
//
// Type definitions for Koa 2.11.0
// Project: http://koajs.com
// Definitions by: DavidCai1993 <https://github.com/DavidCai1993>
//                 jKey Lu <https://github.com/jkeylu>
//                 Brice Bernard <https://github.com/brikou>
//                 harryparkdotio <https://github.com/harryparkdotio>
//                 Wooram Jun <https://github.com/chatoo2412>
//
// Type definitions for koa-session 5.10
// Project: https://github.com/koajs/session
// Definitions by: Yu Hsin Lu <https://github.com/kerol2r20>
//                 Tomek Łaziuk <https://github.com/tlaziuk>
//                 Hiroshi Ioka <https://github.com/hirochachacha>

import { InsightEvent, Logger } from "@compas/insight";
import { StoreFile } from "@compas/store";
import { AxiosInstance } from "axios";
import { EventEmitter } from "events";
import { Files } from "formidable";
import { IncomingMessage, Server, ServerResponse } from "http";
import { ListenOptions, Socket } from "net";
import * as url from "url";
import ReadableStream = NodeJS.ReadableStream;

/**
 * @private
 */
interface ContextDelegatedRequest {
  /**
   * Return request header.
   */
  header: any;

  /**
   * Return request header, alias as request.header
   */
  headers: any;

  /**
   * Get/Set request URL.
   */
  url: string;

  /**
   * Get origin of URL.
   */
  origin: string;

  /**
   * Get full request URL.
   */
  href: string;

  /**
   * Get/Set request method.
   */
  method: string;

  /**
   * Get request pathname.
   * Set pathname, retaining the query-string when present.
   */
  path: string;

  /**
   * Get parsed query-string.
   * Set query-string as an object.
   */
  query: any;

  /**
   * Get/Set query string.
   */
  querystring: string;

  /**
   * Get the search string. Same as the querystring
   * except it includes the leading ?.
   *
   * Set the search string. Same as
   * response.querystring= but included for ubiquity.
   */
  search: string;

  /**
   * Parse the "Host" header field host
   * and support X-Forwarded-Host when a
   * proxy is enabled.
   */
  host: string;

  /**
   * Parse the "Host" header field hostname
   * and support X-Forwarded-Host when a
   * proxy is enabled.
   */
  hostname: string;

  /**
   * Get WHATWG parsed URL object.
   */
  URL: url.URL;

  /**
   * Check if the request is fresh, aka
   * Last-Modified and/or the ETag
   * still match.
   */
  fresh: boolean;

  /**
   * Check if the request is stale, aka
   * "Last-Modified" and / or the "ETag" for the
   * resource has changed.
   */
  stale: boolean;

  /**
   * Check if the request is idempotent.
   */
  idempotent: boolean;

  /**
   * Return the request socket.
   */
  socket: Socket;

  /**
   * Return the protocol string "http" or "https"
   * when requested with TLS. When the proxy setting
   * is enabled the "X-Forwarded-Proto" header
   * field will be trusted. If you're running behind
   * a reverse proxy that supplies https for you this
   * may be enabled.
   */
  protocol: string;

  /**
   * Short-hand for:
   *
   *    this.protocol == 'https'
   */
  secure: boolean;

  /**
   * Request remote address. Supports X-Forwarded-For when app.proxy is true.
   */
  ip: string;

  /**
   * When `app.proxy` is `true`, parse
   * the "X-Forwarded-For" ip address list.
   *
   * For example if the value were "client, proxy1, proxy2"
   * you would receive the array `["client", "proxy1", "proxy2"]`
   * where "proxy2" is the furthest down-stream.
   */
  ips: string[];

  /**
   * Return subdomains as an array.
   *
   * Subdomains are the dot-separated parts of the host before the main domain
   * of the app. By default, the domain of the app is assumed to be the last two
   * parts of the host. This can be changed by setting `app.subdomainOffset`.
   *
   * For example, if the domain is "tobi.ferrets.example.com":
   * If `app.subdomainOffset` is not set, this.subdomains is
   * `["ferrets", "tobi"]`.
   * If `app.subdomainOffset` is 3, this.subdomains is `["tobi"]`.
   */
  subdomains: string[];

  /**
   * Check if the given `type(s)` is acceptable, returning
   * the best match when true, otherwise `undefined`, in which
   * case you should respond with 406 "Not Acceptable".
   *
   * The `type` value may be a single mime type string
   * such as "application/json", the extension name
   * such as "json" or an array `["json", "html", "text/plain"]`. When a list
   * or array is given the _best_ match, if any is returned.
   *
   * Examples:
   *
   *     // Accept: text/html
   *     this.accepts('html');
   *     // => "html"
   *
   *     // Accept: text/*, application/json
   *     this.accepts('html');
   *     // => "html"
   *     this.accepts('text/html');
   *     // => "text/html"
   *     this.accepts('json', 'text');
   *     // => "json"
   *     this.accepts('application/json');
   *     // => "application/json"
   *
   *     // Accept: text/*, application/json
   *     this.accepts('image/png');
   *     this.accepts('png');
   *     // => undefined
   *
   *     // Accept: text/*;q=.5, application/json
   *     this.accepts(['html', 'json']);
   *     this.accepts('html', 'json');
   *     // => "json"
   */
  accepts(): string[] | boolean;

  accepts(...types: string[]): string | boolean;

  accepts(types: string[]): string | boolean;

  /**
   * Return accepted encodings or best fit based on `encodings`.
   *
   * Given `Accept-Encoding: gzip, deflate`
   * an array sorted by quality is returned:
   *
   *     ['gzip', 'deflate']
   */
  acceptsEncodings(): string[] | boolean;

  acceptsEncodings(...encodings: string[]): string | boolean;

  acceptsEncodings(encodings: string[]): string | boolean;

  /**
   * Return accepted charsets or best fit based on `charsets`.
   *
   * Given `Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5`
   * an array sorted by quality is returned:
   *
   *     ['utf-8', 'utf-7', 'iso-8859-1']
   */
  acceptsCharsets(): string[] | boolean;

  acceptsCharsets(...charsets: string[]): string | boolean;

  acceptsCharsets(charsets: string[]): string | boolean;

  /**
   * Return accepted languages or best fit based on `langs`.
   *
   * Given `Accept-Language: en;q=0.8, es, pt`
   * an array sorted by quality is returned:
   *
   *     ['es', 'pt', 'en']
   */
  acceptsLanguages(): string[] | boolean;

  acceptsLanguages(...langs: string[]): string | boolean;

  acceptsLanguages(langs: string[]): string | boolean;

  /**
   * Check if the incoming request contains the "Content-Type"
   * header field, and it contains any of the give mime `type`s.
   * If there is no request body, `null` is returned.
   * If there is no content type, `false` is returned.
   * Otherwise, it returns the first `type` that matches.
   *
   * Examples:
   *
   *     // With Content-Type: text/html; charset=utf-8
   *     this.is('html'); // => 'html'
   *     this.is('text/html'); // => 'text/html'
   *     this.is('text/*', 'application/json'); // => 'text/html'
   *
   *     // When Content-Type is application/json
   *     this.is('json', 'urlencoded'); // => 'json'
   *     this.is('application/json'); // => 'application/json'
   *     this.is('html', 'application/*'); // => 'application/json'
   *
   *     this.is('html'); // => false
   */
  // is(): string | boolean;
  is(...types: string[]): string | boolean;

  is(types: string[]): string | boolean;

  /**
   * Return request header. If the header is not set, will return an empty
   * string.
   *
   * The `Referrer` header field is special-cased, both `Referrer` and
   * `Referer` are interchangeable.
   *
   * Examples:
   *
   *     this.get('Content-Type');
   *     // => "text/plain"
   *
   *     this.get('content-type');
   *     // => "text/plain"
   *
   *     this.get('Something');
   *     // => ''
   */
  get(field: string): string;
}

/**
 * @private
 */
interface ContextDelegatedResponse {
  /**
   * Get/Set response status code.
   */
  status: number;

  /**
   * Get response status message
   */
  message: string;

  /**
   * Get/Set response body.
   */
  body: unknown;

  /**
   * Return parsed response Content-Length when present.
   * Set Content-Length field to `n`.
   */
  length: number;

  /**
   * Check if a header has been written to the socket.
   */
  headerSent: boolean;

  /**
   * Vary on `field`.
   */
  vary(field: string): void;

  /**
   * Perform a 302 redirect to `url`.
   *
   * The string "back" is special-cased
   * to provide Referrer support, when Referrer
   * is not present `alt` or "/" is used.
   *
   * Examples:
   *
   *    this.redirect('back');
   *    this.redirect('back', '/index.html');
   *    this.redirect('/login');
   *    this.redirect('http://google.com');
   */
  redirect(url: string, alt?: string): void;

  /**
   * Return the response mime type void of
   * parameters such as "charset".
   *
   * Set Content-Type response header with `type` through `mime.lookup()`
   * when it does not contain a charset.
   *
   * Examples:
   *
   *     this.type = '.html';
   *     this.type = 'html';
   *     this.type = 'json';
   *     this.type = 'application/json';
   *     this.type = 'png';
   */
  type: string;

  /**
   * Get the Last-Modified date in Date form, if it exists.
   * Set the Last-Modified date using a string or a Date.
   *
   *     this.response.lastModified = new Date();
   *     this.response.lastModified = '2013-09-13';
   */
  lastModified: Date;

  /**
   * Get/Set the ETag of a response.
   * This will normalize the quotes if necessary.
   *
   *     this.response.etag = 'md5hashsum';
   *     this.response.etag = '"md5hashsum"';
   *     this.response.etag = 'W/"123456789"';
   *
   * @param {string} etag
   * @api public
   */
  etag: string;

  /**
   * Set header `field` to `val`, or pass
   * an object of header fields.
   *
   * Examples:
   *
   *    this.set('Foo', ['bar', 'baz']);
   *    this.set('Accept', 'application/json');
   *    this.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
   */
  set(field: { [key: string]: string }): void;

  set(field: string, val: string | string[]): void;

  /**
   * Append additional header `field` with value `val`.
   *
   * Examples:
   *
   * ```
   * this.append('Link', ['<http://localhost/>', '<http://localhost:3000/>']);
   * this.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly');
   * this.append('Warning', '199 Miscellaneous warning');
   * ```
   */
  append(field: string, val: string | string[]): void;

  /**
   * Remove header `field`.
   */
  remove(field: string): void;

  /**
   * Checks if the request is writable.
   * Tests for the existence of the socket
   * as node sometimes does not set it.
   */
  writable: boolean;

  /**
   * Flush any set headers, and begin the body
   */
  flushHeaders(): void;
}

export class Application<
  StateT = DefaultState,
  CustomT = DefaultContext
> extends EventEmitter {
  proxy: boolean;
  proxyIpHeader: string;
  maxIpsCount: number;
  middleware: Middleware<StateT, CustomT>[];
  subdomainOffset: number;
  env: string;
  context: BaseContext & CustomT;
  request: BaseRequest;
  response: BaseResponse;
  silent: boolean;
  keys: string[];

  constructor();

  /**
   * Shorthand for:
   *
   *    http.createServer(app.callback()).listen(...)
   */
  listen(
    port?: number,
    hostname?: string,
    backlog?: number,
    listeningListener?: () => void,
  ): Server;
  listen(
    port: number,
    hostname?: string,
    listeningListener?: () => void,
  ): Server;
  listen(
    port: number,
    backlog?: number,
    listeningListener?: () => void,
  ): Server;
  listen(port: number, listeningListener?: () => void): Server;
  listen(
    path: string,
    backlog?: number,
    listeningListener?: () => void,
  ): Server;
  listen(path: string, listeningListener?: () => void): Server;
  listen(options: ListenOptions, listeningListener?: () => void): Server;
  listen(handle: any, backlog?: number, listeningListener?: () => void): Server;
  listen(handle: any, listeningListener?: () => void): Server;

  /**
   * Return JSON representation.
   * We only bother showing settings.
   */
  inspect(): any;

  /**
   * Return JSON representation.
   * We only bother showing settings.
   */
  toJSON(): any;

  /**
   * Use the given middleware `fn`.
   *
   * Old-style middleware will be converted.
   */
  use<NewStateT = {}, NewCustomT = {}>(
    middleware: Middleware<StateT & NewStateT, CustomT & NewCustomT>,
  ): Application<StateT & NewStateT, CustomT & NewCustomT>;

  /**
   * Return a request handler callback
   * for node's native http/http2 server.
   */
  callback(): (req: IncomingMessage, res: ServerResponse) => Promise<void>;

  /**
   * Initialize a new context.
   *
   * @api private
   */
  createContext<StateT = DefaultState>(
    req: IncomingMessage,
    res: ServerResponse,
  ): Context<StateT>;

  /**
   * Default error handler.
   *
   * @api private
   */
  onerror(err: Error): void;
}

/**
 * @private
 */
type DefaultStateExtends = any;

/**
 * This interface can be augmented by users to add types to Koa's default state
 *
 * @private
 */
interface DefaultState extends DefaultStateExtends {}

/**
 * @private
 */
type DefaultContextExtends = {};

/**
 * This interface can be augmented by users to add types to Koa's default context
 * @private
 */
interface DefaultContext extends DefaultContextExtends {
  /**
   * Custom properties.
   */
  [key: string]: any;
}

type Middleware<StateT = DefaultState, CustomT = DefaultContext> = (
  context: Context<StateT, CustomT>,
  next: Next,
) => any;

/**
 * @private
 */
interface BaseRequest extends ContextDelegatedRequest {
  /**
   * Get the charset when present or undefined.
   */
  charset: string;

  /**
   * Return parsed Content-Length when present.
   */
  length: number;

  /**
   * Return the request mime type void of
   * parameters such as "charset".
   */
  type: string;

  body?: any;
  files?: Files;

  /**
   * Inspect implementation.
   */
  inspect(): any;

  /**
   * Return JSON representation.
   */
  toJSON(): any;
}

/**
 * @private
 */
interface BaseResponse extends ContextDelegatedResponse {
  /**
   * Return the request socket.
   */
  socket: Socket;

  /**
   * Return response header.
   */
  header: any;

  /**
   * Return response header, alias as response.header
   */
  headers: any;

  /**
   * Check whether the response is one of the listed types.
   * Pretty much the same as `this.request.is()`.
   */
  is(...types: string[]): string;

  is(types: string[]): string;

  /**
   * Return response header. If the header is not set, will return an empty
   * string.
   *
   * The `Referrer` header field is special-cased, both `Referrer` and
   * `Referer` are interchangeable.
   *
   * Examples:
   *
   *     this.get('Content-Type');
   *     // => "text/plain"
   *
   *     this.get('content-type');
   *     // => "text/plain"
   *
   *     this.get('Something');
   *     // => ''
   */
  get(field: string): string;

  /**
   * Inspect implementation.
   */
  inspect(): any;

  /**
   * Return JSON representation.
   */
  toJSON(): any;
}

/**
 * @private
 */
interface BaseContext
  extends ContextDelegatedRequest,
    ContextDelegatedResponse {
  inspect(): any;

  toJSON(): any;

  throw(message: string, code?: number, properties?: {}): never;

  /**
   * Default error handling.
   */
  onerror(err: Error): void;

  log: Logger;
  event: InsightEvent;
  session: Session | null;
}

/**
 * @private
 */
interface Request extends BaseRequest {
  app: Application;
  req: IncomingMessage;
  res: ServerResponse;
  ctx: Context;
  response: Response;
  originalUrl: string;
  ip: string;
  accept: any;
}

/**
 * @private
 */
interface Response extends BaseResponse {
  app: Application;
  req: IncomingMessage;
  res: ServerResponse;
  ctx: Context;
  request: Request;
}

/**
 * @private
 */
interface ExtendableContext extends BaseContext {
  app: Application;
  request: Request;
  response: Response;
  req: IncomingMessage;
  res: ServerResponse;
  originalUrl: string;
  cookies: any;
  accept: any;
  /**
   * To bypass Koa's built-in response handling, you may explicitly set `ctx.respond = false;`
   */
  respond?: boolean;
}

export type Context<
  StateT = DefaultState,
  CustomT = DefaultContext
> = ExtendableContext & {
  state: StateT;
} & CustomT;

export type Next = () => void | Promise<void>;

/**
 * @private
 */
export function compose<T1, U1, T2, U2>(
  middleware: [Middleware<T1, U1>, Middleware<T2, U2>],
): Middleware<T1 & T2, U1 & U2>;

/**
 * @private
 */
export function compose<T1, U1, T2, U2, T3, U3>(
  middleware: [Middleware<T1, U1>, Middleware<T2, U2>, Middleware<T3, U3>],
): Middleware<T1 & T2 & T3, U1 & U2 & U3>;

/**
 * @private
 */
export function compose<T1, U1, T2, U2, T3, U3, T4, U4>(
  middleware: [
    Middleware<T1, U1>,
    Middleware<T2, U2>,
    Middleware<T3, U3>,
    Middleware<T4, U4>,
  ],
): Middleware<T1 & T2 & T3 & T4, U1 & U2 & U3 & U4>;

/**
 * @private
 */
export function compose<T1, U1, T2, U2, T3, U3, T4, U4, T5, U5>(
  middleware: [
    Middleware<T1, U1>,
    Middleware<T2, U2>,
    Middleware<T3, U3>,
    Middleware<T4, U4>,
    Middleware<T5, U5>,
  ],
): Middleware<T1 & T2 & T3 & T4 & T5, U1 & U2 & U3 & U4 & U5>;

/**
 * @private
 */
export function compose<T1, U1, T2, U2, T3, U3, T4, U4, T5, U5, T6, U6>(
  middleware: [
    Middleware<T1, U1>,
    Middleware<T2, U2>,
    Middleware<T3, U3>,
    Middleware<T4, U4>,
    Middleware<T5, U5>,
    Middleware<T6, U6>,
  ],
): Middleware<T1 & T2 & T3 & T4 & T5 & T6, U1 & U2 & U3 & U4 & U5 & U6>;

/**
 * @private
 */
export function compose<T1, U1, T2, U2, T3, U3, T4, U4, T5, U5, T6, U6, T7, U7>(
  middleware: [
    Middleware<T1, U1>,
    Middleware<T2, U2>,
    Middleware<T3, U3>,
    Middleware<T4, U4>,
    Middleware<T5, U5>,
    Middleware<T6, U6>,
    Middleware<T7, U7>,
  ],
): Middleware<
  T1 & T2 & T3 & T4 & T5 & T6 & T7,
  U1 & U2 & U3 & U4 & U5 & U6 & U7
>;

/**
 * @private
 */
export function compose<
  T1,
  U1,
  T2,
  U2,
  T3,
  U3,
  T4,
  U4,
  T5,
  U5,
  T6,
  U6,
  T7,
  U7,
  T8,
  U8
>(
  middleware: [
    Middleware<T1, U1>,
    Middleware<T2, U2>,
    Middleware<T3, U3>,
    Middleware<T4, U4>,
    Middleware<T5, U5>,
    Middleware<T6, U6>,
    Middleware<T7, U7>,
    Middleware<T8, U8>,
  ],
): Middleware<
  T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8,
  U1 & U2 & U3 & U4 & U5 & U6 & U7 & U8
>;

/**
 * Compose middleware
 */
export function compose<T>(
  middleware: Array<Middleware<T>>,
): (context: T, next?: Next) => Promise<void>;

/**
 * @private
 */
interface Session {
  /**
   * JSON representation of the session.
   */
  toJSON(): object;

  /**
   * alias to `toJSON`
   */
  inspect(): object;

  /**
   * Return how many values there are in the session object.
   * Used to see if it"s "populated".
   */
  readonly length: number;

  /**
   * populated flag, which is just a boolean alias of .length.
   */
  readonly populated: boolean;

  /**
   * get/set session maxAge
   */
  maxAge: SessionOptions["maxAge"];

  /**
   * save this session no matter whether it is populated
   */
  save(): void;

  /**
   * allow to put any value on session object
   */
  [_: string]: any;
}

/**
 * @private
 */
interface SessionStore {
  /**
   * get session object by key
   */
  get(
    key: string,
    maxAge: SessionOptions["maxAge"],
    data: { rolling: SessionOptions["rolling"] },
  ): any;

  get(id: string): Promise<object | boolean>;

  /**
   * set session object for key, with a maxAge (in ms)
   */
  set(
    key: string,
    sess: Partial<Session> & { _expire?: number; _maxAge?: number },
    maxAge: SessionOptions["maxAge"],
    data: { changed: boolean; rolling: SessionOptions["rolling"] },
  ): any;

  set(id: string, session: object, age: number): Promise<void>;

  /**
   * destroy session for key
   */
  destroy(key: string): any;

  destroy(id: string): Promise<void>;
}

export interface SessionOptions {
  /**
   * cookie key (default is process.env.APP_NAME.sess)
   */
  key?: string;

  /**
   * Domain to set the cookie for
   * When development (default undefined)
   * When production (default process.env.COOKIE_URL)
   */
  domain?: string;

  /**
   * maxAge in ms (default is 6 days)
   * "session" will result in a cookie that expires when session/browser is closed or when
   * eighteen hours are passed without a request.
   * Works best with the options 'rolling' set to true
   */
  maxAge?: number | "session";

  /**
   * Automatically commit headers (default true)
   */
  autoCommit?: boolean;

  /**
   * Can overwrite or not (default true)
   */
  overwrite?: boolean;

  /**
   * httpOnly or not (default true)
   */
  httpOnly?: boolean;

  /**
   * Set and check signature cookie (default true)
   */
  signed?: boolean;

  /**
   * Set Secure cookie, only available in https context (default process.env.NODE_ENV ===
   * "production")
   */
  secure?: boolean;

  /**
   * Session cookie sameSite options (default "lax")
   */
  sameSite?: "strict" | "lax" | boolean;

  /**
   * Force a session identifier cookie to be set on every response. The expiration is reset to
   * the original maxAge, resetting the expiration countdown. default is false
   */
  rolling?: boolean;

  /**
   * Renew session when session is nearly expired, so we can always keep user logged in.
   * (default is true)
   */
  renew?: boolean;

  /**
   * You can store the session content in external stores(redis, mongodb or other DBs)
   * Use `newSessionStore` provided by `@compas/store`
   */
  store?: SessionStore;

  /**
   * Keeps a plain browser JS readable cookie in sync with the session cookie.
   * This allows the browser to do some basic conditional rendering and api calls, that are
   * right most of the time. Note that this cookie is not signed, and the real verification
   * and session happens in the httpOnly cookie.
   */
  keepPublicCookie?: boolean;

  /**
   * If your session store requires data or utilities from context, opts.ContextStore is alse
   * supported. ContextStore must be a class which claims three instance methods demonstrated
   * above. new ContextStore(ctx) will be executed on every request.
   */
  ContextStore?: { new (ctx: Context): SessionStore };

  /**
   * If you want to add prefix for all external session id, you can use options.prefix, it
   * will not work if options.genid present.
   */
  prefix?: string;
}

// ===========
// END OF @types
// ============

interface KoaBodyOptions {
  /**
   * Defaults to 'true'
   */
  urlencoded?: boolean | undefined;

  /**
   * Defaults to 'true'
   */
  json?: boolean | undefined;

  /**
   * Defaults to 'true'
   */
  text?: boolean | undefined;

  /**
   * Defaults to 'utf-8'
   */
  encoding?: string | undefined;

  /**
   * See 'https://github.com/ljharb/qs' for available options
   */
  queryString?: any | undefined;

  /**
   * Defaults to '1mb'
   */
  jsonLimit?: string | undefined;

  /**
   * Defaults to '1mb'
   */
  formLimit?: string | undefined;

  /**
   * Defaults to '56kb'
   */
  textLimit?: string | undefined;

  /**
   * Defaults to '["POST", "PUT", "PATCH"]'
   */
  parsedMethods?: string[] | undefined;
}

/**
 * @private
 */
interface IFormidableBodyOptions {
  /**
   * {string} - default 'utf-8'; sets encoding for incoming form fields
   */
  encoding?: string;

  /**
   * default `os.tmpdir()` the directory for placing file uploads in. You can move them later
   * by using `fs.rename()`
   */
  uploadDir?: string;

  /**
   * {boolean} - default false; to include the extensions of the original files or not
   */
  keepExtensions?: boolean;

  /**
   * {number} - default 200 * 1024 * 1024 (200mb); limit the size of uploaded file
   */
  maxFileSize?: number;

  /**
   * {number} - default 1000; limit the number of fields that the Querystring parser will
   * decode, set 0 for unlimited
   */
  maxFields?: number;

  /**
   * {number} - default 20 * 1024 * 1024 (20mb); limit the amount of memory all fields
   * together (except files) can allocate in bytes
   */
  maxFieldsSize?: number;

  /**
   * {boolean} - default false; include checksums calculated for incoming files, set this to
   * some hash algorithm, see crypto.createHash for available algorithms
   */
  hash?: boolean;
}

/**
 * Extract data for the response from the AppError data
 */
export interface AppErrorHandler {
  (ctx: Context, key: string, info: any): Record<string, any>;
}

/**
 * Return truthy when handled or falsey when skipped
 */
export interface CustomErrorHandler {
  (ctx: Context, err: Error): boolean;
}

export interface ErrorHandlerOptions {
  /**
   * Called to set the initial body when the error is an AppError
   */
  onAppError?: AppErrorHandler;

  /**
   * Called before all others to let the user handle their own errors
   */
  onError?: CustomErrorHandler;

  /**
   * Useful on development and staging environments to just dump the error to the consumer
   */
  leakError?: boolean;
}

export interface HeaderOptions {
  cors?: CorsOptions;
}

export interface CorsOptions {
  /**
   * `Access-Control-Allow-Origin`, default is request Origin header
   */
  origin?: string | ((ctx: Context) => string | undefined);

  /**
   * `Access-Control-Expose-Headers`
   */
  exposeHeaders?: string[] | string;

  /**
   * `Access-Control-Max-Age` in seconds
   */
  maxAge?: string | number;

  /**
   * `Access-Control-Allow-Credentials`
   */
  credentials?: boolean;

  /**
   * `Access-Control-Allow-Methods`, default is ['GET', 'PUT', 'POST', 'PATCH', 'DELETE',
   * 'HEAD', 'OPTIONS']
   */
  allowMethods?: string[] | string;

  /**
   * `Access-Control-Allow-Headers`
   */
  allowHeaders?: string[] | string;
}

export interface GetAppOptions {
  /**
   * Trust proxy headers
   */
  proxy?: boolean;

  /**
   * Don't handle cors headers
   */
  disableHeaders?: boolean;

  /**
   * Disable GET /_health
   */
  disableHealthRoute?: boolean;

  /**
   * Flexible error handling options
   */
  errorOptions?: ErrorHandlerOptions;

  /**
   * Argument for defaultHeader middleware
   */
  headers?: HeaderOptions;

  /**
   * Options passed to the log middleware
   */
  logOptions?: {
    /**
     * Disable event creation on ctx.event
     */
    disableRootEvent?: boolean;
  };
}

/**
 * Create a new Koa instance with some default middleware
 */
export function getApp(opts?: GetAppOptions): Application;

export interface BodyParserPair {
  bodyParser: Middleware;
  multipartBodyParser: Middleware;
}

/**
 * Creates a body parser and a body parser with multipart enabled
 * Note that koa-body parses url-encoded, form data, json and text by default
 */
export function createBodyParsers(
  bodyOptions?: KoaBodyOptions,
  multipartBodyOptions?: IFormidableBodyOptions,
): BodyParserPair;

/**
 * Compatible with @compas/store files. Needs either updated_at or last_modified
 * @private
 */
type SendFileItem =
  | StoreFile
  | (Pick<StoreFile, "id" | "contentLength" | "contentType"> & {
      lastModified: Date;
    });

/**
 * @private
 */
interface GetStreamFn {
  (fileInfo: SendFileItem, start?: number, end?: number): Promise<{
    stream: ReadableStream;
    cacheControl?: string;
  }>;
}

/**
 * Send any file to the ctx.body
 * User is free to set Cache-Control
 */
export function sendFile(
  ctx: Context,
  file: unknown,
  getStreamFn: GetStreamFn,
): Promise<void>;

/**
 * Session middleware
 * Requires process.env.APP_KEYS
 * To generate a key use something like
 * node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
 * For more information read koa-session docs.
 * See also the custom `supportOptionOverwrites` property on `SessionOptions`.
 */
export function session(app: Application, options: SessionOptions): Middleware;

/**
 * Calls app.listen on a random port and sets the correct baseURL on the provided axios
 * instance
 */
export function createTestAppAndClient(
  app: Application,
  axios: AxiosInstance,
): Promise<void>;

/**
 * Stops the server created with `createTestAppAndClient`
 */
export function closeTestApp(app: Application): Promise<void>;
