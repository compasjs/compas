import { Logger } from "./logger";

export {
  resetWriter,
  addTypeFilter,
  removeTypeFilter,
  resetTypeFilters,
  Logger,
} from "./logger";
export * from "./types";

/**
 * Default logger
 */
export const log = new Logger(5, {
  type: "GENERAL",
});
