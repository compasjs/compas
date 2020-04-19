import { writeNDJSON, writePretty } from "./writer.js";

/**
 * @typedef {object} LoggerOptions
 * @property {boolean} [pretty=false]
 * @property {number} [depth=3]
 * @property {WriteStream} [stream=process.stdout]
 * @property {object} [ctx={}]
 */

/**
 * @typedef {function(args: ...*): undefined} LogFn
 */

/**
 * @typedef {object} Logger
 * @property {function(opts: LoggerOptions): Logger} derive
 * @property {function(): boolean} isProduction
 * @property {LogFn} info
 * @property {LogFn} error
 */

/**
 * Create a new logger
 * @param {LoggerOptions} [options]
 * @return {Logger}
 */
export function newLogger(options) {
  let _internal = Object.assign(
    {
      pretty: process.env.NODE_ENV !== "production",
      depth: 3,
      stream: process.stdout,
      ctx: {},
    },
    options,
  );

  return {
    isProduction: () => !_internal.pretty,
    info: logger.bind(
      undefined,
      _internal.pretty,
      _internal.stream,
      _internal.depth,
      _internal.ctx,
      "info",
    ),
    error: logger.bind(
      undefined,
      _internal.pretty,
      _internal.stream,
      _internal.depth,
      _internal.ctx,
      "error",
    ),
    derive: (opts) => {
      return newLogger({ ..._internal, ...opts });
    },
  };
}

function logger(pretty, stream, depth, ctx, level, ...args) {
  const metaData = {
    ...ctx,
    level,
    timestamp: new Date(),
    message: args.length === 1 ? args[0] : args,
  };
  if (!pretty) {
    writeNDJSON(stream, depth, metaData);
  } else {
    writePretty(stream, depth, metaData);
  }
}
