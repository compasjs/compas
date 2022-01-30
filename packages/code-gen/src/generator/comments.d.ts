/**
 * Escape special chars and normalize indentation.
 *
 * @param {import("../generated/common/types.js").CodeGenContext} context
 */
export function formatDocStringsOfTypes(
  context: import("../generated/common/types.js").CodeGenContext,
): void;
/**
 * Trim single line strings;
 * For multiline strings, all ends are trimmed, and if the first line with characters
 * starts with whitespace, all matching whitespace from the following lines is trimmed as
 * well.
 *
 * @param {string} input
 * @returns {string}
 */
export function normalizeIndentationAndTrim(input: string): string;
/**
 * Format doc string using one of the supported comment formats
 *
 * @param {string} str
 * @param {{
 *   format: "jsdoc"|"endOfLine"|"partialLine",
 *   indentSize?: number,
 * }} options
 */
export function formatDocString(
  str: string,
  {
    format,
    indentSize,
  }: {
    format: "jsdoc" | "endOfLine" | "partialLine";
    indentSize?: number;
  },
): string;
//# sourceMappingURL=comments.d.ts.map
