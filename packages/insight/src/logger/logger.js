import { writeNDJSON, writePretty } from "./writer.js";

/**
 * @param {LoggerOptions} [options]
 * @returns {Logger}
 */
export function newLogger(options) {
  const isProduction =
    options?.pretty === false || process.env.NODE_ENV === "production";
  const stream = options?.stream ?? process.stdout;

  const logFn = isProduction
    ? wrapWriter(writeNDJSON)
    : wrapWriter(writePretty);

  if (options?.ctx === undefined) {
    return {
      isProduction: () => isProduction,
      info: logFn.bind(undefined, stream, "info"),
      error: logFn.bind(undefined, stream, "error"),
    };
  }
  return {
    isProduction: () => isProduction,
    info: logFn.bind(undefined, stream, "info", options.ctx),
    error: logFn.bind(undefined, stream, "error", options.ctx),
  };
}

/**
 * @param {Logger} logger
 * @param {LoggerContext} ctx
 * @returns {Logger}
 */
export function bindLoggerContext(logger, ctx) {
  const isProd = logger.isProduction();
  return {
    isProduction: () => isProd,
    info: logger.info.bind(undefined, ctx),
    error: logger.error.bind(undefined, ctx),
  };
}

/**
 * Wrap provided writer function to be used in the Logger
 *
 * @param fn
 * @returns {log}
 */
function wrapWriter(fn) {
  return function log(stream, level, context, message) {
    const timestamp = new Date();
    if (!message) {
      message = context;
      context = {};
    }
    fn(stream, level, timestamp, context, message);
  };
}
