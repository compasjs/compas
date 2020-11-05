import { inspect } from "util";
import { isNil } from "./lodash.js";

export class AppError extends Error {
  /**
   * @param {string} key
   * @param {number} status
   * @param {object} [info={}]
   * @param {Error} [originalError]
   */
  constructor(key, status, info, originalError) {
    super();

    this.key = key;
    this.status = status;
    this.info = info || {};
    this.originalError = originalError;

    Object.setPrototypeOf(this, AppError.prototype);

    if (
      isNil(key) ||
      isNil(status) ||
      typeof status !== "number" ||
      typeof key !== "string"
    ) {
      return AppError.serverError(
        {
          appErrorConstructParams: {
            key,
            status,
          },
        },
        this,
      );
    }
  }

  /**
   * @param {*} value
   * @returns {boolean}
   */
  static instanceOf(value) {
    return (
      value &&
      typeof value.key === "string" &&
      typeof value.status === "number" &&
      !!value.info
    );
  }

  /**
   * @param {object} [info={}]
   * @param {Error} [error]
   * @returns {AppError}
   */
  static notFound(info = {}, error = undefined) {
    return new AppError("error.server.notFound", 404, info, error);
  }

  /**
   * @param {object} [info={}]
   * @param {Error} [error]
   * @returns {AppError}
   */
  static notImplemented(info = {}, error = undefined) {
    return new AppError("error.server.notImplemented", 405, info, error);
  }

  /**
   * @param {object} [info={}]
   * @param {Error} [error]
   * @returns {AppError}
   */
  static serverError(info = {}, error = undefined) {
    return new AppError("error.server.internal", 500, info, error);
  }

  /**
   * @param {string} key
   * @param {object} [info={}]
   * @param {Error} [error]
   * @returns {AppError}
   */
  static validationError(key, info = {}, error = undefined) {
    return new AppError(key, 400, info, error);
  }

  /**
   * Format any error skipping the stack automatically for nested errors
   *
   * @param {AppError|Error} e
   * @param {boolean} [skipStack=false]
   * @returns {{ name: string, message: string, stack: string[] }|{ key: string, status:
   *   number, info: *, stack: string[], originalError: object }}
   */
  static format(e, skipStack = false) {
    const stack = (e?.stack ?? "").split("\n").map((it) => it.trim());
    // Remove first element as this is the Error name
    stack.shift();

    if (AppError.instanceOf(e)) {
      return {
        key: e.key,
        status: e.status,
        info: e.info,
        stack: skipStack ? [] : stack,
        originalError: e.originalError
          ? !AppError.instanceOf(e.originalError)
            ? typeof e.originalError.toJSON === "function"
              ? e.originalError.toJSON()
              : AppError.format(e.originalError, true)
            : AppError.format(e.originalError, true)
          : undefined,
      };
    }

    return {
      name: e.name,
      message: e.message,
      stack: skipStack ? [] : stack,
    };
  }

  /**
   * Use AppError#format when AppError is passed to console.log / console.error.
   * This works because it uses `util.inspect` under the hood.
   * Util#inspect checks if the Symbol `util.inspect.custom` is available.
   */
  [inspect.custom]() {
    return AppError.format(this);
  }

  /**
   * Use AppError#format when AppError is passed to JSON.stringify().
   * This is used in the lbu insight logger in production mode.
   */
  toJSON() {
    return AppError.format(this);
  }
}
