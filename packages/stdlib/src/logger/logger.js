import { environment, isProduction } from "../env.js";
import { noop } from "../utils.js";
import { writeGithubActions, writeNDJSON, writePretty } from "./writer.js";

const writersLookup = {
  ndjson: writeNDJSON,
  pretty: writePretty,
  "github-actions": writeGithubActions,
};

/**
 * @typedef {import("../../types/advanced-types").LoggerOptions} LoggerOptions
 */

/**
 * Create a new logger instance
 *
 * @since 0.1.0
 *
 * @param {LoggerOptions|undefined} [options]
 * @returns {import("../../types/advanced-types.js").Logger}
 */
export function newLogger(options) {
  const app = environment.APP_NAME;
  const stream = options?.stream ?? process.stdout;

  const printer =
    options?.printer ??
    (environment.GITHUB_ACTIONS !== "true"
      ? isProduction()
        ? "ndjson"
        : "pretty"
      : "github-actions");

  let context = options?.ctx ?? {};
  if (isProduction()) {
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
 * @param {Record<string, any>} context
 * @returns {(arg: any) => void}
 */
function wrapWriter(fn, stream, level, context) {
  return (message) => {
    const timestamp = new Date();
    fn(stream, level, timestamp, context, message ?? {});
  };
}
