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
 * Append indentation to the file. It makes sure that this is only added once on a single
 * line.
 *
 * It does not check if it is called as the first thing on a new line.
 *
 * @param {import("./context").GenerateFile} file
 */
export function fileWriteLinePrefix(
  file: import("./context").GenerateFile,
): void;
/**
 * Set writer to a new line, resetting currentLine values.
 *
 * @param {import("./context").GenerateFile} file
 */
export function fileWriteNewLine(file: import("./context").GenerateFile): void;
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
/**
 * Write contents inline. Does not have a special handling of newline characters.
 *
 * @param {import("./context").GenerateFile} file
 * @param {string} contents
 */
export function fileWriteInline(
  file: import("./context").GenerateFile,
  contents: string,
): void;
//# sourceMappingURL=write.d.ts.map
