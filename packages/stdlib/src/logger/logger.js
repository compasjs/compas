import { pino } from "pino";
import { environment, isProduction } from "../env.js";
import { merge } from "../lodash.js";
import { noop } from "../utils.js";
import { writeGithubActions, writePretty } from "./writer.js";

/**
 * @typedef {object} GlobalLoggerOptions
 * @property {Parameters<import("pino").transport<any>>[0]} [pinoTransport] Set pino
 *   transport, only used if the printer is 'ndjson'.
 * @property {import("pino").DestinationStream} [pinoDestination] Set Pino
 *   destination, only used if the printer is 'ndjson' and no 'pinoTransport' is
 *   provided. Use `pino.destination()` create the destination or provide a stream.
 */

/**
 * @type {{pretty: (writePretty|((stream: NodeJS.WritableStream, level: string,
 *   timestamp: Date, context: string, message: any) => void)|*), "github-actions":
 *   (writeGithubActions|((stream: NodeJS.WritableStream, level: string, timestamp: Date,
 *   context: string, message: any) => void)|*)}}
 */
const writersLookup = {
  pretty: writePretty,
  "github-actions": writeGithubActions,
};

let globalPino = pino(
  {
    formatters: {
      level: (label) => ({ level: label }),
      bindings: () => ({}),
    },
    serializers: {},
    base: {},
  },
  pino.destination(1),
);

/** @type {object} */
const globalContext = {};

/**
 * Shallow assigns properties of the provided context to the global context.
 * These properties can still be overwritten by providing the 'ctx' property when
 * creating a new Logger.
 *
 * @param {Record<string, any>} context
 */
export function extendGlobalLoggerContext(context) {
  Object.assign(globalContext, context);
}

/**
 * Set various logger options, affecting loggers created after calling this function.
 *
 * @param {GlobalLoggerOptions} options
 */
export function setGlobalLoggerOptions({ pinoTransport, pinoDestination }) {
  if (pinoTransport) {
    globalPino = pino({
      formatters: {
        level: (label) => ({ level: label }),
        bindings: () => ({}),
      },
      serializers: {},
      base: {},

      // @ts-ignore
      transport: pinoTransport,
    });
  } else if (pinoDestination) {
    globalPino = pino(
      {
        formatters: {
          level: (label) => ({ level: label }),
          bindings: () => ({}),
        },
        serializers: {},
        base: {},
      },
      pinoDestination,
    );
  }
}

/**
 * Create a new logger instance
 *
 * @since 0.1.0
 *
 * @param {import("../../types/advanced-types.js").LoggerOptions|undefined} [options]
 * @returns {import("../../types/advanced-types.js").Logger}
 */
export function newLogger(options) {
  const stream = options?.stream ?? process.stdout;

  const printer =
    options?.printer ??
    (environment.GITHUB_ACTIONS !== "true"
      ? isProduction()
        ? "ndjson"
        : "pretty"
      : "github-actions");

  const context = merge({}, globalContext, options?.ctx ?? {});

  if (printer === "ndjson") {
    const pinoLogger = globalPino.child({ context });

    return {
      info: options?.disableInfoLogger
        ? noop
        : (message) => pinoLogger.info({ message }),
      error: options?.disableErrorLogger
        ? noop
        : (message) => pinoLogger.error({ message }),
    };
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
