import dotenv from "dotenv";
import { lstatSync, realpathSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { setFlagsFromString } from "v8";
import { runInNewContext } from "vm";
import { isNil } from "./lodash.js";

/**
 * Return seconds since unix epoch
 *
 * @returns {number}
 */
export function getSecondsSinceEpoch() {
  return Math.floor(Date.now() / 1000);
}

/**
 * An empty function, doing exactly nothing but returning undefined.
 *
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
 * Let V8 know to please run the garbage collector.
 */
export function gc() {
  if (isNil(internalGc)) {
    setFlagsFromString("--expose_gc");
    internalGc = runInNewContext("gc");
  }

  internalGc();
}

/**
 * @callback MainFnCallback
 * @param {Logger} logger
 * @returns {Promise.<void>|void}
 */

/**
 * Run the provided cb if this file is the process entrypoint
 * Will also load dotenv before executing the provided callback.
 * Another side effect is that a process listener is added for warnings
 *
 * @param {ImportMeta} meta
 * @param {Logger} logger
 * @param {MainFnCallback} cb
 */
export function mainFn(meta, logger, cb) {
  if (isMainFn(meta)) {
    dotenv.config();
    setupProcessListeners(logger);
    let result = cb(logger);
    Promise.resolve(result).catch((e) => logger.error(e));
  }
}

/**
 * Return filename for ES Module
 * Alternative to CommonJS __filename
 *
 * @param {ImportMeta} meta
 * @returns {string}
 */
export function filenameForModule(meta) {
  return fileURLToPath(meta.url);
}

/**
 * Return dirname for ES Module
 * Alternative to CommonJS __dirname
 *
 * @param {ImportMeta} meta
 * @returns {string}
 */
export function dirnameForModule(meta) {
  return path.dirname(filenameForModule(meta));
}

/**
 * @param {ImportMeta} meta
 * @returns {boolean}
 */
function isMainFn(meta) {
  const modulePath = fileURLToPath(meta.url);

  let scriptPath = process.argv[1];

  // Support following symbolic links for node_modules/.bin items
  const scriptStat = lstatSync(scriptPath);
  if (scriptStat.isSymbolicLink()) {
    scriptPath = realpathSync(scriptPath);
  }
  const scriptPathExt = path.extname(scriptPath);
  if (scriptPathExt) {
    return modulePath === scriptPath;
  }

  let modulePathWithoutExt = modulePath;
  const modulePathExt = path.extname(modulePath);
  if (modulePathExt) {
    modulePathWithoutExt = modulePathWithoutExt.slice(0, -modulePathExt.length);
  }

  return modulePathWithoutExt === scriptPath;
}

/**
 * @param logger
 */
function setupProcessListeners(logger) {
  process.on("warning", (err) => logger.error(err));
}
