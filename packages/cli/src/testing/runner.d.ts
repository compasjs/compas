/**
 * Run the tests recursively.
 *
 * When the debugger is attached, we ignore any timeouts.
 *
 * @param {import("./config").TestConfig} testConfig
 * @param {import("./state").TestState} testState
 * @param {Partial<Pick<import("./config").TestConfig, "timeout">>} [configOverrides]
 * @returns {Promise<void>}
 */
export function runTestsRecursively(
  testConfig: import("./config").TestConfig,
  testState: import("./state").TestState,
  configOverrides?:
    | Partial<Pick<import("./config").TestConfig, "timeout">>
    | undefined,
): Promise<void>;
/**
 * Register top-level tests. The main entry point of the test runner
 *
 * @since 0.1.0
 *
 * @type {(name: string, callback: import("./state").TestCallback) => void}
 */
export const test: (
  name: string,
  callback: import("./state").TestCallback,
) => void;
//# sourceMappingURL=runner.d.ts.map
