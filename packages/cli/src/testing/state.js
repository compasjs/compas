import { noop } from "@compas/stdlib";

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
 * @property {TestAssertion[]} assertions
 * @property {TestState[]} children
 * @property {Error|undefined} [caughtException]
 */

/**
 * @type {Logger}
 */
// @ts-ignore
export let testLogger = undefined;

/**
 * @type {boolean}
 */
export let areTestsRunning = false;

/**
 * @type {number}
 */
export let timeout = 2500;

/**
 * @type {string[]}
 */
export const ignoreDirectories = [];

/**
 * @type {function(): (void|Promise<void>)}
 */
export let globalSetup = noop;

/**
 * @type {function(): (void|Promise<void>)}
 */
export let globalTeardown = noop;

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
 * @param {Logger} logger
 */
export function setTestLogger(logger) {
  testLogger = logger;
}

/**
 * Set test timeout value in milliseconds
 *
 * @param value
 */
export function setTestTimeout(value) {
  timeout = value;
}

/**
 * Only accepts the value if it is a function
 */
export function setGlobalSetup(value) {
  if (typeof value === "function") {
    globalSetup = value;
  }
}

/**
 * Only accepts the value if it is a function
 */
export function setGlobalTeardown(value) {
  if (typeof value === "function") {
    globalTeardown = value;
  }
}
