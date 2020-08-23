/**
 * @type {Logger}
 */
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
 * @param {boolean} running
 */
export function setAreTestRunning(running) {
  areTestsRunning = running;
}

/**
 * Set the test logger
 * @param {Logger} logger
 */
export function setTestLogger(logger) {
  testLogger = logger;
}
