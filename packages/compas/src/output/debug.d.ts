/**
 * Appends the provided contents with a timestamp to {@link DEBUG_LOCATION}.
 *
 * If the contents aren't a string, they're converted to a string using
 * {@link JSON.stringify}.
 *
 * Note that this function is pretty inefficient, calling `appendFileSync` on every call.
 * We may want to optimize this at some point.
 *
 * @param {*} contents
 */
export function debugPrint(contents: any): void;
/**
 * Start a time mark, which can be ended with {@link debugTimeEnd}. Overwrites any
 * existing time mark with the same label.
 *
 * @param {string} label
 */
export function debugTimeStart(label: string): void;
/**
 * Log the milliseconds that elapsed since the time mark set by {@link
 * debugTimeStart}. Labels can be ended multiple times, resulting in multiple debug logs.
 *
 * @param {string} label
 */
export function debugTimeEnd(label: string): void;
/**
 * Enable writing debug info to the debug file.
 */
export function debugEnable(): void;
/**
 * Disable writing debug info to a debug file.
 *
 * This function should be called, so {@link debugPrint} will short circuit and not keep
 * debug logs in memory.
 */
export function debugDisable(): void;
//# sourceMappingURL=debug.d.ts.map
