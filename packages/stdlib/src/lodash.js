const lodashMerge = require("lodash.merge");

/**
 * Check if item is null or undefined
 * @param {*=} item
 * @returns {boolean}
 */
const isNil = item => item === null || item === undefined;

/**
 * Check if item is a plain javascript object
 * Not completely bullet proof
 * @param {*=} item
 * @returns {boolean}
 */
const isPlainObject = item =>
  typeof item === "object" &&
  !isNil(item) &&
  item.constructor === Object &&
  Object.prototype.toString.call(item) === "[object Object]";

/**
 * Re expose lodash.merge
 * **Note:** This method mutates `object`.
 *
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 */
const merge = lodashMerge;

module.exports = {
  isNil,
  isPlainObject,
  merge,
};
