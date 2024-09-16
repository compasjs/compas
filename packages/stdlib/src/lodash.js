import lodashMerge from "lodash.merge";

/**
 * Check if a value is `null` or `undefined`
 *
 * @since 0.1.0
 *
 * @param {any|null|undefined} [item]
 * @returns {item is null | undefined}
 */
export function isNil(item) {
  return item === null || item === undefined;
}

/**
 * Check if a value is a plain JavaScript object.
 *
 * @since 0.1.0
 *
 * @param {*} [item]
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
 * Deep merge source objects on to 'target'. Mutates 'target' in place.
 *
 * @function
 * @since 0.1.0
 *
 * @type {(target: any, ...sources: Array<any>) => object}
 * @param {object} target The destination object.
 * @param {...object} [sources] The source objects.
 * @returns {object} Returns `object`.
 */
export const merge = lodashMerge;

/**
 * Flatten nested objects in to a new object where the keys represent the original access
 * path. Only goes through plain JavaScript objects and ignores arrays.
 *
 * @since 0.1.0
 *
 * @param {object} data The object to serialize
 * @param {*} [result]
 * @param {string} [path]
 * @returns {Record<string, any>}
 */
export function flatten(data, result = {}, path = "") {
  for (const key of Object.keys(data)) {
    let resultPath = `${path}.${key}`;
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
 * The opposite of 'flatten'.
 *
 * @since 0.1.0
 *
 * @param {Record<string, any>} data
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
 *
 * @since 0.1.0
 *
 * @param {string} input
 * @returns {string}
 */
export function camelToSnakeCase(input) {
  return input
    .replace(/(.)([A-Z][a-z]+)/g, "$1_$2")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase()
    .trim();
}
