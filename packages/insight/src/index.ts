import { Logger } from "./logger";

export {
  resetWriter,
  addTypeFilter,
  removeTypeFilter,
  resetTypeFilters,
  Logger,
  printProcessMemoryUsage,
  bytesToHumanReadable,
} from "./logger";
export * from "./types";

/**
 * Default logger
 */
export const log = new Logger(5, {
  type: "GENERAL",
});
