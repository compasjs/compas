import { writeNDJSON, writePretty } from "./writer.js";

const defaultOptions = {
  isProduction: () => process.env.NODE_ENV === "production",
  stream: () => process.stdout,
  ctx: () => {},
  depth: () => 3,
};

/**
 * Create a new logger
 * @param {object} [options]
 * @param {boolean} [options.isProduction] If true, logs in NDJSON, else pretty print
 * @param {NodeJS.WritableStream} [options.stream=process.stdout] Output stream to write to
 * @param {object} [options.ctx] Context to log on all logs
 * @param {string} [options.ctx.type] Special case to make logs easier to aggregate
 * @param {number} [options.depth] Depth of recursion's of log formatter
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

/**
 * Logger instance
 */
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
   * level: "info"
   * @param args
   */
  info(...args) {
    logger(this.isProd, this.stream, this.depth, this.ctx, "info", ...args);
  }

  /**
   * @public
   * level: "error"
   * @param args
   */
  error(...args) {
    logger(this.isProd, this.stream, this.depth, this.ctx, "error", ...args);
  }

  /**
   * @public
   * Change the depth of this logger
   * @param {number} depth
   */
  setDepth(depth) {
    this.depth = depth;
  }

  /**
   * @public
   * Check if we are logging in production
   * @return {boolean}
   */
  isProduction() {
    return this.isProd;
  }

  /**
   * @public
   * Get context of this logger
   * @return {object}
   */
  getCtx() {
    return this.ctx;
  }

  /**
   * @public
   * Update context for this logger
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
