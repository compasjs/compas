/**
 * Format the provided contents as an inline comment for the specific file.
 *
 * @param {import("./context").GenerateFile} file
 * @param {string} contents
 * @returns {string}
 */
export function fileFormatInlineComment(
  file: import("./context").GenerateFile,
  contents: string,
): string;
/**
 * Format the provided contents as a doc block comment. Compatible with things like JSDoc
 * blocks.
 *
 * @param {import("./context").GenerateFile} file
 * @param {string} contents
 * @returns {void}
 */
export function fileWriteDocBlock(
  file: import("./context").GenerateFile,
  contents: string,
): void;
//# sourceMappingURL=docs.d.ts.map
