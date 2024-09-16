import { isNil } from "@compas/stdlib";
import { benchLogger, state } from "./state.js";

/**
 * @param {Array<import("./state.js").BenchState>} state
 * @returns {Promise<void>}
 */
export async function runBenchmarks(state) {
  let i = 0;

  while (true) {
    if (isNil(state[i])) {
      // Give a chance for async imports to run
      await new Promise((r) => {
        setTimeout(r, 2);
      });

      if (isNil(state[i])) {
        break;
      }
    }

    try {
      const b = new InternalRunner(state[i]);
      await b.exec();
    } catch (/** @type {any} */ e) {
      state[i].caughtException = e;
    }
    i++;
  }
}

/**
 * Benchmark entry point. The benchmark runner will wait a bit till now new benchmarks
 * are registered and then start execution.
 *
 * @since 0.1.0
 *
 * @param {string} name
 * @param {import("./state.js").BenchCallback} callback
 * @returns {void}
 */
export function bench(name, callback) {
  // @ts-expect-error
  state.push({
    name,
    callback,
    executionTimesNs: [],
  });
}

class InternalRunner {
  static iterationBase = [1, 2, 5];

  /**
   * All iterations we can try to execute
   */
  static iterations = Array.from(
    { length: InternalRunner.iterationBase.length * 9 },
    (_, idx) => {
      const base =
        InternalRunner.iterationBase[idx % InternalRunner.iterationBase.length];
      const times = Math.max(
        1,
        Math.pow(10, Math.floor(idx / InternalRunner.iterationBase.length)),
      );

      return base * times;
    },
  );

  N = 0;
  start = BigInt(0);

  constructor(state) {
    /**
     * @type {import("./state.js").BenchState}
     */
    this.state = state;
  }

  async exec() {
    let i = 0;
    while (i < InternalRunner.iterations.length) {
      this.N = InternalRunner.iterations[i];
      benchLogger.info({
        name: this.state.name,
        N: this.N,
      });

      this.start = process.hrtime.bigint();

      const res = this.state.callback(createBenchRunner(this));
      if (res && typeof res.then === "function") {
        await res;
      }

      const diff = process.hrtime.bigint() - this.start;
      this.state.executionTimesNs.push(Number(diff) / this.N);
      if (diff >= 1_000_000_000 || i === InternalRunner.iterations.length - 1) {
        this.state.N = this.N;
        this.state.operationTimeNs = (Number(diff) / this.N).toFixed(0);
        break;
      }

      if (diff < 10_00_000) {
        i = Math.min(i + 5, InternalRunner.iterations.length - 1);
      } else if (diff < 50_000_000) {
        i = Math.min(i + 4, InternalRunner.iterations.length - 1);
      } else if (diff < 100_000_000) {
        i = Math.min(i + 3, InternalRunner.iterations.length - 1);
      } else if (diff < 200_000_000) {
        i = Math.min(i + 2, InternalRunner.iterations.length - 1);
      } else {
        i++;
      }
    }
  }
}

/**
 *
 * @param {InternalRunner} runner
 * @returns {import("./state.js").BenchRunner}
 */
function createBenchRunner(runner) {
  return {
    N: runner.N,
    resetTime: () => {
      runner.start = process.hrtime.bigint();
    },
  };
}
