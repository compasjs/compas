import { isNil } from "./lodash.js";

/**
 * AppErrors represent errors, that should immediately stop the request and return a
 * status and other meta data directly
 */
export class AppError extends Error {
  /**
   * Create a new AppError
   *
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

    if (isNil(key) || isNil(status)) {
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
   * Throw a new 404 not found error
   *
   * @param {object} [info={}]
   * @param {Error} [error]
   * @returns {AppError}
   */
  static notFound(info = {}, error = undefined) {
    return new AppError("error.server.notFound", 404, info, error);
  }

  /**
   * Throw a new 405 Not implemented error
   *
   * @param {object} [info={}]
   * @param {Error} [error]
   * @returns {AppError}
   */
  static notImplemented(info = {}, error = undefined) {
    return new AppError("error.server.notImplemented", 405, info, error);
  }

  /**
   * Throw a new 500 internal server error
   *
   * @param {object} [info={}]
   * @param {Error} [error]
   * @returns {AppError}
   */
  static serverError(info = {}, error = undefined) {
    return new AppError("error.server.internal", 500, info, error);
  }

  /**
   * Throw a new 400 validation error
   *
   * @param {string} key
   * @param {object} [info={}]
   * @param {Error} [error]
   * @returns {AppError}
   */
  static validationError(key, info = {}, error = undefined) {
    return new AppError(key, 400, info, error);
  }
}
