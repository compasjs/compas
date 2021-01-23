import { lstatSync, realpathSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { setFlagsFromString } from "v8";
import { runInNewContext } from "vm";
import { newLogger } from "@compas/insight";
import dotenv from "dotenv";
import { isProduction, refreshEnvironmentCache } from "./env.js";
import { AppError } from "./error.js";
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
  if (!isMainFn) {
    return;
  }

  dotenv.config();
  refreshEnvironmentCache();

  const logger = newLogger({
    ctx: { type: name },
    pretty: !isProduction(),
  });

  const unhandled = (error) => {
    logger.error(error);
    process.exit(1);
  };

  process.on("unhandledRejection", (reason, promise) =>
    unhandled({
      type: "unhandledRejection",
      reason: AppError.format(reason),
      promise,
    }),
  );

  process.on("uncaughtExceptionMonitor", (error, origin) =>
    logger.error({
      type: "uncaughtException",
      error: AppError.format(error),
      origin,
    }),
  );

  process.on("warning", (warn) =>
    logger.error({
      type: "warning",
      warning: AppError.format(warn),
    }),
  );

  Promise.resolve(cb(logger)).catch((e) => {
    unhandled({
      type: "error",
      message: "Error caught from callback passed in `mainFn`",
      error: AppError.format(e),
    });
  });
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
 * Checks if the provided meta.url is the process entrypoint and also returns the name of
 * the entrypoint file
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
