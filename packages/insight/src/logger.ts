import { isNil, isPlainObject } from "@lightbase/stdlib";
import { LogLevel, LogState, TypeFilter } from "./types";
import { DevWriter, Writer } from "./Writer";

const state: LogState = {
  writer: new DevWriter(process.stdout),
  typeFilters: [],
};

export function resetWriter(stream = process.stdout) {
  state.writer =
    process.env.NODE_ENV === "production"
      ? new Writer(stream)
      : new DevWriter(stream);
}

export function resetTypeFilters() {
  state.typeFilters = [];
}

export function addTypeFilter(typeFilter: TypeFilter) {
  state.typeFilters.push(typeFilter);
}

export function removeTypeFilter(typeFilter: TypeFilter) {
  state.typeFilters = state.typeFilters.filter(it => it !== typeFilter);
}

export class Logger<T> {
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
 */
export const recursiveCopyObject = (obj: any | any[],
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
  const keys: string[] = isPlainObject(obj) ? Object.keys(obj)
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

