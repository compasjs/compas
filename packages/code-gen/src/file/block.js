import { fileContextSetIndent } from "./context.js";
import { fileWrite } from "./write.js";

/**
 * Start a new block. This system can only be used for targets that use `{` and `}`
 * around if-blocks, etc.
 *
 * @param {import("./context.js").GenerateFile} file
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
 * @param {import("./context.js").GenerateFile} file
 * @returns {void}
 */
export function fileBlockEnd(file) {
  fileContextSetIndent(file, -1);
  fileWrite(file, `}`);
}
