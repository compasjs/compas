import { AppError } from "@compas/stdlib";
import coBody from "co-body";
import formidable from "formidable";

/**
 * @typedef {object} KoaBodyOptions
 * @property {boolean|undefined} [urlencoded]
 * @property {boolean|undefined} [json]
 * @property {boolean|undefined} [text]
 * @property {string|undefined} [encoding]
 * @property {object|undefined} [queryString] Options for the 'qs' package
 * @property {string|undefined} [jsonLimit]
 * @property {string|undefined} [textLimit]
 * @property {string|undefined} [urlencodedLimit]
 * @property {string[]|undefined} [parsedMethods]
 */

/**
 * @typedef {object} BodyParserPair
 * @property {import("koa").Middleware} bodyParser
 * @property {import("koa").Middleware} multipartBodyParser
 */

const jsonTypes = [
  "application/json",
  "application/json-patch+json",
  "application/vnd.api+json",
  "application/csp-report",
];

/**
 * Creates a body parser and a body parser with multipart enabled.
 * Note that koa-body parses url-encoded, form data, json and text by default.
 *
 * @since 0.1.0
 *
 * @param {KoaBodyOptions} [bodyOpts={}] Options that will be passed to koa-body
 * @param {formidable.Options} [multipartBodyOpts={}] Options that will be passed to
 *   formidable
 * @returns {BodyParserPair}
 */
export function createBodyParsers(bodyOpts = {}, multipartBodyOpts = {}) {
  return {
    bodyParser: koaBody(bodyOpts),
    multipartBodyParser: koaFormidable(multipartBodyOpts),
  };
}

/**
 * Wrapper around Co-Body.
 * Forked from "Koa-Body" with original license:
 * https://github.com/dlau/koa-body/blob/a6ca8c78015e326154269d272410a11bf40e1a07/LICENSE
 *
 * @param {KoaBodyOptions} opts Options that will be passed to koa-body
 */
function koaBody(opts = {}) {
  opts.json = opts.json ?? true;
  opts.urlencoded = opts.urlencoded ?? true;
  opts.text = opts.text ?? true;

  opts.encoding = opts.encoding ?? "utf-8";
  opts.queryString = opts.queryString ?? null;

  opts.jsonLimit = opts.jsonLimit ?? "1mb";
  opts.urlencodedLimit = opts.urlencodedLimit ?? "1mb";
  opts.textLimit = opts.textLimit ?? "56kb";

  opts.parsedMethods = opts.parsedMethods ?? ["POST", "PUT", "PATCH"];

  return async function (ctx, next) {
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
        } else {
          throw AppError.validationError(
            "error.server.unsupportedBodyFormat",
            {},
            parsingError,
          );
        }
      }
    }

    ctx.request.body = bodyResult;

    if (typeof next === "function") {
      return next();
    }
  };
}

/**
 * Wrapper around Formidable, making it compatible with KoaMiddleware
 * Implementation is based on formidable.parse callback method, with some
 * changes for 'boolean' and 'array' support. multiples enabled and required.
 *
 * Source;
 * https://github.com/node-formidable/formidable/blob/master/src/Formidable.js#L103
 *
 * @param {formidable.Options} opts
 * @returns {import("koa").Middleware}
 */
function koaFormidable(opts = {}) {
  // support for arrays
  opts.multiples = true;

  return (ctx, next) => {
    if (!ctx.is("multipart/*")) {
      throw new AppError("error.server.unsupportedMediaType", 415);
    }

    return new Promise((resolve, reject) => {
      const form = formidable(opts);

      const files = {};

      form.on("file", (name, file) => {
        if (Object.prototype.hasOwnProperty.call(files, name)) {
          if (!Array.isArray(files[name])) {
            files[name] = [files[name]];
          }
          files[name].push(file);
        } else {
          files[name] = file;
        }
      });
      form.on("error", (err) => {
        if (err.message?.includes("exceeded, received")) {
          reject(AppError.validationError("error.server.maxFieldSize"));
        } else {
          reject(AppError.serverError({ files }, err));
        }
      });
      form.on("end", () => {
        // @ts-ignore
        ctx.request.files = files;
        // @ts-ignore
        resolve();
      });
      // @ts-ignore
      form.parse(ctx.req);
    }).then(() => {
      if (typeof next === "function") {
        return next();
      }
    });
  };
}
