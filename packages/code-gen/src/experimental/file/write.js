import { fileBlockCheck } from "./block.js";

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
 * Append indentation to the file. It makes sure that this is only added once on a single
 * line.
 *
 * It does not check if it is called as the first thing on a new line.
 *
 * @param {import("./context").GenerateFile} file
 */
export function fileWriteLinePrefix(file) {
  if (file.lineState.hasWrittenLinePrefix) {
    return;
  }

  file.lineState.hasWrittenLinePrefix = true;
  fileWriteRaw(file, file.calculatedLinePrefix);
}

/**
 * Set writer to a new line, resetting currentLine values.
 *
 * @param {import("./context").GenerateFile} file
 */
export function fileWriteNewLine(file) {
  file.lineState.hasWrittenLinePrefix = false;
  fileWriteRaw(file, "\n");
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
  fileBlockCheck(file, contents);

  for (const line of contents.split("\n")) {
    fileWriteLinePrefix(file);
    fileWriteRaw(file, line);
    fileWriteNewLine(file);
  }
}

/**
 * Write contents inline. Does not have a special handling of newline characters.
 *
 *
 * @param {import("./context").GenerateFile} file
 * @param {string} contents
 */
export function fileWriteInline(file, contents) {
  fileWriteLinePrefix(file);
  fileWriteRaw(file, contents);
}
