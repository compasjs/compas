import { merge } from "@lbu/stdlib";
import koaBody from "koa-body";

let memoizeBodyParser;
let memoizeMultipartBodyParser;

/**
 * Creates a body parser and a body parser with multipart enabled
 * Note that koa-body parses url-encoded, form data, json and text by default
 * @param {Object} [opts={}] Options that will be passed to koa-body
 */
export function createBodyParsers(opts = {}) {
  const multiPartOpts = merge({}, opts);

  opts.multipart = false;
  multiPartOpts.multipart = true;

  memoizeBodyParser = koaBody(opts);
  memoizeMultipartBodyParser = koaBody(multiPartOpts);
}

/**
 * Middleware to parse querystring and request body
 * Only use this before a route that needs access to ctx.request.body or ctx.request.query
 * @returns {*} Koa middleware
 */
export function getBodyParser() {
  if (memoizeBodyParser === undefined) {
    throw new Error(
      "Body parser used before initialization. Call createBodyParsers first",
    );
  }

  return memoizeBodyParser;
}

/**
 * Middleware to parse querystring and request body with file support
 * Only use this before a route that needs access to ctx.request.body, ctx.request.files
 * or ctx.request.query
 * @returns {*} Koa middleware
 */
export function getMultipartBodyParser() {
  if (memoizeMultipartBodyParser === undefined) {
    throw new Error(
      "Multipart body parser used before initialization. Call createBodyParsers first",
    );
  }

  return memoizeMultipartBodyParser;
}
