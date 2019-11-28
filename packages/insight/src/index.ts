import { Logger } from "./logger";

export { format } from "./formatting";
export {
  resetWriter,
  addTypeFilter,
  removeTypeFilter,
  resetTypeFilters,
} from "./logger";
export * from "./types";

export const log = new Logger(5, {
  type: "GENERAL",
});
