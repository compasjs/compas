import { lstatSync, realpathSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { setFlagsFromString } from "v8";
import { runInNewContext } from "vm";
import { newLogger } from "@lbu/insight";
import dotenv from "dotenv";
import { isNil } from "./lodash.js";

/**
 * @returns {number}
 */
export function getSecondsSinceEpoch() {
  return Math.floor(Date.now() / 1000);
}

/**
 * @returns {undefined}
 */
export function noop() {
  return undefined;
}

/**
 * Internal gc function reference
 * Note that this is undefined if the gc function is not called and Node is not running
 * with --expose-gc on
 */
let internalGc = global.gc;

/**
 * HACKY
 */
export function gc() {
  if (isNil(internalGc)) {
    setFlagsFromString("--expose_gc");
    internalGc = runInNewContext("gc");
  }

  internalGc();
}

/**
 * @param {ImportMeta} meta
 * @param {MainFnCallback} cb
 */
export function mainFn(meta, cb) {
  const { isMainFn, name } = isMainFnAndReturnName(meta);
  if (isMainFn) {
    dotenv.config();
    const logger = newLogger({
      ctx: { type: name },
    });

    const unhandled = (error) => {
      logger.error(error);
      process.exit(1);
    };

    // Just kill the process
    process.on("unhandledRejection", (reason, promise) =>
      unhandled({
        reason: {
          name: reason.name,
          message: reason.message,
          stack: reason.stack,
        },
        promise: {
          name: promise.name,
          message: promise.message,
          stack: promise.stack,
        },
      }),
    );

    // Node.js by default will kill the process, we just make sure to log correctly
    process.on("uncaughtExceptionMonitor", (error, origin) =>
      logger.error({
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        origin,
      }),
    );
    // Log full warnings as well, no need for exiting
    process.on("warning", (warn) =>
      logger.error({
        name: warn.name,
        message: warn.message,
        stack: warn.stack,
      }),
    );

    // Handle async errors from the provided callback as `unhandledRejections`
    Promise.resolve(cb(logger)).catch(unhandled);
  }
}

/**
 * @param {ImportMeta} meta
 * @returns {string}
 */
export function filenameForModule(meta) {
  return fileURLToPath(meta.url);
}

/**
 * @param {ImportMeta} meta
 * @returns {string}
 */
export function dirnameForModule(meta) {
  return path.dirname(filenameForModule(meta));
}

/**
 * Checks if the provided meta.url is the process entrypoint and also returns the name of the entrypoint file
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

/**
 * @returns {boolean}
 */
export function isProduction() {
  return process.env.NODE_ENV === "production";
}

/**
 * @returns {boolean}
 */
export function isStaging() {
  return (
    process.env.NODE_ENV !== "production" || process.env.IS_STAGING === "true"
  );
}
