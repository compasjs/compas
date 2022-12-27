import { fileContextSetIndent } from "./context.js";
import { fileWrite, fileWriteInline, fileWriteNewLine } from "./write.js";

/**
 * Start a new block. This system can only be used for targets that use `{` and `}`
 * around if-blocks, etc.
 *
 * @param {import("./context").GenerateFile} file
 * @param {string} contents
 * @returns {void}
 */
export function fileBlockStart(file, contents) {
  fileWrite(file, `${contents} {`);
  fileContextSetIndent(file, 1);
}

/**
 * End a block, dedent the file.
 *
 * @param {import("./context").GenerateFile} file
 * @returns {void}
 */
export function fileBlockEnd(file) {
  fileContextSetIndent(file, -1);
  fileWriteInline(file, `} `);
}

/**
 * Check if we need to finish the line of block ends.
 *
 * @param {import("./context").GenerateFile} file
 * @param {string} contents
 * @returns {void}
 */
export function fileBlockCheck(file, contents) {
  if (!file.contents.endsWith("} ")) {
    return;
  }

  if (!contents.trim().startsWith("else")) {
    fileWriteNewLine(file);
  }
}
