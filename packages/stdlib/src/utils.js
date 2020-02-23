const { setFlagsFromString } = require("v8");
const { runInNewContext } = require("vm");
const { isNil } = require("./lodash");

const getSecondsSinceEpoch = () => Math.floor(Date.now() / 1000);

/**
 * Internal gc function reference
 * Note that this is undefined if the gc function is not called and Node is not running
 * with --expose-gc on
 */
let internalGc = global.gc;

/**
 * Let V8 know to please run the garbage collector.
 */
const gc = () => {
  if (isNil(internalGc)) {
    setFlagsFromString("--expose_gc");
    internalGc = runInNewContext("gc");
  }

  internalGc();
};

/**
 * @callback MainFnCallback
 * @param {Logger} logger
 * @returns {Promise.<void>|void}
 */

/**
 * Run the provided cb if this file is the process entrypoint
 * @param {NodeJS.Module} module
 * @param {NodeJS.Require} require
 * @param {Logger} logger
 * @param {MainFnCallback} cb
 */
const mainFn = (module, require, logger, cb) => {
  if (module === require.main) {
    let result = cb(logger);
    Promise.resolve(result).catch(e => logger.error(e));
  }
};

module.exports = {
  getSecondsSinceEpoch,
  gc,
  mainFn,
};
