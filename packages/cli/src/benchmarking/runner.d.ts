/**
 * @param {import("./state").BenchState[]} state
 * @returns {Promise<void>}
 */
export function runBenchmarks(
  state: import("./state").BenchState[],
): Promise<void>;
/**
 * Benchmark entry point. The benchmark runner will wait a bit till now new benchmarks
 * are registered and then start execution.
 *
 * @since 0.1.0
 *
 * @param {string} name
 * @param {import("./state").BenchCallback} callback
 * @returns {void}
 */
export function bench(
  name: string,
  callback: import("./state").BenchCallback,
): void;
//# sourceMappingURL=runner.d.ts.map
