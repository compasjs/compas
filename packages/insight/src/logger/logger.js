import { writeNDJSON, writePretty } from "./writer.js";

let environment = undefined;

/**
 * @param {LoggerOptions} [options]
 * @returns {Logger}
 */
export function newLogger(options) {
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
 */
function wrapWriter(fn) {
  return (stream, level, context, message) => {
    const timestamp = new Date();
    fn(stream, level, timestamp, context, message ?? {});
  };
}
