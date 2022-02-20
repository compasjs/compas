/**
 * @param {import("./state").TestState} testState
 * @param {boolean} [isDebugging] If debugging, we should ignore the timeout
 * @returns {Promise<void>}
 */
export function runTestsRecursively(
  testState: import("./state").TestState,
  isDebugging?: boolean | undefined,
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
