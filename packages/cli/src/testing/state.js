import { noop } from "@compas/stdlib";

/**
 * @type {Logger}
 */
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
