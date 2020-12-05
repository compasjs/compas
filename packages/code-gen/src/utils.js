import { isPlainObject } from "@compas/stdlib";

/**
 * @param {*} data
 * @param {string} type
 * @returns {string[]}
 */
export function getGroupsThatIncludeType(data, type) {
  if (!isPlainObject(data)) {
    throw new Error(`data should be an object.`);
  }

  const result = [];

  for (const groupData of Object.values(data)) {
    for (const item of Object.values(groupData)) {
      if (item.type === type) {
        result.push(item.group);
        break;
      }
    }
  }

  return result;
}

/**
 * Uppercase first character of the input string
 *
 * @param {string} str input string
 * @returns {string}
 */
export function upperCaseFirst(str) {
  return str.length > 0 ? str[0].toUpperCase() + str.substring(1) : "";
}

/**
 * Lowercase first character of the input string
 *
 * @param {string} str input string
 * @returns {string}
 */
export function lowerCaseFirst(str) {
  return str.length > 0 ? str[0].toLowerCase() + str.substring(1) : "";
}
