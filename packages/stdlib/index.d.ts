import { Logger } from "@lbu/insight";
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
 *   least 3 characters" }); AppError.serverError({}, new Error("Oopsie"));
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
 * Wraps the state needed for templates
 * Globals are available to all templates
 * Templates are also available to all other templates when executing
 */
export interface TemplateContext {
  /**
   * Functions available to all templates
   */
  globals: { [key: string]: Function };

  /**
   * Compiled template functions
   */
  templates: Map<string, Function>;

  /**
   * Throw on recompilation of a template
   * Defaults to 'true'
   */
  strict: boolean;
}

/**
 * Create a new TemplateContext
 * Adds the `isNil` function as a global
 */
export function neTemplateContext(): TemplateContext;

/**
 * Compile templates add to TemplateContext.
 * This function is unsafe for untrusted inputs
 * Fields need to be explicitly set to undefined or access them via `it.field`
 * Inspired by: https://johnresig.com/blog/javascript-micro-templating/
 * @param tc
 * @param name Name that is exposed in the template it self and to be used with
 *   the executeTemplate function
 * @param str Template string
 * @param opts
 */
export function compileTemplate(
  tc: TemplateContext,
  name: string,
  str: string,
  opts?: { debug?: boolean },
);

/**
 * Compile all templates found in the provided directory with the provided extension
 */
export function compileTemplateDirectory(
  tc: TemplateContext,
  dir: string,
  extension: string,
  opts?: ProcessDirectoryOptions,
): Promise<void>;

/**
 * Compile all templates found in the provided directory with the provided extension
 * synchronously
 */
export function compileTemplateDirectorySync(
  tc: TemplateContext,
  dir: string,
  extension: string,
  opts?: ProcessDirectoryOptions,
): void;

/**
 * Execute a template, template should be compiled using compileTemplate
 */
export function executeTemplate(
  tc: TemplateContext,
  name: string,
  data: any,
): string;

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
 * Benchmark helper
 * Note that results should be taken with a grain of salt since V8 is doing JIT stuff and
 * garbage collection, so it's more of an indication than something reproducible
 */
export function bench(
  name: string,
  cb: (N: number) => void | Promise<void>,
): void | Promise<void>;

/**
 * Formats the results of the benchmarks and logs them.
 */
export function logBenchResults(logger: Logger): void;

/**
 * Returns whether NODE_ENV === "production"
 */
export function isProduction(): boolean;

/**
 * Returns whether NODE_ENV !== "production" OR IS_STAGING === "true"
 */
export function isStaging(): boolean;
