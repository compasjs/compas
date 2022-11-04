/**
 * Raw append the contents to the file.
 *
 * This ignores the formatting of indentation and newlines.
 *
 * @param {import("./context").GenerateFile} file
 * @param {string} contents
 */
export function fileWriteRaw(
  file: import("./context").GenerateFile,
  contents: string,
): void;
/**
 * Write contents to the file.
 *
 * - Indents each line with the current indent level
 * - Makes sure that we always end up with a new line. This enforces the consumers of
 * this writer to format full expressions before writing anything.
 *
 * @param {import("./context").GenerateFile} file
 * @param {string} contents
 */
export function fileWrite(
  file: import("./context").GenerateFile,
  contents: string,
): void;
//# sourceMappingURL=write.d.ts.map
