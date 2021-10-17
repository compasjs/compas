import { RandomUUIDOptions } from "crypto";
import Pino from "pino";
import { SonicBoom } from "sonic-boom";

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
   */
  (options?: RandomUUIDOptions): string;
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
 * The logger only has two severities:
 * - info
 * - error
 *
 * Either a log line is innocent enough and only provides debug information if needed, or
 *   someone should be paged because something goes wrong. For example handled 400 errors
 *   don't need any ones attention, but unhandled 500 errors do.
 *
 * The log functions {@ee Logger#info} only accepts a single parameter. This prevents magic
 * outputs like automatic concatenating strings in to a single message, or always having a top
 * level array as a message.
 */
export interface Logger {
  info(arg: any): void;

  error(arg: any): void;
}

/**
 * Context that should be logged in all log lines. e.g
 *   a common request id.
 */
interface LoggerContext {
  type?: string;
}

export interface LoggerOptions<T extends LoggerContext> {
  /**
   * Replaces log.info with a 'noop'.Defaults to 'false'.
   */
  disableInfoLogger?: true | undefined;

  /**
   * Replaces log.error with a 'noop'.Defaults to 'false'.
   */
  disableErrorLogger?: true | undefined;

  /**
   * Set the printer to be used. Defaults to "pretty" when 'NODE_ENV===development',
   * "github-actions" when 'GITHUB_ACTIONS===true' and "ndjson" by default.
   */
  printer?: "pretty" | "ndjson" | "github-actions" | undefined;

  /**
   * The stream to write the logs to, is not used for the 'ndjson' printer
   */
  stream?: NodeJS.WriteStream;

  /**
   * Supported Pino options if the 'ndjson' logger is used
   */
  pinoOptions?:
    | {
        transport?:
          | Pino.TransportSingleOptions
          | Pino.TransportMultiOptions
          | Pino.TransportPipelineOptions;
        destination?:
          | string
          | number
          | Pino.DestinationObjectOptions
          | Pino.DestinationStream
          | NodeJS.WritableStream
          | SonicBoom;
      }
    | undefined;

  /**
   * Context that should be logged in all log lines. e.g
   *   a common request id.
   */
  ctx?: T;
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
