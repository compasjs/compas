/// <reference path="./types/advanced-types.d.ts">

/**
 * @template T, E
 * @typedef {import("./types/advanced-types.js").Either<T, E>} Either
 */

/**
 * @template T,E
 * @typedef {import("./types/advanced-types.js").EitherN<T,E>} EitherN
 */

/**
 * @typedef {import("./src/logger.js").Logger} Logger
 */

/**
 * @typedef {import("./src/config-loader.js").ConfigLoaderOptions} ConfigLoaderOptions
 */

/**
 * @typedef {import("./src/config-loader.js").ConfigLoaderResult} ConfigLoaderResult
 */

/**
 * @typedef {import("./src/events.js").InsightEvent} InsightEvent
 */

/**
 * @typedef {import("./types/advanced-types.js").ProcessDirectoryOptions}
 *   ProcessDirectoryOptions
 */

export {
  configLoaderGet,
  configLoaderDeleteCache,
} from "./src/config-loader.js";

export { uuid } from "./src/datatypes.js";

export { AppError } from "./src/error.js";

export {
  isProduction,
  isStaging,
  environment,
  refreshEnvironmentCache,
} from "./src/env.js";

export {
  isNil,
  isPlainObject,
  merge,
  flatten,
  unFlatten,
  camelToSnakeCase,
} from "./src/lodash.js";

export {
  exec,
  spawn,
  streamToBuffer,
  pathJoin,
  processDirectoryRecursive,
  processDirectoryRecursiveSync,
} from "./src/node.js";

export {
  getSecondsSinceEpoch,
  gc,
  mainFn,
  noop,
  filenameForModule,
  dirnameForModule,
} from "./src/utils.js";

export {
  newLogger,
  loggerGetGlobalDestination,
  loggerSetGlobalDestination,
  loggerGetPrettyPrinter,
  loggerExtendGlobalContext,
  loggerDetermineDefaultDestination,
  asyncLocalStorageLogger,
  contextAwarelogger,
} from "./src/logger.js";

export { bytesToHumanReadable, printProcessMemoryUsage } from "./src/memory.js";

export {
  newEvent,
  eventStart,
  eventRename,
  eventStop,
  newEventFromEvent,
} from "./src/events.js";

export {
  _compasSentryExport,
  compasWithSentry,
  _compasSentryEnableQuerySpans,
} from "./src/sentry.js";
