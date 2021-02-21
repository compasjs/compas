import { writeNDJSON, writePretty } from "./writer.js";

let environment = undefined;

/**
 * Create a new logger instance
 *
 * @since 0.1.0
 *
 * @param {LoggerOptions} [options]
 * @returns {Logger}
 */
export function newLogger(options) {
  // Make a copy of of env, process.env fetching is slow
  if (environment === undefined) {
    environment = JSON.parse(JSON.stringify(process.env));
  }

  const app = environment.APP_NAME;
  const isProduction =
    options?.pretty === false || environment.NODE_ENV !== "development";
  const stream = options?.stream ?? process.stdout;

  const logFn = isProduction
    ? wrapWriter(writeNDJSON)
    : wrapWriter(writePretty);

  let context = options?.ctx ?? {};
  if (isProduction) {
    if (app) {
      context.application = app;
    }
    // Stringify context once
    context = JSON.stringify(context);
  }

  return {
    isProduction: () => isProduction,
    info: logFn.bind(undefined, stream, "info", context),
    error: logFn.bind(undefined, stream, "error", context),
  };
}

/**
 * Wrap provided writer function to be used in the Logger
 *
 * @param {Function} fn
 * @returns {Function}
 */
function wrapWriter(fn) {
  return (stream, level, context, message) => {
    const timestamp = new Date();
    fn(stream, level, timestamp, context, message ?? {});
  };
}
