/**
 * @typedef {object} BenchRunner
 * The argument passed to benchmark functions
 * @property {number} N Amount of iterations this call should do
 * @property {() => void} resetTime Reset the start time. Should be used if some setup is
 *    necessary, but shouldn't be counted to wards the time spent.
 */

/**
 * @typedef {(b: BenchRunner) => void|Promise<void>} BenchCallback
 */

/**
 * @typedef {object} BenchState
 * @property {string} name
 * @property {number} N
 * @property {string} operationTimeNs
 * @property {BenchCallback} callback
 * @property {Error|undefined} [caughtException]
 */

/**
 * @type {Logger}
 */
// @ts-ignore
export let benchLogger = undefined;

/**
 * @type {boolean}
 */
export let areBenchRunning = false;

/**
 * @type {BenchState[]}
 */
export const state = [];

/**
 * Mutate the global areBenchRunning
 *
 * @param {boolean} running
 */
export function setAreBenchRunning(running) {
  areBenchRunning = running;
}

/**
 * Set the bench logger
 *
 * @param {Logger} logger
 */
export function setBenchLogger(logger) {
  benchLogger = logger;
}
