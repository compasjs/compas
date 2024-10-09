import { AppError } from "@compas/stdlib";
import coBody from "co-body";
import formidable from "formidable";

/**
 * @typedef {object} BodyOptions
 * @property {boolean|undefined} [json] Allow JSON body parsing, defaults to true
 * @property {boolean|undefined} [urlencoded] Allow urlencoded body parsing, defaults to
 *   true
 * @property {boolean|undefined} [text] Allow text body parsing, defaults to true
 * @property {boolean|undefined} [multipart] Allow multipart body parsing, defaults to
 *   false.
 * @property {string|undefined} [encoding] Request body encoding, defaults to 'utf-8'
 * @property {object|undefined} [queryString] Options for the 'qs' package
 * @property {string|undefined} [jsonLimit] Max body size when parsing JSON, defaults to
 *   '5mb'
 * @property {string|undefined} [textLimit] Max body size when parsing text, defaults to
 *   '56kb'
 * @property {string|undefined} [urlencodedLimit] Max body size when parsing urlencoded,
 *   defaults to '1mb'
 * @property {Array<string> | undefined} [parsedMethods] The HTTP methods which enable body
 *   parsing.
 * @property {formidable.Options} [multipartOptions] Optionally specify multipart
 *   options. If no options are present, it uses the defaults from formidable and uses a
 *   custom  '1mb' field size limit, '35mb' file size limit and a max body size of
 *   '175mb'.
 */

/**
 * @type {Array<string>}
 */
const jsonTypes = [
  "application/json",
  "application/json-patch+json",
  "application/vnd.api+json",
  "application/csp-report",
];

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
 * @returns {(ctx: import("koa").Context) => Promise<void>}
 */
export function createBodyParser(opts = {}) {
  opts.json ??= true;
  opts.urlencoded ??= true;
  opts.text ??= true;
  opts.multipart ??= false;

  opts.encoding ??= "utf-8";
  opts.queryString ??= null;

  opts.jsonLimit ??= "5mb";
  opts.urlencodedLimit ??= "1mb";
  opts.textLimit ??= "56kb";

  opts.parsedMethods ??= ["POST", "PUT", "PATCH"];

  opts.multipartOptions ??= {};
  opts.multipartOptions.maxFieldsSize ??= 1 * 1024 * 1024;
  opts.multipartOptions.maxFileSize ??= 35 * 1024 * 1024;
  opts.multipartOptions.maxTotalFileSize ??=
    opts.multipartOptions.maxFileSize * 5;

  return async function (ctx) {
    let bodyResult;
    // only parse the body on specifically chosen methods
    // @ts-ignore
    if (opts.parsedMethods.includes(ctx.method.toUpperCase())) {
      try {
        if (opts.json && ctx.is(jsonTypes)) {
          bodyResult = await coBody.json(ctx, {
            encoding: opts.encoding,
            limit: opts.jsonLimit,
            strict: true,
            returnRawBody: false,
          });
        } else if (opts.urlencoded && ctx.is("urlencoded")) {
          bodyResult = await coBody.form(ctx, {
            encoding: opts.encoding,
            limit: opts.urlencodedLimit,
            queryString: opts.queryString,
            returnRawBody: false,
          });
        } else if (opts.text && ctx.is("text/*")) {
          bodyResult = await coBody.text(ctx, {
            encoding: opts.encoding,
            limit: opts.textLimit,
            returnRawBody: false,
          });
        } else if (opts.multipart && ctx.is("multipart/*")) {
          const form = formidable(opts.multipartOptions);
          await new Promise((resolve, reject) => {
            form.parse(ctx.req, (err, fields, files) => {
              if (err) {
                reject(err);
                return;
              }

              bodyResult = { ...fields, ...files };

              // @ts-expect-error
              //
              // Compat with code-gen
              ctx.request.files = files;

              // @ts-expect-error
              resolve();
            });
          });
        }
      } catch (/** @type {any} */ parsingError) {
        if (parsingError instanceof SyntaxError) {
          delete parsingError.stack;
          throw AppError.validationError("error.server.unsupportedBodyFormat", {
            name: parsingError.name,
            message: parsingError.message,

            // @ts-ignore
            rawBody: parsingError.body,
          });
        } else if (parsingError.message?.includes("exceeded, received")) {
          throw AppError.validationError(
            "error.server.maxFieldSize",
            {},
            parsingError,
          );
        } else {
          throw AppError.validationError(
            "error.server.unsupportedBodyFormat",
            {},
            parsingError,
          );
        }
      }
    }

    // @ts-expect-error
    ctx.request.body = bodyResult;
  };
}
