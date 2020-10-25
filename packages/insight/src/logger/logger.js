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

  const context = isProduction
    ? JSON.stringify(options?.ctx ?? {})
    : options?.ctx ?? {};

  return {
    isProduction: () => isProduction,
    info: logFn.bind(undefined, stream, "info", context),
    error: logFn.bind(undefined, stream, "error", context),
  };
}

/**
 * Wrap provided writer function to be used in the Logger
 */
function wrapWriter(fn) {
  return (stream, level, context, message) => {
    const timestamp = new Date();
    fn(stream, level, timestamp, context, message ?? {});
  };
}
