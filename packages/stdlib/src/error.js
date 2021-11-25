// @ts-nocheck

import { inspect } from "util";
import { isNil } from "./lodash.js";

/**
 * Standard error to use. This contains a key, status code and info object.
 * Mostly provided to make it easier to return errors from your API's.
 *
 * @since 0.1.0
 * @class
 */
export class AppError extends Error {
  /**
   * @param {string} key
   * @param {number} status
   * @param {Record<string, any>} [info={}]
   * @param {Error} [cause]
   */
  constructor(key, status, info, cause) {
    super();

    this.key = key;
    this.status = status;
    this.info = info || {};
    this.cause = cause;

    Object.setPrototypeOf(this, AppError.prototype);

    if (typeof status !== "number" || typeof key !== "string") {
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
   * @returns {value is AppError}
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
   * @param {Record<string, any>} [info={}]
   * @param {Error} [error]
   * @returns {AppError}
   */
  static notFound(info = {}, error = undefined) {
    return new AppError("error.server.notFound", 404, info, error);
  }

  /**
   * @param {Record<string, any>} [info={}]
   * @param {Error} [error]
   * @returns {AppError}
   */
  static notImplemented(info = {}, error = undefined) {
    return new AppError("error.server.notImplemented", 405, info, error);
  }

  /**
   * @param {Record<string, any>} [info={}]
   * @param {Error} [error]
   * @returns {AppError}
   */
  static serverError(info = {}, error = undefined) {
    return new AppError("error.server.internal", 500, info, error);
  }

  /**
   * @param {string} key
   * @param {Record<string, any>} [info={}]
   * @param {Error} [error]
   * @returns {AppError}
   */
  static validationError(key, info = {}, error = undefined) {
    return new AppError(key, 400, info, error);
  }

  /**
   * Format any error skipping the stack automatically for nested errors
   *
   * @param {AppError|Error|undefined|null|{}|string|number|boolean|function|unknown} [e]
   * @returns {Record<string, any>}
   */
  static format(e) {
    if (isNil(e)) {
      return {
        warning: "Missing error",
      };
    }

    const typeOf = typeof e;

    if (typeOf === "symbol") {
      return {
        warning: "Can't serialize Symbol",
      };
    }

    if (typeOf === "bigint") {
      return {
        warning: "Can't serialize BigInt",
      };
    }

    if (typeOf === "string" || typeOf === "boolean" || typeOf === "number") {
      return {
        value: e,
      };
    }

    if (typeOf === "function") {
      return {
        type: "function",
        name: e.name,
        parameterLength: e.length,
      };
    }

    const stack = (e?.stack ?? "").split("\n").map((it) => it.trim());
    // Remove first element as this is the Error name
    stack.shift();

    if (isNil(e)) {
      return e;
    } else if (AppError.instanceOf(e)) {
      return {
        key: e.key,
        status: e.status,
        info: e.info,
        stack,
        cause: e.cause ? AppError.format(e.cause) : undefined,
      };
    } else if (e.name === "AggregateError") {
      return {
        name: e.name,
        message: e.message,
        stack: stack,
        cause: e.errors?.map((it) => AppError.format(it)),
      };
    } else if (e.name === "PostgresError") {
      return {
        name: e.name,
        message: e.message,
        postgres: {
          severity: e?.severity,
          code: e?.code,
          position: e?.position,
          routine: e?.routine,
        },
        stack,
      };
    } else if (e.isAxiosError) {
      return {
        name: e.name,
        message: e.message,
        axios: {
          requestPath: e.request?.path,
          requestMethod: e.request?.method,
          responseStatus: e.response?.status,
          responseHeaders: e.response?.headers,
          responseBody: e.response?.data,
        },
        stack,
      };
    } else if (typeof e.toJSON === "function") {
      const result = e.toJSON();
      result.stack = stack;
      return result;
    }

    // Any unhandled case
    return {
      name: e.name,
      message: e.message,
      stack,
      cause: e.cause ? AppError.format(e.cause) : undefined,
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
   * This is used in the compas insight logger in production mode.
   */
  toJSON() {
    return AppError.format(this);
  }
}
