import { newLogger } from "./src/logger.js";

export { bytesToHumanReadable, printProcessMemoryUsage } from "./src/memory.js";
export { newLogger } from "./src/logger.js";

export const log = newLogger({
  depth: 4,
});
