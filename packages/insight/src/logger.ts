import { format } from "./formatting";
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
