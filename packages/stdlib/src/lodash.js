import lodashMerge from "lodash.merge";

/**
 * Check if item is null or undefined
 *
 * @param {*=} item
 * @returns {boolean}
 */
export function isNil(item) {
  return item === null || item === undefined;
}

/**
 * Check if item is a plain javascript object
 * Not completely bullet proof
 *
 * @param {*=} item
 * @returns {boolean}
 */
export function isPlainObject(item) {
  return (
    typeof item === "object" &&
    !isNil(item) &&
    item.constructor === Object &&
    Object.prototype.toString.call(item) === "[object Object]"
  );
}

/**
 * Re expose lodash.merge
 * TODO: Note that lodash.merge is deprecated although it doesnt say so when installing
 * **Note:** This method mutates `object`.
 *
 * @param {object} object The destination object.
 * @param {...object} [sources] The source objects.
 * @returns {object} Returns `object`.
 */
export const merge = lodashMerge;

/**
 * Flattens the given nested object, skipping anything that is not a plain object
 *
 * @param {object} data The object to serialize
 * @param [result]
 * @param [path]
 * @returns {object.<string, *>}
 */
export function flatten(data, result = {}, path = "") {
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
}

/**
 * Opposite of flatten
 *
 * @param {object} data
 * @returns {object}
 */
export function unFlatten(data) {
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
}

/**
 * @param input
 */
export function camelToSnakeCase(input) {
  return input
    .replace(/(.)([A-Z][a-z]+)/, "$1_$2")
    .replace(/([a-z0-9])([A-Z])/, "$1_$2")
    .toLowerCase();
}
