/**
 * The logger only has two severities:
 * - info
 * - error
 *
 * Either a log line is innocent enough and only provides debug information if needed, or
 *   someone should be paged because something goes wrong. For example handled 500 errors
 *   don't need any ones attention, but unhandled 500 errors do.
 *
 * The log functions {@ee Logger#info} only accepts a single parameter. This prevents magic
 * outputs like automatic concatenating strings in to a single message, or always having a top
 * level array as a message.
 */
export interface Logger {
  /**
   * Check if this logger is using the pretty
   *   printer or NDJSON printer
   */
  isProduction(): boolean;

  info(arg: any): void;

  error(arg: any): void;
}

/**
 * Context that should be logged in all log lines. e.g
 *   a common request id.
 */
interface LoggerContext {
  type?: string;
}

export interface LoggerOptions<T extends LoggerContext> {
  /**
   * Use the pretty formatter instead of the NDJSON formatter
   */
  pretty?: boolean;

  /**
   * Max-depth printed
   */
  depth?: number;

  /**
   * The stream to write the logs to
   */
  stream?: NodeJS.WritableStream;

  /**
   * Context that should be logged in all log lines. e.g
   *   a common request id.
   */
  ctx?: T;
}

/**
 * Create a new logger
 *
 */
export function newLogger<T extends LoggerContext>(
  options?: LoggerOptions<T>,
): Logger;

/**
 * Bind a context object to the logger functions and returns a new Logger
 * The context is always printed
 */
export function bindLoggerContext<T extends LoggerContext>(
  logger: Logger,
  ctx: T,
): Logger;

/**
 * Format bytes, with up to 2 digits after the decimal point, in a more human readable way
 * Support up to a pebibyte
 */
export function bytesToHumanReadable(bytes?: number): string;

/**
 * Prints the memory usage of the current process to the provided logger
 * For more info on the printed properties see:
 * https://nodejs.org/dist/latest-v13.x/docs/api/process.html#process_process_memoryusage
 */
export function printProcessMemoryUsage(logger: Logger): void;

/**
 * Standard log instance.
 * Comes with a depth of 4, prevents printing deeply nested objects
 */
export const log: Logger;
