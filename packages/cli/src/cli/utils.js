/**
 * Lowercase first character of the input string
 *
 * @param {string|undefined} [str] input string
 * @returns {string}
 */
export function lowerCaseFirst(str = "") {
  return str.length > 0 ? str[0].toLowerCase() + str.substring(1) : "";
}

/**
 * Converts 'code-mod', 'code_mod' to 'codeMod'
 * @param {string} str
 * @returns {string}
 */
export function snakeToCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace("-", "").replace("_", ""),
    );
}
