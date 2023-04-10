/**
 * Mutate the global areBenchRunning
 *
 * @param {boolean} running
 */
export function setAreBenchRunning(running: boolean): void;
/**
 * Set the bench logger
 *
 * @param {Logger} logger
 */
export function setBenchLogger(logger: Logger): void;
/**
 * The argument passed to benchmark functions
 *
 * @typedef {object} BenchRunner
 * @property {number} N Amount of iterations this call should do
 * @property {() => void} resetTime Reset the start time. Should be used if some setup is
 *   necessary, but shouldn't be counted to wards the time spent.
 */
/**
 * @typedef {(b: BenchRunner) => (void|Promise<void>)} BenchCallback
 */
/**
 * @typedef {object} BenchState
 * @property {string} name
 * @property {number} N
 * @property {string} operationTimeNs
 * @property {number[]} executionTimesNs
 * @property {BenchCallback} callback
 * @property {Error|undefined} [caughtException]
 */
/**
 * @type {Logger}
 */
export let benchLogger: Logger;
/**
 * @type {boolean}
 */
export let areBenchRunning: boolean;
/**
 * @type {BenchState[]}
 */
export const state: BenchState[];
/**
 * The argument passed to benchmark functions
 */
export type BenchRunner = {
  /**
   * Amount of iterations this call should do
   */
  N: number;
  /**
   * Reset the start time. Should be used if some setup is
   * necessary, but shouldn't be counted to wards the time spent.
   */
  resetTime: () => void;
};
export type BenchCallback = (b: BenchRunner) => void | Promise<void>;
export type BenchState = {
  name: string;
  N: number;
  operationTimeNs: string;
  executionTimesNs: number[];
  callback: BenchCallback;
  caughtException?: Error | undefined;
};
//# sourceMappingURL=state.d.ts.map
