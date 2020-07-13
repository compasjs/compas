import { newLogger } from "./src/logger.js";

export { bytesToHumanReadable, printProcessMemoryUsage } from "./src/memory.js";
export { newLogger, bindLoggerContext } from "./src/logger.js";

/**
 * @type {Logger}
 */
export const log = newLogger({
  depth: 4,
});
