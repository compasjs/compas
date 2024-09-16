/**
 * @typedef {object} TestAssertion
 * @property {string} type
 * @property {boolean} passed
 * @property {{
 *   actual: boolean
 * }|{
 *   actual?: any,
 *   expected?: any,
 *   message?: string
 * }|undefined} meta
 * @property {string|undefined} [message]
 */

/**
 * @typedef {(t: import("../../types/advanced-types.js").TestRunner) =>
 *   (void|any|Promise<any>)} TestCallback
 */

/**
 * @typedef {object} TestState
 * @property {TestState|undefined} [parent]
 * @property {boolean|undefined} [hasFailure]
 * @property {string} name
 * @property {TestCallback|undefined} [callback]
 * @property {Array<TestAssertion>} assertions
 * @property {Array<TestState>} children
 * @property {Error|undefined} [caughtException]
 */

/**
 * @type {import("@compas/stdlib").Logger}
 */
// @ts-ignore
export let testLogger = undefined;

/**
 * @type {boolean}
 */
export let areTestsRunning = false;

/**
 * @type {TestState}
 */
export const state = {
  name: "root",
  assertions: [],
  children: [],
};

/**
 * Mutate the global areTestsRunning
 *
 * @param {boolean} running
 */
export function setAreTestRunning(running) {
  areTestsRunning = running;
}

/**
 * Set the test logger
 *
 * @param {import("@compas/stdlib").Logger} logger
 */
export function setTestLogger(logger) {
  testLogger = logger;
}
