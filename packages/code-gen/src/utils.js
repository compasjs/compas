/**
 * Uppercase first character of the input string
 *
 * @param {string|undefined} [str] input string
 * @returns {string}
 */
export function upperCaseFirst(str = "") {
  return str.length > 0 ? str[0].toUpperCase() + str.substring(1) : "";
}

/**
 * Lowercase first character of the input string
 *
 * @param {string|undefined} [str] input string
 * @returns {string}
 */
export function lowerCaseFirst(str = "") {
  return str.length > 0 ? str[0].toLowerCase() + str.substring(1) : "";
}
