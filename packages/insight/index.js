import { newLogger } from "./src/logger.js";

export { bytesToHumanReadable, printProcessMemoryUsage } from "./src/memory.js";
export { newLogger } from "./src/logger.js";
export { addProcessor, parseExec } from "./src/parser.js";

/**
 * Standard log instance
 * @type {Logger}
 */
export const log = newLogger({
  depth: 4,
});
