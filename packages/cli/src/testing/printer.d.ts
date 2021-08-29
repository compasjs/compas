/**
 * @typedef {import("./state").TestState} TestState
 */
/**
 * Prints test results and returns the exit code
 *
 * @returns {number}
 */
export function printTestResults(): number;
/**
 * Prints test results from workers and return the exit code
 *
 * @param {{
 *   isFailed: boolean,
 *   assertions: { passed: number, failed: number, },
 *   failedResult: string[]
 * }[]} testResults
 * @returns {number}
 */
export function printTestResultsFromWorkers(testResults: {
    isFailed: boolean;
    assertions: {
        passed: number;
        failed: number;
    };
    failedResult: string[];
}[]): number;
/**
 * Prints information over test failures
 *
 * @param {TestState} state
 * @param {string[]} result
 * @param {number} indentCount
 */
export function printFailedResults(state: TestState, result: string[], indentCount: number): void;
/**
 * Recursively marks hasFailure if test has a caughtException or if an assertion did not
 * pass
 *
 * @param {TestState} state
 */
export function markTestFailuresRecursively(state: TestState): void;
/**
 * Returns a sum of all assertions recursively, ignoring caught exceptions.
 *
 * @param {TestState} state
 * @returns {{ passed: number, failed: number }}
 */
export function sumAssertions(state: TestState): {
    passed: number;
    failed: number;
};
export type TestState = import("./state").TestState;
//# sourceMappingURL=printer.d.ts.map