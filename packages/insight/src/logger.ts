import { bytesToHumanReadable, isNil, isPlainObject } from "@lightbase/stdlib";
import { LogLevel, LogState, TypeFilter } from "./types";
import { DevWriter, Writer } from "./Writer";

const state: LogState = {
  writer: new DevWriter(process.stdout),
  typeFilters: [],
};

/**
 * Reset writer with a potential new output stream
 */
export function resetWriter(stream = process.stdout) {
  state.writer =
    process.env.NODE_ENV === "production"
      ? new Writer(stream)
      : new DevWriter(stream);
}

/**
 * Remove all type filters
 */
export function resetTypeFilters() {
  state.typeFilters = [];
}

/**
 * Add a new type filter
 *
 * When string: if the input type is equal to typeFilter it is not written
 * When function: if function returns falsy it is not written
 *
 * Note that even when a message is filtered it still has some overhead because the 'final'
 * type is only known after formatting
 */
export function addTypeFilter(typeFilter: TypeFilter) {
  state.typeFilters.push(typeFilter);
}

/**
 * Remove the typeFilter works for strings and function references
 */
export function removeTypeFilter(typeFilter: TypeFilter) {
  state.typeFilters = state.typeFilters.filter(it => it !== typeFilter);
}

/**
 * Prints the memory usage of the current process to the provided logger
 * For more info on the printed properties see:
 * https://nodejs.org/dist/latest-v13.x/docs/api/process.html#process_process_memoryusage
 */
export function printProcessMemoryUsage(logger: Logger) {
  const { external, heapTotal, heapUsed, rss } = process.memoryUsage();
  logger.info({
    rss: bytesToHumanReadable(rss),
    heapUsed: bytesToHumanReadable(heapUsed),
    heapTotal: bytesToHumanReadable(heapTotal),
    external: bytesToHumanReadable(external),
  });
}

/**
 * The logger
 */
export class Logger<T = {}> {
  /**
   *
   * @param depth The object depth to use before not printing any more
   * @param context Any object that should be printed with every log
   */
  constructor(private depth: number, private context: T) {}

  /**
   * Set the maximum depth that the logger will traverse to format & print
   */
  setObjectDepth(d: number): Logger<T> {
    this.depth = d;
    return this;
  }

  /**
   * Get the provided context
   * If an object may be handy to get a reference to mutate
   */
  getContext(): T {
    return this.context;
  }

  /**
   * Set a new context
   * @param ctx
   */
  setContext(ctx: T): Logger<T> {
    this.context = ctx;

    return this;
  }

  /**
   * @type LogFunction
   * @param args
   */
  info(...args: any[]): void {
    args.push(this.context, {
      level: LogLevel.Info,
      timestamp: Date.now(),
    });
    this.internalLog(args);
  }

  /**
   * @type LogFunction
   * @param args
   */
  error(...args: any[]): void {
    args.push(this.context, {
      level: LogLevel.Error,
      timestamp: Date.now(),
    });
    this.internalLog(args);
  }

  private internalLog(args: any[]) {
    const formatted = format(this.depth, args);

    for (const filter of state.typeFilters) {
      if (typeof filter === "string" && filter === formatted.type) {
        return;
      } else if (typeof filter === "function" && !filter(formatted.type)) {
        return;
      }
    }

    state.writer.write(formatted);
  }
}

/**
 * Format the provided items in to a single object
 * Overrides keys when needed
 * Does not handle top level arrays
 */
export const format = (maxDepth: number, args: any[]): any => {
  const result = {};
  for (const arg of args) {
    if (typeof arg === "object" && Array.isArray(arg)) {
      throw new TypeError("Toplevel arrays are not supported.");
    }
    recursiveCopyObject(arg, maxDepth, result);
  }

  return result;
};

/**
 * Recursively copy items from obj to result, while not exceeding the available depth
 *
 * Also has special cases to construct a 'message' of non object provided arguments
 */
export const recursiveCopyObject = (
  obj: any | any[],
  availableDepth: number,
  result: any,
) => {
  // Depth 0, early return to only print primitives
  if (availableDepth === 0 && typeof obj === "object") {
    return;
  }
  if (isNil(obj)) {
    return;
  }

  // Stringify non object items
  if (typeof obj !== "object") {
    if (!result.message) {
      result.message = String(obj);
    } else {
      result.message += " " + String(obj);
    }
    return;
  }

  // Handle classes & objects, note this also contains Typescript private members
  const keys: string[] = isPlainObject(obj)
    ? Object.keys(obj)
    : Object.getOwnPropertyNames(obj);

  for (const key of keys) {
    if (!Object.hasOwnProperty.call(obj, key)) {
      continue;
    }

    const val = obj[key];
    if (typeof val === "object" && Array.isArray(val)) {
      result[key] = [];
      for (const it of val as any[]) {
        const intermediate = {};
        recursiveCopyObject(it, availableDepth - 1, intermediate);
        result[key].push(intermediate);
      }
    } else if (typeof val === "object") {
      result[key] = {};
      recursiveCopyObject(val, availableDepth - 1, result[key]);
    } else {
      result[key] = val;
    }
  }
};
