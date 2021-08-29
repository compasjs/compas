/**
 * @typedef {import("./state").TestState} TestState
 */
/**
 * @typedef {import("./state").TestCallback} TestCallback
 */
/**
 * @typedef {import("../../types/advanced-types.js").TestRunner} TestRunner
 */
/**
 * @param {TestState} testState
 * @param {boolean} [isDebugging] If debugging, we should ignore the timeout
 * @returns {Promise<void>}
 */
export function runTestsRecursively(testState: TestState, isDebugging?: boolean | undefined): Promise<void>;
/**
 * Register top-level tests. The main entry point of the test runner
 *
 * @since 0.1.0
 *
 * @type {(name: string, callback: TestCallback) => void}
 */
export const test: (name: string, callback: TestCallback) => void;
export type TestState = import("./state").TestState;
export type TestCallback = import("./state").TestCallback;
export type TestRunner = import("../../types/advanced-types.js").TestRunner;
//# sourceMappingURL=runner.d.ts.map