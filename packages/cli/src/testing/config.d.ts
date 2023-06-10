/**
 * @typedef {object} TestConfig
 * @property {number} timeout Sub test timeout.
 * @property {boolean} bail Stop running tests when a failure / failed assertion is
 *   encountered
 * @property {boolean} isDebugging Disable hard test timeouts when the debugger is
 *   attached
 * @property {() => (Promise<void>|void)} setup Global process setup function
 * @property {() => (Promise<void>|void)} teardown Global process setup function
 * @property {boolean} withLogs Don't disable all info-logs
 * @property {number} randomizeRounds Randomizes the test file order after the first
 *   round
 * @property {number} parallelCount The number of test files to process in parallel
 * @property {string[]} ignoreDirectories Subdirectories to skip, when looking for all
 *   test files
 * @property {boolean} coverage Run the test while collecting coverage results.
 * @property {boolean} singleFileMode Should be set when only a single test should run via 'mainTestFn'
 */
/**
 * Load the test config & parse the flags
 *
 * @param {import("@compas/stdlib").Logger} [logger]
 * @param {Record<string, string|number|boolean>} [flags]
 * @returns {Promise<TestConfig>}
 */
export function testingLoadConfig(
  logger?: import("@compas/stdlib/src/logger.js").Logger | undefined,
  flags?: Record<string, string | number | boolean> | undefined,
): Promise<TestConfig>;
export type TestConfig = {
  /**
   * Sub test timeout.
   */
  timeout: number;
  /**
   * Stop running tests when a failure / failed assertion is
   * encountered
   */
  bail: boolean;
  /**
   * Disable hard test timeouts when the debugger is
   * attached
   */
  isDebugging: boolean;
  /**
   * Global process setup function
   */
  setup: () => Promise<void> | void;
  /**
   * Global process setup function
   */
  teardown: () => Promise<void> | void;
  /**
   * Don't disable all info-logs
   */
  withLogs: boolean;
  /**
   * Randomizes the test file order after the first
   * round
   */
  randomizeRounds: number;
  /**
   * The number of test files to process in parallel
   */
  parallelCount: number;
  /**
   * Subdirectories to skip, when looking for all
   * test files
   */
  ignoreDirectories: string[];
  /**
   * Run the test while collecting coverage results.
   */
  coverage: boolean;
  /**
   * Should be set when only a single test should run via 'mainTestFn'
   */
  singleFileMode: boolean;
};
//# sourceMappingURL=config.d.ts.map
