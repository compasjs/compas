import { lstatSync, realpathSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { setFlagsFromString } from "v8";
import { runInNewContext } from "vm";
import { newLogger } from "@lbu/insight";
import dotenv from "dotenv";
import { isNil } from "./lodash.js";

/**
 * @returns {number}
 */
export function getSecondsSinceEpoch() {
  return Math.floor(Date.now() / 1000);
}

/**
 * @returns {undefined}
 */
export function noop() {
  return undefined;
}

/**
 * Internal gc function reference
 * Note that this is undefined if the gc function is not called and Node is not running
 * with --expose-gc on
 */
let internalGc = global.gc;

/**
 * HACKY
 */
export function gc() {
  if (isNil(internalGc)) {
    setFlagsFromString("--expose_gc");
    internalGc = runInNewContext("gc");
  }

  internalGc();
}

/**
 * @param {ImportMeta} meta
 * @param {MainFnCallback} cb
 */
export function mainFn(meta, cb) {
  const { isMainFn, name } = isMainFnAndReturnName(meta);
  if (isMainFn) {
    dotenv.config();
    const logger = newLogger({
      ctx: { type: name },
    });

    const unhandled = (error) => {
      logger.error(error);
      process.exit(1);
    };

    // Handle async errors from the provided callback as `unhandledRejections`
    Promise.resolve(cb(logger)).catch(unhandled);
  }
}

/**
 * @param {ImportMeta} meta
 * @returns {string}
 */
export function filenameForModule(meta) {
  return fileURLToPath(meta.url);
}

/**
 * @param {ImportMeta} meta
 * @returns {string}
 */
export function dirnameForModule(meta) {
  return path.dirname(filenameForModule(meta));
}

/**
 * @param {ImportMeta} meta
 * @returns {{ isMainFn: boolean, name?: string}}
 */
function isMainFnAndReturnName(meta) {
  const modulePath = fileURLToPath(meta.url);

  let scriptPath = process.argv[1];

  // Support following symbolic links for node_modules/.bin items
  const scriptStat = lstatSync(scriptPath);
  if (scriptStat.isSymbolicLink()) {
    scriptPath = realpathSync(scriptPath);
  }
  const scriptPathExt = path.extname(scriptPath);
  if (scriptPathExt) {
    return {
      isMainFn: modulePath === scriptPath,
      name: scriptPath
        .substring(0, scriptPath.length - scriptPathExt.length)
        .split(path.sep)
        .pop(),
    };
  }

  let modulePathWithoutExt = modulePath;
  const modulePathExt = path.extname(modulePath);
  if (modulePathExt) {
    modulePathWithoutExt = modulePathWithoutExt.slice(0, -modulePathExt.length);
  }

  return {
    isMainFn: modulePathWithoutExt === scriptPath,
    name: modulePathWithoutExt.split(path.sep).pop(),
  };
}

/**
 * @name BenchResult
 * @typedef {object}
 * @property {string} name
 * @property {number} N
 * @property {string} operationTimeNs
 */

/**
 * Global type, for easier formatting down the line
 * @type {BenchResult[]}
 */
const benchmarkResults = [];

class Benchmarker {
  static iterationBase = [1, 2, 5];

  /**
   * All iterations we can try to execute
   */
  static iterations = Array.from(
    { length: Benchmarker.iterationBase.length * 9 },
    (_, idx) => {
      const base =
        Benchmarker.iterationBase[idx % Benchmarker.iterationBase.length];
      const times = Math.max(
        1,
        Math.pow(10, Math.floor(idx / Benchmarker.iterationBase.length)),
      );

      return base * times;
    },
  );

  currentIdx = 0;
  N = 0;
  start = BigInt(0);

  constructor(name, cb) {
    this.name = name;
    this.cb = cb;
  }

  async exec() {
    for (let i = 0; i < Benchmarker.iterations.length; ++i) {
      this.currentIdx = i;
      this.start = process.hrtime.bigint();
      this.N = Benchmarker.iterations[this.currentIdx];

      const res = this.cb(this.N);
      if (res && typeof res.then === "function") {
        await res;
      }

      const diff = process.hrtime.bigint() - this.start;
      if (diff >= 1_000_000_000 || i === Benchmarker.iterations.length - 1) {
        benchmarkResults.push({
          name: this.name,
          N: this.N,
          operationTimeNs: (Number(diff) / this.N).toFixed(0),
        });
        break;
      }

      if (diff < 50_00_000) {
        i += 4;
      } else if (diff < 100_000_000) {
        i += 3;
      } else if (diff < 200_000_000) {
        i += 2;
      } else if (diff < 300_000_000) {
        i += 1;
      }
    }
  }
}

/**
 * @param {string} name
 * @param {function(number): (void | Promise<void>)} cb
 * @returns {Promise<void>}
 */
export function bench(name, cb) {
  const b = new Benchmarker(name, cb);
  return b.exec();
}

/**
 * Formats the benchmark results and lines them out for easier consumption
 * @param {Logger} logger
 */
export function logBenchResults(logger) {
  let longestName = 0;
  let longestOperationTimeBeforeDot = 0;

  for (const bench of benchmarkResults) {
    if (bench.name.length > longestName) {
      longestName = bench.name.length;
    }

    // We also line out on the '.'
    // This results in easier to interpret results
    const operationTimeSplit = bench.operationTimeNs.split(".");
    bench.operationTimeBeforeDot = operationTimeSplit[0];

    if (bench.operationTimeBeforeDot.length > longestOperationTimeBeforeDot) {
      longestOperationTimeBeforeDot = bench.operationTimeBeforeDot.length;
    }
  }

  for (const bench of benchmarkResults) {
    logger.info(
      `${bench.name.padEnd(longestName, " ")}   ${String(bench.N).padStart(
        10,
        " ",
      )}  iterations   ${bench.operationTimeBeforeDot.padStart(
        longestOperationTimeBeforeDot,
        " ",
      )}  ns/op`,
    );
  }
}

/**
 * @returns {boolean}
 */
export function isProduction() {
  return process.env.NODE_ENV === "production";
}

/**
 * @returns {boolean}
 */
export function isStaging() {
  return (
    process.env.NODE_ENV !== "production" || process.env.IS_STAGING === "true"
  );
}
