/**
 * Raw append the contents to the file.
 *
 * This ignores the formatting of indentation and newlines.
 *
 * @param {import("./context").GenerateFile} file
 * @param {string} contents
 */

export function fileWriteRaw(file, contents) {
  file.contents += contents;
}

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
export function fileWrite(file, contents) {
  for (const line of contents.split("\n")) {
    file.contents += `${file.indentationValue.repeat(
      file.indentationLevel,
    )}${line}\n`;
  }
}
