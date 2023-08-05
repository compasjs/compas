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
