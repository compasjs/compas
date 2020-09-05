/**
 * @type {Logger}
 */
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
 * @param {boolean} running
 */
export function setAreBenchRunning(running) {
  areBenchRunning = running;
}

/**
 * Set the bench logger
 * @param {Logger} logger
 */
export function setBenchLogger(logger) {
  benchLogger = logger;
}
