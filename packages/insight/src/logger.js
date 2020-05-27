import { writeNDJSON, writePretty } from "./writer.js";

/**
 * @name LoggerOptions
 *
 * @typedef {object}
 * @property {boolean} [pretty=false] Use the pretty formatter instead of the NDJSON formatter
 * @property {number} [depth=3] Max-depth printed
 * @property {WriteStream} [stream=process.stdout] The stream to write the logs to
 * @property {*|{type: string}} [ctx] Context that should be logged in all log lines. e.g
 *   a common request id.
 */

/**
 * @name LogFn
 *
 * Prints the provided argument
 *
 * @typedef {function(arg: *): undefined}
 */

/**
 * @name Logger
 *
 * The logger only has two severities:
 * - info
 * - error
 *
 * Either a log line is innocent enough and only provides debug information if needed, or
 *   someone should be paged because something goes wrong. For example handled 500 errors
 *   don't need any ones attention, but unhandled 500 errors do.
 * @see {@lbu/server#logMiddleware}
 *
 * @typedef {object}
 * @property {function(): boolean} isProduction Check if this logger is using the pretty
 *   printer or NDJSON printer
 * @property {LogFn} info Info log
 * @property {LogFn} error Error log
 */

/**
 * Create a new logger
 *
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
 * The context is always printed
 *
 * @param {Logger} logger
 * @param {object|{type: string}} ctx
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

/**
 * Wrap provided writer function to be used in the Logger
 *
 * @param fn
 * @return {log}
 */
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
