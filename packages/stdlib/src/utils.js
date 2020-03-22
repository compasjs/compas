import dotenv from "dotenv";
import { lstatSync, realpathSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { setFlagsFromString } from "v8";
import { runInNewContext } from "vm";
import { isNil } from "./lodash.js";

export const getSecondsSinceEpoch = () => Math.floor(Date.now() / 1000);

/**
 * Internal gc function reference
 * Note that this is undefined if the gc function is not called and Node is not running
 * with --expose-gc on
 */
let internalGc = global.gc;

/**
 * Let V8 know to please run the garbage collector.
 */
export const gc = () => {
  if (isNil(internalGc)) {
    setFlagsFromString("--expose_gc");
    internalGc = runInNewContext("gc");
  }

  internalGc();
};

/**
 * @param {ImportMeta} meta
 * @return {boolean}
 */
const isMainFn = meta => {
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
};

const setupProcessListeners = logger => {
  process.on("warning", err => logger.error(err));
};

/**
 * @callback MainFnCallback
 * @param {Logger} logger
 * @returns {Promise.<void>|void}
 */

/**
 * Run the provided cb if this file is the process entrypoint
 * Will also load dotenv before executing the provided callback.
 * Another side effect is that a process listener is added for warnings
 * @param {ImportMeta} meta
 * @param {Logger} logger
 * @param {MainFnCallback} cb
 */
export const mainFn = (meta, logger, cb) => {
  if (isMainFn(meta)) {
    dotenv.config();
    setupProcessListeners(logger);
    let result = cb(logger);
    Promise.resolve(result).catch(e => logger.error(e));
  }
};

/**
 * Return filename for ES Module
 * Alternative to CommonJS __filename
 * @param {ImportMeta} meta
 * @return {string}
 */
export const filenameForModule = meta => fileURLToPath(meta.url);

/**
 * Return dirname for ES Module
 * Alternative to CommonJS __dirname
 * @param {ImportMeta} meta
 * @return {string}
 */
export const dirnameForModule = meta => path.dirname(filenameForModule(meta));
