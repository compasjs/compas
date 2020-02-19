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
 * @callback
 * @param {...Object=} Any value
 * @returns {Object}
 */
const merge = lodashMerge;

module.exports = {
  isNil,
  isPlainObject,
  merge,
};
