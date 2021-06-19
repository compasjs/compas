import { ExecOptions, SpawnOptions } from "child_process";

interface UuidFunc {
  /**
   * Return a new uuid v4
   */ (): string;

  /**
   * Returns true if value conforms a basic uuid structure.
   * This check is case-insensitive.
   */
  isValid(value: any): boolean;
}

/**
 * Return a new uuid v4
 * @example
 * ```js
 * uuid();
 * // => f3283b08-08c4-43fc-9fa6-e36c0ab2b61a
 * ```
 */
export declare const uuid: UuidFunc;

/**
 * AppErrors represent errors, that should immediately stop the request and return a
 * status and other meta data directly
 * @example
 * ```js
 * new AppError(401, "error.server.unauthorized");
 * AppError.validationError("validation.string.length", { message: "String should have at
 *   least 3 characters" }); AppError.serverError({}, new Error("Oops"));
 * ```
 */
export class AppError<T extends any> extends Error {
  /**
   * Key is preferred to be in the following format
   * ```
   *   "foo.bar"
   *   "error.server.notImplemented"
   * ```
   */
  public key: string;

  /**
   * Status number to send to the api client
   */
  public status: number;

  /**
   * Extra information in the form of an object for the client to use
   */
  public info: T;

  /**
   * Optional original error that was thrown
   */
  public originalError?: Error;

  /**
   * Create a new AppError
   */
  constructor(key: string, status: number, info?: T, originalError?: Error);

  /**
   * Check if value contains the properties to at least act like a valid AppError
   */
  static instanceOf(value: unknown): value is AppError<unknown>;

  /**
   * Create a new 404 not found error
   */
  static notFound<T extends any>(info?: T, error?: Error): AppError<T>;

  /**
   * Create a new 405 not implemented error
   */
  static notImplemented<T extends any>(info?: T, error?: Error): AppError<T>;

  /**
   * Create a new 500 internal server error
   */
  static serverError<T extends any>(info?: T, error?: Error): AppError<T>;

  /**
   * Create a new 400 validation error
   */
  static validationError<T extends any>(
    key: string,
    info?: T,
    error?: Error,
  ): AppError<T>;

  /**
   * Format errors recursively
   */
  static format<T extends any>(e: AppError<T> | Error): any;
}

/**
 * Check if item is null or undefined
 * @example
 * ```js
 * isNil(null);
 * // => true
 * isNil(undefined);
 * // => true
 * isNil({});
 * // => false
 * ```
 */
export function isNil<T>(
  value: T | null | undefined,
): value is null | undefined;

/**
 * Check if item is a plain javascript object
 * Not completely bullet proof
 * @example
 * ```js
 * isPlainObject("foo");
 * // => false
 * isPlainObject(new (class Foo {}));
 * // => false
 * isPlainObject([]);
 * // => false
 * isPlainObject({});
 * // => true
 * ```
 */
export function isPlainObject(obj: any): boolean;

/**
 * Re expose lodash.merge
 * TODO: Note that lodash.merge is deprecated although it doesnt say so when installing
 * **Note:** This method mutates `object`.
 * @example
 * ```js
 * merge({}, {});
 * // => {}
 * merge({}, { foo: true});
 * // => { foo: true }
 * merge({ bar: 1 }, { bar: 2 });
 * // => { bar: 2 }
 * ```
 */
export function merge(object: any, ...sources: any[]): any;

/**
 * Flattens the given nested object, skipping anything that is not a plain object
 * @example
 * ```js
 * flatten({ foo: { bar: 2 } });
 * // => { "foo.bar": 2 }
 * ```
 */
export function flatten(
  object: any,
  result?: any,
  path?: string,
): { [key: string]: any };

/**
 * Opposite of flatten
 * @example
 * ```js
 * unFlatten({ "foo.bar": 2});
 * // => { foo: { bar: 2 } }
 * ```
 */
export function unFlatten(data?: { [keys: string]: any }): any;

/**
 * Convert a camelCase string to a snake_case string
 *
 * @example
 * ```js
 *   camelToSnakeCase("fooBBar");
 *   // => "foo_b_bar"
 * ```
 */
export function camelToSnakeCase(input: string): string;

/**
 * Promisify version of child_process#exec
 * @example
 * ```js
 * exec("uname -m");
 * // => Promise<{ stdout: "x86_64\n", stderr: "", exitCode: 0 }>
 * ```
 */
export function exec(
  command: string,
  opts?: ExecOptions,
): Promise<{ stdout: string; stderr: string; exitCode: number }>;

/**
 * A promise wrapper around child_process#spawn
 * @example
 * ```js
 * spawn("ls", ["-al"], { cwd: "/home" });
 * // => Promise<{ exitCode: 0 }>
 * ```
 */
export function spawn(
  command: string,
  args: string[],
  opts?: SpawnOptions,
): Promise<{ exitCode: number }>;

/**
 * Read a readable stream completely, and return as Buffer
 */
export function streamToBuffer(stream: ReadableStream): Promise<Buffer>;

