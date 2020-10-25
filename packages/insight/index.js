import { newLogger } from "./src/logger/logger.js";

export { bytesToHumanReadable, printProcessMemoryUsage } from "./src/memory.js";
export { newLogger } from "./src/logger/logger.js";

export {
  newEvent,
  eventStart,
  eventRename,
  eventStop,
  newTestEvent,
  newEventFromEvent,
} from "./src/events.js";
export { postgresTableSizes } from "./src/postgres.js";

/**
 * @type {Logger}
 */
export const log = newLogger({});
