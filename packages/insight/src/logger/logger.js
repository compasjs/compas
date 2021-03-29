import { writeGithubActions, writeNDJSON, writePretty } from "./writer.js";

let environment = undefined;

const noop = () => {};

const writersLookup = {
  ndjson: writeNDJSON,
  pretty: writePretty,
  "github-actions": writeGithubActions,
};

/**
 * Logger options, with proper defaults.
 *
 *
 * @typedef {object} LoggerOptions
 * @template T
 *
 * @property {boolean|undefined} [disableInfoLogger] Replaces log.info with a 'noop'.
 *    Defaults to 'false'.
 * @property {boolean|undefined} [disableErrorLogger] Replaces log.error with a 'noop'.
 *    Defaults to 'false'.
 * @property {"pretty"|"ndjson"|"github-actions"|undefined} [printer] Set the printer to
 *    be used. Defaults to "pretty" when 'NODE_ENV===development', "github-actions" when
 *    'GITHUB_ACTIONS===true' and "ndjson" by default.
 * @property {NodeJS.WriteStream|undefined} [stream] Stream to write to, defaults to
 *    'process.stdout'.
 * @property {T|undefined} ctx Context to log with each line. Defaults to an empty
 *    object.
 */

/**
 * Create a new logger instance
 *
 * @since 0.1.0
 *
 * @param {LoggerOptions|undefined} [options]
 * @returns {Logger}
 */
export function newLogger(options) {
  // Make a copy of of env, process.env fetching is slow
  if (environment === undefined) {
    environment = JSON.parse(JSON.stringify(process.env));
  }

  const app = environment.APP_NAME;
  const isProduction = environment.NODE_ENV !== "development";
  const stream = options?.stream ?? process.stdout;

  const printer =
    options?.printer ??
    (environment.GITHUB_ACTIONS !== "true"
      ? isProduction
        ? "ndjson"
        : "pretty"
      : "github-actions");

  let context = options?.ctx ?? {};
  if (isProduction) {
    if (app) {
      context.application = app;
    }
    // Stringify context once
    context = JSON.stringify(context);
  }

  const info = options?.disableInfoLogger
    ? noop
    : wrapWriter(writersLookup[printer], stream, "info", context);
  const error = options?.disableErrorLogger
    ? noop
    : wrapWriter(writersLookup[printer], stream, "error", context);

  return {
    isProduction: () => isProduction,
    info,
    error,
  };
}

/**
 * Wrap provided writer function to be used in the Logger
 *
 * @param {Function} fn
 * @param {NodeJS.WriteStream} stream
 * @param {string} level
 * @param {object} context
 * @returns {Function}
 */
function wrapWriter(fn, stream, level, context) {
  return (message) => {
    const timestamp = new Date();
    fn(stream, level, timestamp, context, message ?? {});
  };
}
