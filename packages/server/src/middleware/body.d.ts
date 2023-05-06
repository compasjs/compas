/**
 * Koa body parsers. Supports json, text, urlencoded & multipart bodies.
 *
 * Based on co-body & formidable.
 *
 * By default the following settings are used
 * - json is allowed with a 5mb limit
 * - urlencoded is allowed with a 1mb limit
 * - text is allowed with a 56kb limit
 * - multipart is disallowed by default. If enabled and no limits are specified a 1mb
 * field size limit, 35mb file size limit and a 175mb total file size limit is enforced.
 *
 *
 * Originally forked from "Koa-Body" with original license:
 * https://github.com/dlau/koa-body/blob/a6ca8c78015e326154269d272410a11bf40e1a07/LICENSE
 *
 * @param {BodyOptions} [opts={}] Options that will be passed to koa-body
 * @returns {import("koa").Middleware}
 */
export function createBodyParser(
  opts?: BodyOptions | undefined,
): import("koa").Middleware;
export type BodyOptions = {
  /**
   * Allow JSON body parsing, defaults to true
   */
  json?: boolean | undefined;
  /**
   * Allow urlencoded body parsing, defaults to
   * true
   */
  urlencoded?: boolean | undefined;
  /**
   * Allow text body parsing, defaults to true
   */
  text?: boolean | undefined;
  /**
   * Allow multipart body parsing, defaults to
   * false.
   */
  multipart?: boolean | undefined;
  /**
   * Request body encoding, defaults to 'utf-8'
   */
  encoding?: string | undefined;
  /**
   * Options for the 'qs' package
   */
  queryString?: object | undefined;
  /**
   * Max body size when parsing JSON, defaults to
   * '5mb'
   */
  jsonLimit?: string | undefined;
  /**
   * Max body size when parsing text, defaults to
   * '56kb'
   */
  textLimit?: string | undefined;
  /**
   * Max body size when parsing urlencoded,
   * defaults to '1mb'
   */
  urlencodedLimit?: string | undefined;
  /**
   * The HTTP methods which enable body
   * parsing.
   */
  parsedMethods?: string[] | undefined;
  /**
   * Optionally specify multipart
   * options. If no options are present, it uses the defaults from formidable and uses a
   * custom  '1mb' field size limit, '35mb' file size limit and a max body size of
   * '175mb'.
   */
  multipartOptions?: formidable.Options | undefined;
};
import formidable from "formidable";
//# sourceMappingURL=body.d.ts.map
