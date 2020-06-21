import { merge } from "@lbu/stdlib";
import koaBody from "koa-body";

/**
 * Creates a body parser and a body parser with multipart enabled
 * Note that koa-body parses url-encoded, form data, json and text by default
 *
 * @param {IKoaBodyOptions} [opts={}] Options that will be passed to koa-body
 */
export function createBodyParsers(opts = {}) {
  const multiPartOpts = merge({}, opts);

  opts.multipart = false;
  multiPartOpts.multipart = true;

  return {
    bodyParser: koaBody(opts),
    multipartBodyParser: koaBody(multiPartOpts),
  };
}
