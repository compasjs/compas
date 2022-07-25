/**
 * Deeply update the global logger context. This only affects newly created loggers
 *
 * @param {Record<string, any>} context
 */
export function loggerExtendGlobalContext(context: Record<string, any>): void;
/**
 * Set the global logger destination to use the provided pino destination. This only
 * affects loggers created after this function call.
 *
 * You can use any form of support Pino destination here. Even
 * {@link https://getpino.io/#/docs/transports Pino transports} via `pino.transport()`.
 * It defaults to `pino.destination(1)` which writes to `process.stdout`.
 *
 * @see https://getpino.io/#/docs/api?id=pino-destination
 *
 * @param {import("pino").DestinationStream} destination
 */
export function loggerSetGlobalDestination(
  destination: import("pino").DestinationStream,
): void;
/**
 * Set the global root pino instance. We use a single instance, so the same destination
 * will be used for all sub loggers.
 *
 * @param {import("pino").DestinationStream} destination
 */
export function loggerBuildRootInstance(
  destination: import("pino").DestinationStream,
): import("pino").Logger<{
  formatters: {
    level: (label: string) => {
      level: string;
    };
    bindings: () => {};
  };
  serializers: {};
  base: {};
}>;
/**
 * Create a new logger instance. The provided `ctx` will shallowly overwrite the global
 * context that is set via {@see loggerExtendGlobalContext}.
 *
 * The logger uses the transport or destination set via
 *
 * @param {{ ctx?: Record<string, any> }} [options]
 * @returns {Logger}
 */
export function newLogger(
  options?:
    | {
        ctx?: Record<string, any> | undefined;
      }
    | undefined,
): Logger;
/**
 * Infer the default printer that we should use based on the currently set environment
 * variables.
 *
 * Can be overwritten by `process.env.COMPAS_LOG_PRINTER`. Accepted values are `pretty',
 * 'ndjson', 'github-actions'.
 */
export function loggerDetermineDefaultDestination(): void;
/**
 *
 * @param {{
 *  addGitHubActionsAnnotations: boolean,
 * }} options
 * @returns {import("pino").DestinationStream}
 */
export function loggerGetPrettyPrinter(options: {
  addGitHubActionsAnnotations: boolean;
}): import("pino").DestinationStream;
/**
 * The logger only has two severities:
 * - info
 * - error
 *
 * Either a log line is innocent enough and only provides debug information if needed, or
 *   someone should be paged because something goes wrong. For example, handled 400 errors
 *   probably do not require anyones attention, but unhandled 500 errors do.
 *
 * The log functions only accept a single parameter. This prevents magic
 * outputs like automatic concatenating strings in to a single message, or always having
 *   a top-level array as a message.
 */
export type Logger = {
  info: (arg0: any) => void;
  error: (arg0: any) => void;
};
//# sourceMappingURL=logger.d.ts.map
