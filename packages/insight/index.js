import { newLogger } from "./src/logger/logger.js";

export { bytesToHumanReadable, printProcessMemoryUsage } from "./src/memory.js";
export { newLogger, bindLoggerContext } from "./src/logger/logger.js";

export { postgresTableSizes } from "./src/postgres.js";

/**
 * @type {Logger}
 */
export const log = newLogger({});
