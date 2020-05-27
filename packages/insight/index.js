import { newLogger } from "./src/logger.js";

export { bytesToHumanReadable, printProcessMemoryUsage } from "./src/memory.js";
export { newLogger, bindLoggerContext } from "./src/logger.js";
export { newLogParserContext, executeLogParser } from "./src/parser.js";

/**
 * Standard log instance.
 * Comes with a depth of 4, prevents printing deeply nested objects
 *
 * @type {Logger}
 */
export const log = newLogger({
  depth: 4,
});
