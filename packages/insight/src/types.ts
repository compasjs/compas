/**
 * Log levels, note that both of them will always be logged.
 */
import { Writer } from "./Writer";

export const enum LogLevel {
  Info = "info",
  Error = "error",
}

/**
 * When this function returns true, the information is logged else it is skipped
 * Use functions when you want to change the filter dynamically
 */
export type TypeFilterFn = (type: string) => boolean;

/**
 *
 */
export type TypeFilter = TypeFilterFn | string;

export interface LogState {
  writer: Writer;
  typeFilters: TypeFilter[];
}

/**
 * Function signature for log functions
 */
export type LogFunction = (...args: any[]) => void;
