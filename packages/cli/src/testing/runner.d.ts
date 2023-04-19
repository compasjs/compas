/**
 * Run the tests recursively.
 *
 * When the debugger is attached, we ignore any timeouts.
 *
 * @param {import("./state").TestState} testState
 * @param {{
 *   isDebugging?: boolean,
 *   bail?: boolean,
 * }} options
 * @returns {Promise<void>}
 */
export function runTestsRecursively(
  testState: import("./state").TestState,
  options?: {
    isDebugging?: boolean;
    bail?: boolean;
  },
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
