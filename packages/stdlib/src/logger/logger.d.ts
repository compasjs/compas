/**
 * Shallow assigns properties of the provided context to the global context.
 * These properties can still be overwritten by providing the 'ctx' property when
 * creating a new Logger.
 *
 * @param {Record<string, any>} context
 */
export function extendGlobalLoggerContext(context: Record<string, any>): void;
/**
 * Set various logger options, affecting loggers created after calling this function.
 *
 * @param {GlobalLoggerOptions} options
 */
export function setGlobalLoggerOptions({
  pinoTransport,
  pinoDestination,
}: GlobalLoggerOptions): void;
/**
 * Create a new logger instance
 *
 * @since 0.1.0
 *
 * @param {LoggerOptions|undefined} [options]
 * @returns {import("../../types/advanced-types.js").Logger}
 */
export function newLogger(
  options?: import("../../types/advanced-types").LoggerOptions<any> | undefined,
): import("../../types/advanced-types.js").Logger;
export type LoggerOptions =
  import("../../types/advanced-types").LoggerOptions<any>;
export type GlobalLoggerOptions = {
  /**
   * Set pino
   * transport, only used if the printer is 'ndjson'.
   */
  pinoTransport?:
    | pino.TransportSingleOptions<unknown>
    | pino.TransportMultiOptions<unknown>
    | pino.TransportPipelineOptions<unknown>
    | undefined;
  /**
   * Set Pino
   * destination, only used if the printer is 'ndjson' and no 'pinoTransport' is
   * provided. Use `pino.destination()` create the destination or provide a stream.
   */
  pinoDestination?: import("pino").DestinationStream | undefined;
};
import { pino } from "pino";
//# sourceMappingURL=logger.d.ts.map
