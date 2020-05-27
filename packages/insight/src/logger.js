import { writeNDJSON, writePretty } from "./writer.js";

/**
 * @name LoggerOptions
 *
 * @typedef {object}
 * @property {boolean} [pretty=false]
 * @property {number} [depth=3]
 * @property {WriteStream} [stream=process.stdout]
 * @property {*|{type: string}} [ctx]
 */

/**
 * @name LogFn
 *
 * @typedef {function(arg: *): undefined}
 */

/**
 * @name Logger
 *
 * @typedef {object}
 * @property {function(): boolean} isProduction
 * @property {LogFn} info
 * @property {LogFn} error
 */

/**
 * Create a new logger
 * @param {LoggerOptions} [options]
 * @return {Logger}
 */
export function newLogger(options) {
  const isProduction =
    options?.pretty === false || process.env.NODE_ENV === "production";
  const stream = options?.stream ?? process.stdout;
  const depth = options?.depth ?? 3;

  const logFn = isProduction
    ? wrapWriter(writeNDJSON)
    : wrapWriter(writePretty);

  if (options?.ctx === undefined) {
    return {
      isProduction: () => isProduction,
      info: logFn.bind(undefined, stream, depth, "info"),
      error: logFn.bind(undefined, stream, depth, "error"),
    };
  } else {
    return {
      isProduction: () => isProduction,
      info: logFn.bind(undefined, stream, depth, "info", options.ctx),
      error: logFn.bind(undefined, stream, depth, "error", options.ctx),
    };
  }
}

/**
 * Bind a context object to the logger functions and returns a new Logger
 * @param {Logger} logger
 * @param {*} ctx
 * @return {Logger}
 */
export function bindLoggerContext(logger, ctx) {
  const isProd = logger.isProduction();
  return {
    isProduction: () => isProd,
    info: logger.info.bind(undefined, ctx),
    error: logger.error.bind(undefined, ctx),
  };
}

function wrapWriter(fn) {
  return function log(stream, depth, level, context, message) {
    const timestamp = new Date();
    if (!message) {
      message = context;
      context = {};
    }
    fn(stream, depth, level, timestamp, context, message);
  };
}
