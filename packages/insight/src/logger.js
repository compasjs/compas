import { writeNDJSON, writePretty } from "./writer.js";

const defaultOptions = {
  isProduction: () => process.env.NODE_ENV === "production",
  stream: () => process.stdout,
  ctx: () => {},
  depth: () => 3,
};

/**
 * Create a new logger
 * @param {Object} [options]
 * @param {boolean} [options.isProduction]
 * @param {NodeJS.WritableStream} [options.stream=process.stdout]
 * @param {Object} [options.ctx]
 * @param {number} [options.depth]
 * @return {Logger}
 */
export function newLogger(options = {}) {
  const stream = options.stream || defaultOptions.stream();
  const isProduction =
    typeof options.isProduction === "boolean"
      ? options.isProduction
      : defaultOptions.isProduction();
  let ctx = options.ctx || defaultOptions.ctx();
  let depth = options.depth || defaultOptions.depth();

  return new Logger(stream, isProduction, ctx, depth);
}

class Logger {
  /**
   * @param {NodeJS.WritableStream} stream
   * @param {boolean} isProduction
   * @param {object} ctx
   * @param {number} depth
   */
  constructor(stream, isProduction, ctx, depth) {
    this.stream = stream;
    this.isProd = isProduction;
    this.ctx = ctx;
    this.depth = depth;
  }

  /**
   * @public
   * @param args
   */
  info(...args) {
    logger(this.isProd, this.stream, this.depth, this.ctx, "info", ...args);
  }

  /**
   * @public
   * @param args
   */
  error(...args) {
    logger(this.isProd, this.stream, this.depth, this.ctx, "error", ...args);
  }

  /**
   * @public
   * @param {number} depth
   */
  setDepth(depth) {
    this.depth = depth;
  }

  /**
   * @public
   * @return {boolean}
   */
  isProduction() {
    return this.isProd;
  }

  /**
   * @public
   * @return {object}
   */
  getCtx() {
    return this.ctx;
  }

  /**
   * @public
   * @param {object} ctx
   */
  setCtx(ctx) {
    this.ctx = ctx;
  }
}

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
