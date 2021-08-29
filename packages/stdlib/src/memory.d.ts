/**
 * Convert bytes to a human readable value
 *
 * @since 0.1.0
 *
 * @param {number} [bytes]
 * @returns {string}
 */
export function bytesToHumanReadable(bytes?: number | undefined): string;
/**
 * Print memory usage of this Node.js process
 *
 * @since 0.1.0
 *
 * @param {Logger} logger
 * @returns {void}
 */
export function printProcessMemoryUsage(logger: Logger): void;
export type Logger = import("../types/advanced-types.js").Logger;
//# sourceMappingURL=memory.d.ts.map