/**
 * Options for processDirectoryRecursive and processDirectoryRecursiveSync
 */
export interface ProcessDirectoryOptions {
  /**
   * Skip node_modules directory, true by default
   */
  skipNodeModules?: boolean;

  /**
   * Skip files and directories starting with a '.', true
   *   by default
   */
  skipDotFiles?: boolean;
}

/**
 * Recursively walks directory async and calls cb on all files
 *
 */
export function processDirectoryRecursive(
  dir: string,
  cb: (file: string) => Promise<void> | void,
  opts?: ProcessDirectoryOptions,
): Promise<void>;

/**
 * Recursively walks directory synchronous and calls cb on all files
 */
export function processDirectoryRecursiveSync(
  dir: string,
  cb: (file: string) => void,
  opts?: ProcessDirectoryOptions,
): void;

/**
 * Reexport of path#join
 * @example
 * ```js
 * pathJoin("/foo", "bar");
 * // => "/foo/bar"
 * ```
 */
export function pathJoin(...parts: string[]): string;

/**
 * Return seconds since unix epoch
 */
export function getSecondsSinceEpoch(): number;

/**
 * An empty function, doing exactly nothing but returning undefined.
 */
export function noop(): void;

/**
 * HACKY
 * Let V8 know to please run the garbage collector.
 */
export function gc(): void;

export interface MainFnCallback {
  (logger: Logger): void | Promise<void>;
}

/**
 * Run the provided cb if this file is the process entrypoint
 * Will also load dotenv before executing the provided callback.
 * Another side effect is that a process listener is added for warnings
 */
export function mainFn(meta: ImportMeta, cb: MainFnCallback): void;

/**
 * Return filename for ES Module
 * Alternative to CommonJS __filename
 */
export function filenameForModule(meta: ImportMeta): string;

/**
 * Return dirname for ES Module
 * Alternative to CommonJS __dirname
 */
export function dirnameForModule(meta: ImportMeta): string;

/**
 * Cached environment, set by `refreshEnvironmentCache()`
 */
export const environment: typeof process.env;

/**
 * Repopulate the cached environment copy.
 * This should only be necessary when you or a sub package mutates the environment.
 * The `mainFn` / `mainTestFn` / `mainBenchFn` / ... will call this function by default
 * after loading your `.env` file.
 *
 * Accessing process.env.XXX is relatively slow in Node.js.
 * Benchmark of a plain object property access and accessing process.env.NODE_ENV:
 *
 * property access       500000000  iterations     0  ns/op
 * process.env access      5000000  iterations   246  ns/op
 *
 * See this thread: https://github.com/nodejs/node/issues/3104
 */
export function refreshEnvironmentCache(): void;

/**
 * Returns whether NODE_ENV === "production"
 */
export function isProduction(): boolean;

/**
 * Returns whether NODE_ENV !== "production" OR IS_STAGING === "true"
 */
export function isStaging(): boolean;

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
   * Replaces log.info with a 'noop'.Defaults to 'false'.
   */
  disableInfoLogger?: true | undefined;

  /**
   * Replaces log.error with a 'noop'.Defaults to 'false'.
   */
  disableErrorLogger?: true | undefined;

  /**
   * Set the printer to be used. Defaults to "pretty" when 'NODE_ENV===development',
   * "github-actions" when 'GITHUB_ACTIONS===true' and "ndjson" by default.
   */
  printer?: "pretty" | "ndjson" | "github-actions" | undefined;

  /**
   * The stream to write the logs to
   */
  stream?: NodeJS.WriteStream;

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
 * Basic timing and call information
 */
export type InsightEventCall =
  | {
      type: "stop" | "aborted";
      name: string;

      /**
       * Time in milliseconds since some kind of epoch, this may be unix epoch or process start
       */
      time: number;
    }
  | {
      type: "start";
      name: string;

      /**
       * Duration in milliseconds between (end|aborted) and start time. This is filled when an
       * event is aborted or stopped via `eventStop`.
       */
      duration?: number;

      /**
       * Time in milliseconds since some kind of epoch, this may be unix epoch or process start
       */
      time: number;
    }
  | InsightEventCall[];

/**
 * Encapsulate the base information needed to dispatch events
 */
export interface InsightEvent {
  log: Logger;

  signal?: AbortSignal;

  /**
   * If event is first event dispatched in chain
   */
  parent?: InsightEvent;

  name?: string;

  callStack: InsightEventCall[];
}

/**
 * Create a new event from a single logger
 */
export function newEvent(logger: Logger, signal?: AbortSignal): InsightEvent;

/**
 * Create a 'child' event, reuses the logger, adds callstack to the passed event
 */
export function newEventFromEvent(event: InsightEvent): InsightEvent;

/**
 * Track event start times and set a name
 */
export function eventStart(event: InsightEvent, name: string): void;

/**
 * Rename event, includes callStack items.
 */
export function eventRename(event: InsightEvent, name: string): void;

/**
 * Track event stop, and log callStack if event is the root event
 */
export function eventStop(event: InsightEvent): void;
