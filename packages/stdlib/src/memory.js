import { isProduction } from "./env.js";

const sizes = ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB"];

/**
 * Convert bytes to a human readable value
 *
 * @since 0.1.0
 *
 * @param {number} [bytes]
 * @returns {string}
 */
export function bytesToHumanReadable(bytes) {
  if (bytes === 0 || bytes === undefined) {
    return "0 Byte";
  }

  const idx = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, idx);

  let result = value.toFixed(2);

  // Remove trailing zeroes
  if (result.endsWith(".00")) {
    result = result.substring(0, result.length - 3);
  } else if (result.endsWith("0")) {
    result = result.substring(0, result.length - 1);
  }
  return `${result} ${sizes[idx]}`;
}

/**
 * Print memory usage of this Node.js process
 *
 * @since 0.1.0
 *
 * @param {import("./logger.js").Logger} logger
 * @returns {void}
 */
export function printProcessMemoryUsage(logger) {
  const { external, heapTotal, heapUsed, rss, arrayBuffers } =
    process.memoryUsage();
  if (isProduction()) {
    logger.info({
      rss,
      heapUsed,
      heapTotal,
      external,
      arrayBuffers,
    });
  } else {
    logger.info({
      rss: bytesToHumanReadable(rss),
      heapUsed: bytesToHumanReadable(heapUsed),
      heapTotal: bytesToHumanReadable(heapTotal),
      external: bytesToHumanReadable(external),
      arrayBuffers: bytesToHumanReadable(arrayBuffers),
    });
  }
}
