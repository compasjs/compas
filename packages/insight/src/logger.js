import { writeNDJSON, writePretty } from "./writer.js";

/**
 * @callback LogFn
 * @param {...*} args
 * @returns {void}
 */

/**
 * @typedef Logger
 * @property {LogFn} info
 * @property {LogFn} error
 */

/**
 * Create a new logger
 * @param {Object=} opts
 * @param {boolean=} opts.isProduction
 * @param {NodeJS.WritableStream} [opts.stream=process.stdout]
 * @param {Object} [opts.ctx={}]
 * @param {number} [opts.depth=3]
 */
export const newLogger = opts => {
  opts = opts || {};
  opts.isProduction =
    typeof opts.isProduction === "boolean"
      ? opts.isProduction
      : process.env.NODE_ENV === "production";
  opts.stream = opts.stream || process.stdout;
  opts.ctx = opts.ctx || {};
  opts.depth = opts.depth || 3;

  return {
    info: logger.bind(
      undefined,
      opts.isProduction,
      opts.stream,
      opts.depth,
      opts.ctx,
      "info",
    ),
    error: logger.bind(
      undefined,
      opts.isProduction,
      opts.stream,
      opts.depth,
      opts.ctx,
      "error",
    ),
    setDepth: setDepth.bind(undefined, opts),
    setCtx: setCtx.bind(undefined, opts),
    getCtx: () => opts.ctx,
  };
};

/**
 * @param opts
 * @param {number} depth
 */
const setDepth = (opts, depth) => {
  opts.depth = depth;
  return newLogger(opts);
};

/**
 * @param opts
 * @param {Object} ctx
 */
const setCtx = (opts, ctx) => {
  opts.ctx = ctx;
  return newLogger(opts);
};

/**
 * @param {boolean} isProduction
 * @param {WritableStream} stream
 * @param {number} depth
 * @param {Object} ctx
 * @param {"info", "error"} level
 * @param {*} args
 */
const logger = (isProduction, stream, depth, ctx, level, ...args) => {
  const metaData = {
    ...ctx,
    level,
    timestamp: new Date(),
    message: args.length === 1 ? args[0] : args,
  };

  if (isProduction) {
    writeNDJSON(stream, depth, metaData);
  } else {
    writePretty(stream, depth, metaData);
  }
};
