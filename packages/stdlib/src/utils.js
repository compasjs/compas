import { lstatSync, realpathSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { setFlagsFromString } from "v8";
import { runInNewContext } from "vm";
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
 * @param {Logger} logger
 * @param {MainFnCallback} cb
 */
export function mainFn(meta, logger, cb) {
  if (isMainFn(meta)) {
    dotenv.config();
    const result = cb(logger);
    Promise.resolve(result).catch((e) => logger.error(e));
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
 * @returns {boolean}
 */
function isMainFn(meta) {
  const modulePath = fileURLToPath(meta.url);

  let scriptPath = process.argv[1];

  // Support following symbolic links for node_modules/.bin items
  const scriptStat = lstatSync(scriptPath);
  if (scriptStat.isSymbolicLink()) {
    scriptPath = realpathSync(scriptPath);
  }
  const scriptPathExt = path.extname(scriptPath);
  if (scriptPathExt) {
    return modulePath === scriptPath;
  }

  let modulePathWithoutExt = modulePath;
  const modulePathExt = path.extname(modulePath);
  if (modulePathExt) {
    modulePathWithoutExt = modulePathWithoutExt.slice(0, -modulePathExt.length);
  }

  return modulePathWithoutExt === scriptPath;
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
  /**
   * All iterations we can try to execute
   */
  static iterations = [
    5,
    10,
    50,
    100,
    200,
    500,
    1000,
    5000,
    10000,
    1_000_000,
    5_000_000,
    10_000_000,
    50_000_000,
    100_000_000,
  ];

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
          operationTimeNs: String(diff / BigInt(this.N)),
        });
        break;
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
  let longestOperationTimeAfterDot = 0;

  for (const bench of benchmarkResults) {
    if (bench.name.length > longestName) {
      longestName = bench.name.length;
    }

    // We also line out on the '.'
    // This results in easier to interpret results
    const operationTimeSplit = bench.operationTimeNs.split(".");
    bench.operationTimeBeforeDot = operationTimeSplit[0];
    bench.operationTimeAfterDot = operationTimeSplit[1] ?? "";

    if (bench.operationTimeBeforeDot.length > longestOperationTimeBeforeDot) {
      longestOperationTimeBeforeDot = bench.operationTimeBeforeDot.length;
    }
    if (bench.operationTimeAfterDot.length > longestOperationTimeAfterDot) {
      longestOperationTimeAfterDot = bench.operationTimeAfterDot.length;
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
      )}${
        bench.operationTimeAfterDot.length > 0 ? "." : " "
      }${bench.operationTimeAfterDot.padEnd(
        longestOperationTimeAfterDot,
        " ",
      )}  ns/op`,
    );
  }
}
