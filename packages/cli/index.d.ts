import { InsightEvent, Logger } from "@compas/insight";

/**
 * Top level test function for registering tests
 */
export function test(name: string, callback: TestCallback): void;

/**
 * Run the registered tests
 */
export function mainTestFn(meta: ImportMeta): void;

/**
 * Create a test event.
 * event.log.info is a noop by default, but can be enabled via the passed in options.
 */
export function newTestEvent(
  t: TestRunner,
  options?: { enabledLogs?: boolean },
): InsightEvent;

/**
 * Available assertions and the option of doing nested tests
 */
interface TestRunner {
  /**
   * Available test logger
   */
  log: Logger;

  /**
   * Configurable timeout used for sub tests
   */
  timeout?: number;

  /**
   * Signal to abort when the tests time out
   */
  signal?: AbortSignal;

  /**
   * Expect value to be truthy
   */
  ok(value: any, message?: string): void;

  /**
   * Expect value to be falsy
   */
  notOk(value: any, message?: string): void;

  /**
   * Expect actual to triple equal expected
   */
  equal(actual?: any, expected?: any, message?: string): void;

  /**
   * Expect actual to not triple equal expected
   */
  notEqual(actual?: any, expected?: any, message?: string): void;

  /**
   * Expect actual to deep equal expected
   * Uses assert.deepStrictEqual under the hood
   * See
   * https://nodejs.org/api/assert.html#assert_assert_deepstrictequal_actual_expected_message
   */
  deepEqual(actual?: any, expected?: any, message?: string): void;

  /**
   * Instantly fail a test
   * Useful when testing if a function needs to throw.
   *
   * @example
   * ```js
   *   try {
   *      shouldThrow();
   *      t.fail("Function should have thrown an error!");
   *   } catch (e) {
   *     t.pass("Do other assertions here");
   *   }
   * ```
   */
  fail(message?: string): void;

  /**
   * Pass a test
   * Useful if empty code blocks are not allowed
   */
  pass(message?: string): void;

  /**
   * Create a nested test runner
   * Note that these are executed after the parent is done executing.
   */
  test(name: string, callback: TestCallback): void;
}

/**
 * Callback of a test function
 */
type TestCallback = (t: TestRunner) => void | any | Promise<any>;

/**
 * @private
 */
interface TestState {
  parent?: TestState;
  hasFailure: boolean;
  name: string;
  callback?: TestCallback;
  assertions: TestAssertion[];
  children: TestState[];
  caughtException?: Error;
}

/**
 * @private
 */
interface TestAssertion {
  type:
    | "timeout"
    | "ok"
    | "notOk"
    | "equal"
    | "notEqual"
    | "deepEqual"
    | "fail"
    | "pass";
  passed: boolean;
  meta:
    | {
        actual: boolean;
      }
    | {
        actual?: any;
        expected?: any;
        message?: string;
      }
    | undefined;
  message?: string;
}

/**
 * Run the registered benchmarks
 */
export function mainBenchFn(meta: ImportMeta): void;

/**
 * Top level bench mark registering function
 */
export function bench(name: string, callback: BenchCallback): void;

/**
 * Argument to bench mark functions
 */
export interface BenchRunner {
  /**
   * Amount of iterations this call should do
   */
  N: number;

  /**
   * Reset the start time
   * This can be used if a benchmark needs some setup
   */
  resetTime(): void;
}

/**
 * Callback function executed while benchmarking
 */
export type BenchCallback = (b: BenchRunner) => void | Promise<void>;

/**
 * @private
 */
interface BenchState {
  name: string;
  N: number;
  operationTimeNs: string;
  callback: BenchCallback;
  caughtException?: Error;
}

/**
 * Represents either a file in the `scripts` directory or a script from the package.json
 * Depending on the type contains either script or path
 */
export interface CollectedScript {
  type: "user" | "package";
  name: string;
  path?: string;
  script?: string;
}

export interface ScriptCollection {
  [k: string]: CollectedScript;
}

/**
 * Return collection of available named scripts
 * - type user: User defined scripts from process.cwd/scripts/*.js
 * - type package: User defined scripts in package.json. These override 'user' scripts
 */
export function collectScripts(): ScriptCollection;

/**
 * Scripts can export this to control if and how they will be watched
 *
 * @example
 * ```js
 *   // @type {CliWatchOptions}
 *   export const cliWatchOptions = {
 *     disable: false,
 *     extensions: ["js"],
 *     ignoredPatterns: ["docs"]
 *   };
 * ```
 */
export interface CliWatchOptions {
  /**
   * Disable watch mode
   */
  disable?: boolean;

  /**
   * Array of extensions to watch
   * Defaults to ["js", "json", "mjs", "cjs"]
   */
  extensions?: string[];

  /**
   * Ignore specific patterns
   * Can be strings or RegExp instances
   * Always ignores node_modules and `.dotfiles`
   */
  ignoredPatterns?: (string | RegExp)[];
}
