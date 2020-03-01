import lodashMerge from "lodash.merge";

/**
 * Check if item is null or undefined
 * @param {*=} item
 * @returns {boolean}
 */
export const isNil = item => item === null || item === undefined;

/**
 * Check if item is a plain javascript object
 * Not completely bullet proof
 * @param {*=} item
 * @returns {boolean}
 */
export const isPlainObject = item =>
  typeof item === "object" &&
  !isNil(item) &&
  item.constructor === Object &&
  Object.prototype.toString.call(item) === "[object Object]";

/**
 * Re expose lodash.merge
 * TODO: Note that lodash.merge is deprecated although it doesnt say so when installing
 * **Note:** This method mutates `object`.
 *
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 */
export const merge = lodashMerge;
