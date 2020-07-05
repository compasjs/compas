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
}
