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
 * Standard log instance
 */
export const log: Logger;

/**
 * Basic timing and call information
 */
export type EventCall =
  | {
      type: "start" | "stop";
      name: string;

      /**
       * Time in milliseconds since some kind of epoch, this may be unix epoch or process start
       */
      time: number;
    }
  | EventCall[];

/**
 * Encapsulate the base information needed to dispatch events
 */
export interface Event {
  log: Logger;

  /**
   * If event is first event dispatched in chain
   */
  root: boolean;

  name?: string;

  callStack: EventCall[];
}

/**
 * Create a new event from a single logger
 */
export function newEvent(logger: Logger): Event;

/**
 * Create a 'child' event, reuses the logger, adds callstack to the passed event
 */
export function newEventFromEvent(event: Event): Event;

/**
 * Track event start times and set a name
 */
export function eventStart(event: Event, name: string): void;

/**
 * Rename event, can only be done if `eventStop` is not called yet.
 */
export function eventRename(event: Event, name: string): void;

/**
 * Track event stop, and log callStack if event#root === true
 */
export function eventStop(event: Event): void;

/**
 * Create a test event.
 * event.log.info is a noop by default, but can be enabled via the passed in options.
 */
export function newTestEvent(options?: { enabledLogs?: boolean }): Event;

/**
 * Get the disk size (in bytes) and estimated row count for all tables and views.
 * To improve accuracy, run sql`ANALYZE` before this query, however make sure to read the
 * Postgres documentation for implications.
 *
 * Accepts the @lbu/store based sql instance, but not strongly typed so we don't have the
 * dependency
 */
export function postgresTableSizes(
  sql: any,
): Promise<Record<string, { diskSize: number; rowCount: number }>>;
