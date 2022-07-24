import { RandomUUIDOptions } from "crypto";

import { AppError } from "../src/error.js";

export type Either<T, E = AppError> =
  | { value: T; error?: never }
  | { value?: never; error: E };

export type EitherN<T, E = AppError> =
  | { value: T; errors?: never }
  | { value?: never; errors: E[] };

export interface NoopFn {
  (): void;
}

export interface UuidFunc {
  /**
   * Returns true if value conforms a basic uuid structure.
   * This check is case-insensitive.
   */
  isValid: (value: any) => boolean;

  /**
   * Return a new uuid v4
   */ (options?: RandomUUIDOptions): string;
}

/**
 * Basic timing and call information
 */
export type InsightEventCall =
  | {
      type: "stop" | "aborted";
      name?: string;

      /**
       * Time in milliseconds since some kind of epoch, this may be unix epoch or process start
       */
      time: number;
    }
  | {
      type: "start";
      name?: string;

      /**
       * Duration in milliseconds between (end|aborted) and start time. This is filled when an
       * event is aborted or stopped via `eventStop`.
       */
      duration?: number;

      /**
       * Time in milliseconds since some kind of epoch, this may be unix epoch or process start
       */
      time: number;
    }
  | InsightEventCall[];

/**
 * Encapsulate the base information needed to dispatch events
 */
export interface InsightEvent {
  log: Logger;

  signal?: AbortSignal;

  /**
   * If event is first event dispatched in chain
   */
  parent?: InsightEvent;

  name?: string;

  callStack: InsightEventCall[];
}

/**
 * Options for processDirectoryRecursive and processDirectoryRecursiveSync
 */
export interface ProcessDirectoryOptions {
  /**
   * Skip node_modules directory, true by default
   */
  skipNodeModules?: boolean;

  /**
   * Skip files and directories starting with a '.', true
   *   by default
   */
  skipDotFiles?: boolean;
}
