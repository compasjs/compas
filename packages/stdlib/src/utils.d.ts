/**
 * @typedef {import("../types/advanced-types.js").Logger} Logger
 */
/**
 * Get the number of seconds since Unix epoch (1-1-1970).
 *
 * @since 0.1.0
 *
 * @returns {number}
 */
export function getSecondsSinceEpoch(): number;
/**
 * A function that returns 'undefined'.
 *
 * @since 0.1.0
 * @type {import("../types/advanced-types").NoopFn}
 */
export function noop(): void;
/**
 * HACKY
 *
 * @since 0.1.0
 *
 * @returns {void}
 */
export function gc(): void;
/**
 * Checks if the provided import.meta source is used as the project entrypoint.
 * If so, reads the .env file, prepares the environmentCache, adds some handlers for
 * uncaught exceptions,  and calls the provided callback
 *
 * @since 0.1.0
 * @summary Process entrypoint executor
 *
 * @param {ImportMeta} meta
 * @param {(logger: Logger) => void|Promise<void>} cb
 * @returns {void}
 */
export function mainFn(meta: ImportMeta, cb: (logger: Logger) => void | Promise<void>): void;
/**
 * ES module compatibility counterpart of the CommonJS __filename
 *
 * @since 0.1.0
 *
 * @param {ImportMeta} meta
 * @returns {string}
 */
export function filenameForModule(meta: ImportMeta): string;
/**
 * ES module compatibility counterpart of the CommonJS __dirname
 *
 * @since 0.1.0
 *
 * @param {ImportMeta} meta
 * @returns {string}
 */
export function dirnameForModule(meta: ImportMeta): string;
/**
 * Checks if the provided meta.url is the process entrypoint and also returns the name of
 * the entrypoint file
 *
 * @param {ImportMeta} meta
 * @returns {{ isMainFn: boolean, name?: string}}
 */
export function isMainFnAndReturnName(meta: ImportMeta): {
    isMainFn: boolean;
    name?: string;
};
export type Logger = import("../types/advanced-types.js").Logger;
//# sourceMappingURL=utils.d.ts.map