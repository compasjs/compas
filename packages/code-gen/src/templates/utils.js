/**
 * Clean template output by removing redundant new lines
 * @param {string} str
 * @returns {string}
 */
export function cleanTemplateOutput(str) {
  return str
    .replace(/^(\s*\r?\n){1,}/gm, "\n") // Replace multiple new lines
    .replace(/\s+$/g, "") // Replace end of line whitespace
    .replace(/^\s*\*\s*\n+/gm, "") // replace empty lines in JSDoc
    .replace(/\n\n\n/gm, "\n\n"); // Remove too much empty lines
}
