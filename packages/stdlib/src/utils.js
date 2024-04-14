import { lstatSync, realpathSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setFlagsFromString } from "node:v8";
import { runInNewContext } from "node:vm";
import dotenv from "dotenv";
import { environment, isProduction, refreshEnvironmentCache } from "./env.js";
import { AppError } from "./error.js";
import { isNil } from "./lodash.js";
import {
  loggerDetermineDefaultDestination,
  loggerExtendGlobalContext,
  newLogger,
} from "./logger.js";
import { _compasSentryExport } from "./sentry.js";

/**
 * Get the number of seconds since Unix epoch (1-1-1970).
 *
 * @since 0.1.0
 *
 * @returns {number}
 */
export function getSecondsSinceEpoch() {
  return Math.floor(Date.now() / 1000);
}

/**
 * A function that returns 'undefined'.
 *
 * @since 0.1.0
 * @type {import("../types/advanced-types.d.ts").NoopFn}
 */
export function noop() {}

/**
 * Internal gc function reference.
 * Note that this is undefined if the gc function is not called and Node is not running
 * with --expose-gc on.
 */
let internalGc = global.gc;

/**
 * HACKY
 *
 * @since 0.1.0
 *
 * @returns {void}
 */
export function gc() {
  if (isNil(internalGc)) {
    setFlagsFromString("--expose_gc");
    internalGc = runInNewContext("gc");
  }

  // @ts-ignore
  internalGc();
}

/**
 * Checks if the provided import.meta source is used as the project entrypoint.
 * If so, reads the .env file, prepares the environmentCache, adds some handlers for
 * uncaught exceptions,  and calls the provided callback
 *
 * @since 0.1.0
 * @summary Process entrypoint executor
 *
 * @param {ImportMeta} meta
 * @param {(logger: import("./logger.js").Logger) => void|Promise<void>} cb
 * @returns {void}
 */
export function mainFn(meta, cb) {
  const { isMainFn, name } = isMainFnAndReturnName(meta);
  if (!isMainFn) {
    return;
  }

  // Load .env.local first, since existing values in `process.env` are not overwritten.
  dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
  dotenv.config();

  refreshEnvironmentCache();

  if (isProduction() && environment.APP_NAME) {
    loggerExtendGlobalContext({
      application: environment.APP_NAME,
    });
  }

  loggerDetermineDefaultDestination();

  const logger = newLogger({
    ctx: { type: name },
  });

  const unhandled = (error) => {
    logger.error(error);
    process.exit(1);
  };

  process.on("unhandledRejection", (reason, promise) => {
    if (_compasSentryExport) {
      _compasSentryExport.captureException(reason);
    }

    unhandled({
      type: "unhandledRejection",
      reason: AppError.format(reason),
      promise,
    });
  });

  process.on("uncaughtException", (error, origin) => {
    if (_compasSentryExport) {
      _compasSentryExport.captureException(error);
    }

    unhandled({
      type: "uncaughtException",
      error: AppError.format(error),
      origin,
    });
  });

  process.on("warning", (warn) => {
    logger.error({
      type: "warning",
      warning: AppError.format(warn),
    });
  });

  Promise.resolve(cb(logger)).catch((e) => {
    if (_compasSentryExport) {
      _compasSentryExport.captureException(e);
    }

    unhandled({
      type: "error",
      message: "Error caught from callback passed in `mainFn`",
      error: AppError.format(e),
    });
  });
}

/**
 * ES module compatibility counterpart of the CommonJS __filename
 *
 * @since 0.1.0
 *
 * @param {ImportMeta} meta
 * @returns {string}
 */
export function filenameForModule(meta) {
  return fileURLToPath(meta.url);
}

/**
 * ES module compatibility counterpart of the CommonJS __dirname
 *
 * @since 0.1.0
 *
 * @param {ImportMeta} meta
 * @returns {string}
 */
export function dirnameForModule(meta) {
  return path.dirname(filenameForModule(meta));
}

/**
 * Checks if the provided meta.url is the process entrypoint and also returns the name of
 * the entrypoint file
 *
 * @param {ImportMeta} meta
 * @returns {{ isMainFn: boolean, name?: string}}
 */
export function isMainFnAndReturnName(meta) {
  const modulePath = fileURLToPath(meta.url);

  let scriptPath = process.argv[1];

  // Support following symbolic links for node_modules/.bin items
  const scriptStat = lstatSync(scriptPath);
  if (scriptStat.isSymbolicLink()) {
    scriptPath = realpathSync(scriptPath);
  }
  const scriptPathExt = path.extname(scriptPath);
  if (scriptPathExt) {
    return {
      isMainFn: modulePath === scriptPath,
      name: scriptPath
        .substring(0, scriptPath.length - scriptPathExt.length)
        .split(path.sep)
        .pop(),
    };
  }

  let modulePathWithoutExt = modulePath;
  const modulePathExt = path.extname(modulePath);
  if (modulePathExt) {
    modulePathWithoutExt = modulePathWithoutExt.slice(0, -modulePathExt.length);
  }

  return {
    isMainFn: modulePathWithoutExt === scriptPath,
    name: modulePathWithoutExt.split(path.sep).pop(),
  };
}
