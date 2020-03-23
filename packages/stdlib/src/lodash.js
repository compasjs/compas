import lodashMerge from "lodash.merge";

/**
 * Check if item is null or undefined
 * @param {*=} item
 * @returns {boolean}
 */
export const isNil = (item) => item === null || item === undefined;

/**
 * Check if item is a plain javascript object
 * Not completely bullet proof
 * @param {*=} item
 * @returns {boolean}
 */
export const isPlainObject = (item) =>
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

/**
 * Flattens the given nested object, skipping anything that is not a plain object
 * @param {Object} data The object to serialize
 * @param [result]
 * @param [path]
 * @return {Object.<string, *>}
 */
export const flatten = (data, result = {}, path = "") => {
  for (const key of Object.keys(data)) {
    let resultPath = path + "." + key;
    if (path === "") {
      resultPath = key;
    }
    const value = data[key];

    if (!isPlainObject(value)) {
      result[resultPath] = value;
    } else {
      flatten(value, result, resultPath);
    }
  }

  return result;
};

/**
 * Opposite of flatten
 * @param {Object} data
 * @return {Object}
 */
export const unFlatten = (data) => {
  const result = {};
  for (const key of Object.keys(data)) {
    const value = data[key];
    const keyParts = key.split(".");

    let tmpObject = result;
    for (const part of keyParts.slice(0, keyParts.length - 1)) {
      if (isNil(tmpObject[part]) || !isPlainObject(tmpObject[part])) {
        tmpObject[part] = {};
      }
      tmpObject = tmpObject[part];
    }
    tmpObject[keyParts[keyParts.length - 1]] = value;
  }

  return result;
};
