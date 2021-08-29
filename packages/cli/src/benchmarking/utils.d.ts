/**
 * Wraps `mainFn` and starts the benchmark runner if not already started.
 * By calling this in your bench files, it allows the benchmark file to be directly executed
 * via `node file.bench.js`. When the runner is already active, this function will be a no
 * op.
 *
 * @since 0.1.0
 *
 * @param {ImportMeta} meta
 * @returns {void}
 */
export function mainBenchFn(meta: ImportMeta): void;
//# sourceMappingURL=utils.d.ts.map