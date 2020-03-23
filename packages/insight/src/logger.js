import { writeNDJSON, writePretty } from "./writer.js";

const defaultOptions = {
  isProduction: () => process.env.NODE_ENV === "production",
  stream: () => process.stdout,
  ctx: () => {},
  depth: () => 3,
};

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
 * @param {Object} [options]
 * @param {boolean} [options.isProduction]
 * @param {NodeJS.WritableStream} [options.stream=process.stdout]
 * @param {Object} [options.ctx]
 * @param {number} [options.depth]
 * @return {{isProduction: (function(): boolean), setCtx: (function(Object): void),
 *   getCtx: (function(): Object|*), error: LogFn, setDepth: (function(number): void),
 *   info: LogFn}}
 */
export const newLogger = (options = {}) => {
  const stream = options.stream || defaultOptions.stream();
  const isProduction =
    typeof options.isProduction === "boolean"
      ? options.isProduction
      : defaultOptions.isProduction();
  let ctx = options.ctx || defaultOptions.ctx();
  let depth = options.depth || defaultOptions.depth();

  return {
    info: (...args) => {
      logger(isProduction, stream, depth, ctx, "info", ...args);
    },
    error: (...args) => {
      logger(isProduction, stream, depth, ctx, "error", ...args);
    },
    setDepth: (newDepth) => {
      depth = newDepth;
    },
    setCtx: (newCtx) => {
      ctx = newCtx;
    },
    getCtx: () => ctx,
    isProduction: () => isProduction,
  };
};

function logger(isProduction, stream, depth, ctx, level, ...args) {
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
}
