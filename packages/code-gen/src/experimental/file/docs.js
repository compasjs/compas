import {
  fileContextAddLinePrefix,
  fileContextRemoveLinePrefix,
} from "./context.js";
import { fileWrite } from "./write.js";

/**
 * Format the provided contents as an inline comment for the specific file.
 *
 * @param {import("./context").GenerateFile} file
 * @param {string} contents
 * @returns {string}
 */
export function fileFormatInlineComment(file, contents) {
  return `${file.inlineCommentPrefix}${contents.replace(
    /\n/g,
    `\n${file.inlineCommentPrefix}`,
  )}`;
}

/**
 * Format the provided contents as a doc block comment. Compatible with things like JSDoc
 * blocks.
 *
 * @param {import("./context").GenerateFile} file
 * @param {string} contents
 * @returns {void}
 */
export function fileWriteDocBlock(file, contents) {
  fileWrite(file, `/**`);
  fileContextAddLinePrefix(file, " * ");
  fileWrite(file, contents);

  fileContextRemoveLinePrefix(file, 3);
  fileWrite(file, " */");
}
