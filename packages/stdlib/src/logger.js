import { pino } from "pino";
import { environment, isProduction } from "./env.js";
import { AppError } from "./error.js";
import { isNil, isPlainObject, merge } from "./lodash.js";
import { loggerWriteGithubActions, loggerWritePretty } from "./log-writers.js";

/**
 * @typedef {object} Logger
 *
 * The logger only has two severities:
 * - info
 * - error
 *
 * Either a log line is innocent enough and only provides debug information if needed, or
 *   someone should be paged because something goes wrong. For example, handled 400 errors
 *   probably do not require anyones attention, but unhandled 500 errors do.
 *
 * The log functions only accept a single parameter. This prevents magic
 * outputs like automatic concatenating strings in to a single message, or always having
 *   a top-level array as a message.
 * @property {function(*): void} info
 * @property {function(*): void} error
 */

/**
 * @type {Record<string, any>}
 */
const globalContext = {};

/**
 * @type {import("pino").DestinationStream|undefined}
 */
let globalDestination = undefined;

/**
 * @type {import("pino").Logger}
 */
let rootInstance = loggerBuildRootInstance(pino.destination(1));

/**
 * Deeply update the global logger context. This only affects newly created loggers
 *
 * @param {Record<string, any>} context
 */
export function loggerExtendGlobalContext(context) {
  if (!isPlainObject(context)) {
    throw AppError.serverError({
      message: "First argument should be a plain JS object",
    });
  }

  merge(globalContext, context);
}

/**
 * Set the global logger destination to use the provided pino destination. This only
 * affects loggers created after this function call.
 *
 * You can use any form of support Pino destination here. Even
 * {@link https://getpino.io/#/docs/transports Pino transports} via `pino.transport()`.
 * It defaults to `pino.destination(1)` which writes to `process.stdout`.
 *
 * @see https://getpino.io/#/docs/api?id=pino-destination
 *
 * @param {import("pino").DestinationStream} destination
 */
export function loggerSetGlobalDestination(destination) {
  globalDestination = destination;
  rootInstance = loggerBuildRootInstance(destination);
}

/**
 * Returns the current pino destination.
 *
 * This can be used to temporarily set a different destination for the newly created
 * loggers and then reusing the destination for the rest of your application.
 *
 * @returns {import("pino").DestinationStream}
 */
export function loggerGetGlobalDestination() {
  // @ts-expect-error
  return globalDestination;
}

/**
 * Set the global root pino instance. We use a single instance, so the same destination
 * will be used for all sub loggers.
 *
 * @param {import("pino").DestinationStream} destination
 */
export function loggerBuildRootInstance(destination) {
  return pino(
    {
      formatters: {
        level: (label) => ({ level: label }),
        bindings: () => ({}),
      },
      serializers: {},
      base: {},
    },
    destination,
  );
}

/**
 * Create a new logger instance. The provided `ctx` will shallowly overwrite the global
 * context that is set via {@see loggerExtendGlobalContext}.
 *
 * The logger uses the transport or destination set via
 *
 * @param {{ ctx?: Record<string, any> }} [options]
 * @returns {Logger}
 */
export function newLogger(options) {
  const context = options?.ctx
    ? {
        ...globalContext,
        ...options.ctx,
      }
    : globalContext;

  const childLogger = rootInstance.child({
    context,
  });

  return {
    info: (message) => childLogger.info({ message }),
    error: (message) => childLogger.error({ message }),
  };
}

/**
 * Infer the default printer that we should use based on the currently set environment
 * variables.
 *
 * Can be overwritten by `process.env.COMPAS_LOG_PRINTER`. Accepted values are `pretty',
 * 'ndjson', 'github-actions'.
 */
export function loggerDetermineDefaultDestination() {
  if (globalDestination) {
    return;
  }

  const isProd = isProduction();
  const isGitHubActions = environment.GITHUB_ACTIONS === "true";
  let printer = environment.COMPAS_LOG_PRINTER;

  if (isNil(printer)) {
    printer = isGitHubActions ? "github-actions" : isProd ? "ndjson" : "pretty";
  }

  if (!["github-actions", "ndjson", "pretty"].includes(printer)) {
    throw AppError.serverError({
      message: `process.env.COMPAS_LOG_PRINTER is set to a '${printer}', but only accepts 'ndjson', 'pretty' or 'github-actions'.`,
    });
  }

  if (printer === "ndjson") {
    return;
  }

  loggerSetGlobalDestination(
    loggerGetPrettyPrinter({
      addGitHubActionsAnnotations: printer === "github-actions",
    }),
  );
}

/**
 *
 * @param {{
 *  addGitHubActionsAnnotations: boolean,
 * }} options
 * @returns {import("pino").DestinationStream}
 */
export function loggerGetPrettyPrinter(options) {
  function write(line) {
    const data = JSON.parse(line);

    if (options.addGitHubActionsAnnotations) {
      loggerWriteGithubActions(
        process.stdout,
        data.level,
        new Date(data.time),
        data.context,
        data.message,
      );
    } else {
      loggerWritePretty(
        process.stdout,
        data.level,
        new Date(data.time),
        data.context,
        data.message,
      );
    }
  }

  return {
    write,
  };
}
