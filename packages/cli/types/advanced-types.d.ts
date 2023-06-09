/**
 * Available assertions and the option of doing nested tests
 */
export interface TestRunner {
  /**
   * Available test logger
   */
  log: import("@compas/stdlib").Logger;

  /**
   * The test name as provided as the first argument to 'test' or 't.test'
   */
  name: string;

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
  test(
    name: string,
    callback: import("../src/testing/state").TestCallback,
  ): void;
}
