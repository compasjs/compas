/// <reference types="node" />
/**
 * Standard error to use. This contains a key, status code and info object.
 * Mostly provided to make it easier to return errors from your API's.
 *
 * @since 0.1.0
 * @class
 */
export class AppError extends Error {
  /**
   * @param {*} value
   * @returns {value is AppError}
   */
  static instanceOf(value: any): value is AppError;
  /**
   * @param {Record<string, any>} [info={}]
   * @param {Error} [error]
   * @returns {AppError}
   */
  static notFound(
    info?: Record<string, any> | undefined,
    error?: Error | undefined,
  ): AppError;
  /**
   * @param {Record<string, any>} [info={}]
   * @param {Error} [error]
   * @returns {AppError}
   */
  static notImplemented(
    info?: Record<string, any> | undefined,
    error?: Error | undefined,
  ): AppError;
  /**
   * @param {Record<string, any>} [info={}]
   * @param {Error} [error]
   * @returns {AppError}
   */
  static serverError(
    info?: Record<string, any> | undefined,
    error?: Error | undefined,
  ): AppError;
  /**
   * @param {string} key
   * @param {Record<string, any>} [info={}]
   * @param {Error} [error]
   * @returns {AppError}
   */
  static validationError(
    key: string,
    info?: Record<string, any> | undefined,
    error?: Error | undefined,
  ): AppError;
  /**
   * Format any error skipping the stack automatically for nested errors
   *
   * @param {AppError | Error | undefined | null | {} | string | number | boolean |
   *   Function | unknown} [e]
   * @returns {Record<string, any>}
   */
  static format(
    e?:
      | AppError
      | Error
      | undefined
      | null
      | {}
      | string
      | number
      | boolean
      | Function
      | unknown,
  ): Record<string, any>;
  /**
   * @param {string} key
   * @param {number} status
   * @param {Record<string, any>} [info={}]
   * @param {Error} [cause]
   */
  constructor(
    key: string,
    status: number,
    info?: Record<string, any> | undefined,
    cause?: Error | undefined,
  );
  key: string;
  status: number;
  info: Record<string, any>;
  cause: Error | undefined;
  /**
   * Use AppError#format when AppError is passed to JSON.stringify().
   * This is used in the compas insight logger in production mode.
   */
  toJSON(): Record<string, any>;
  /**
   * Use AppError#format when AppError is passed to console.log / console.error.
   * This works because it uses `util.inspect` under the hood.
   * Util#inspect checks if the Symbol `util.inspect.custom` is available.
   */
  [inspect.custom](): Record<string, any>;
}
import { inspect } from "node:util";
//# sourceMappingURL=error.d.ts.map
