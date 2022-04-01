/**
 * Mutate the global areTestsRunning
 *
 * @param {boolean} running
 */
export function setAreTestRunning(running: boolean): void;
/**
 * Set the test logger
 *
 * @param {Logger} logger
 */
export function setTestLogger(logger: Logger): void;
/**
 * Set test timeout value in milliseconds
 *
 * @param value
 */
export function setTestTimeout(value: any): void;
/**
 * Only accepts the value if it is a function
 */
export function setGlobalSetup(value: any): void;
/**
 * Only accepts the value if it is a function
 */
export function setGlobalTeardown(value: any): void;
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
export let testLogger: Logger;
/**
 * @type {boolean}
 */
export let areTestsRunning: boolean;
/**
 * @type {number}
 */
export let timeout: number;
/**
 * @type {function(): (void|Promise<void>)}
 */
export let globalSetup: () => void | Promise<void>;
/**
 * @type {function(): (void|Promise<void>)}
 */
export let globalTeardown: () => void | Promise<void>;
/**
 * @type {TestState}
 */
export const state: TestState;
export type TestAssertion = {
  type: string;
  passed: boolean;
  meta:
    | {
        actual: boolean;
      }
    | {
        actual?: any;
        expected?: any;
        message?: string;
      }
    | undefined;
  message?: string | undefined;
};
export type TestCallback = (
  t: import("../../types/advanced-types.js").TestRunner,
) => void | any | Promise<any>;
export type TestState = {
  parent?: TestState | undefined;
  hasFailure?: boolean | undefined;
  name: string;
  callback?: TestCallback | undefined;
  assertions: TestAssertion[];
  children: TestState[];
  caughtException?: Error | undefined;
};
//# sourceMappingURL=state.d.ts.map
